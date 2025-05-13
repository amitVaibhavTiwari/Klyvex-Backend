import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { Response } from "express";
import {
  userEmailRepository,
  accountUserRepository,
} from "../../repositories/repositories.js";
import { AccountUser } from "../../entities/AccountUser.js";
import { UserEmail } from "../../entities/UserEmail.js";
import { comparePasswords, hashPassword } from "../../utils/password.js";
import { generateOTP } from "../../utils/OTP.js";
import { sendRegistrationOtpEmail } from "../../utils/email.js";
import { validate } from "class-validator";
import {
  GetUserDetailsResponse,
  GetUserDetailsViaCookieResponse,
  LoginUserResponse,
  LogoutUserResponse,
  UserRegisterResponse,
  VerifyEmailRegisterOtpResponse,
} from "./types.js";
import { EntityManager } from "typeorm";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { isAuthenticated } from "../../middlewares/AuthMiddleware.js";

if (!process?.env?.SAME_SITE_COOKIES) {
  throw new Error("SAME_SITE_COOKIES is not defined in .env");
}
if (!process?.env?.SECURE_COOKIES) {
  throw new Error("SECURE_COOKIES is not defined in .env");
}

const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;

@Resolver(AccountUser)
export class AccountUserResolver {
  @Query(() => GetUserDetailsResponse, { nullable: true })
  async getUserDetails(
    @Arg("id", () => String) id: string
  ): Promise<GetUserDetailsResponse> {
    try {
      const user = await accountUserRepository.findOne({
        where: { id },
        relations: ["UserEmail", "UserAddress", "UserPhone"],
      });
      if (!user) {
        throw new Error("No User Found.");
      }
      return { user: user };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  @Query(() => GetUserDetailsViaCookieResponse, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async getUserDetailsViaCookie(
    @Ctx() ctx: any
  ): Promise<GetUserDetailsViaCookieResponse> {
    try {
      const user = await accountUserRepository.findOne({
        where: { id: ctx.user.userID },
        relations: ["UserEmail", "UserAddress", "UserPhone"],
      });
      if (!user) {
        throw new Error("No User Found.");
      }
      return { user: user };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  // to register new user (otp will sent after creating user to verify email.)
  @Mutation(() => UserRegisterResponse)
  async registerUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name") name: string
  ): Promise<UserRegisterResponse> {
    try {
      const user = new AccountUser();
      const userEmail = new UserEmail();

      user.name = name;
      userEmail.email = email;
      userEmail.password = password;

      const userErrors = await validate(user);
      const userEmailErrors = await validate(userEmail);
      const errors = [...userErrors, ...userEmailErrors];

      if (errors.length > 0) {
        throw new Error(
          errors.map((e) => Object.values(e.constraints || {})).join(", ")
        );
      }

      const earlyUser = await userEmailRepository.findOneBy({
        email: email,
      });
      if (earlyUser) {
        throw new Error("Email already used.");
      }

      const hashedPassword = await hashPassword(password);
      userEmail.password = hashedPassword;

      // instead of saving user and userEmail separately, we can use transaction to save both in one go. It gives a benefit that if user is failed to save, userEmail will not be saved.
      // await userRepository.save(user);
      // const newUserEmail = await userEmailRepository.save(userEmail);

      await accountUserRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await transactionalEntityManager.save(user);

          userEmail.AccountUser = user; // Link UserEmail to User

          await transactionalEntityManager.save(userEmail);
        }
      );

      const OTP = generateOTP(8);
      const sendOtp = await sendRegistrationOtpEmail(OTP, email);
      if (sendOtp?.sent == true) {
        userEmail.lastOtpSent = OTP;
        userEmail.lastOtpSentTime = new Date();
        userEmail.otpExpiry = new Date(Date.now() + 60000 * 5);
        await userEmailRepository.save(userEmail);
        return {
          otpSent: true,
        };
      } else {
        return {
          otpSent: false,
          error: sendOtp?.error?.message || "Internal Server Error",
        };
      }
    } catch (error) {
      return {
        otpSent: false,
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  // to verify otp sent to email.
  @Mutation(() => VerifyEmailRegisterOtpResponse)
  async verifyEmailRegisterOtp(
    @Arg("email") email: string,
    @Arg("otp") otp: string,
    @Ctx() ctx: { res: Response }
  ): Promise<VerifyEmailRegisterOtpResponse> {
    try {
      const userEmail = await userEmailRepository.findOne({
        where: { email: email },
        relations: ["AccountUser"],
      });

      if (!userEmail) {
        throw new Error("Email not found.");
      }

      if (
        userEmail?.lastOtpSent &&
        userEmail?.lastOtpSentTime &&
        userEmail?.otpExpiry
      ) {
        if (userEmail.otpExpiry < new Date()) {
          throw new Error("OTP expired.");
        }

        if (userEmail.lastOtpSent != otp) {
          throw new Error("Invalid OTP.");
        }

        if (userEmail.lastOtpSent == otp) {
          userEmail.isVerified = true;
          userEmail.lastOtpSent = null;
          userEmail.lastOtpSentTime = null;
          userEmail.otpExpiry = null;
          userEmail.retryCount = null;
          await userEmailRepository.save(userEmail);

          const accessToken = generateAccessToken({
            userId: userEmail.AccountUser.id,
          });
          const refreshToken = await generateRefreshToken({
            userId: userEmail.AccountUser.id,
          });

          ctx.res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: secureCookie,
            sameSite: sameSite,
            maxAge: 1000 * 60 * 60, // 1 hour
          });

          ctx.res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: secureCookie,
            sameSite: sameSite,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          });

          return {
            otpVerified: true,
          };
        }
      } else {
        throw new Error("OTP not sent to this email.");
      }

      //default resp
      return {
        otpVerified: false,
        error: "Internal Server Error.",
      };
    } catch (error) {
      return {
        otpVerified: false,
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  // to login user
  @Mutation(() => LoginUserResponse)
  async loginUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: { res: Response }
  ): Promise<LoginUserResponse> {
    try {
      const userEmail = await userEmailRepository.findOne({
        where: { email: email },
        relations: ["AccountUser"],
      });

      if (!userEmail) {
        throw new Error("Invalid Email or Password.");
      }

      if (userEmail.isVerified == false) {
        throw new Error("Email not verified.");
      }

      const hashedPassword = userEmail.password;
      const isPasswordMatch = await comparePasswords(password, hashedPassword);
      if (!isPasswordMatch) {
        throw new Error("Invalid Email or Password.");
      }

      const accessToken = generateAccessToken({
        userId: userEmail.AccountUser.id,
      });
      const refreshToken = await generateRefreshToken({
        userId: userEmail.AccountUser.id,
      });

      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60, // 1 hour
      });

      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return {
        loginSuccess: true,
      };
    } catch (error) {
      return {
        loginSuccess: false,
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  // to logout user
  @Mutation(() => LogoutUserResponse)
  async logoutUser(@Ctx() ctx: { res: Response }): Promise<LogoutUserResponse> {
    try {
      ctx.res.clearCookie("accessToken");
      ctx.res.clearCookie("refreshToken");
      return {
        logoutSuccess: true,
      };
    } catch (error) {
      return {
        logoutSuccess: false,
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
