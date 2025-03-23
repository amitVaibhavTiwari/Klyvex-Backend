import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
  userEmailRepository,
  accountUserRepository,
} from "../../repositories/repositories.js";
import { AccountUser } from "../../entities/AccountUser.js";
import { UserEmail } from "../../entities/UserEmail.js";
import { hashPassword } from "../../utils/password.js";
import { generateOTP } from "../../utils/OTP.js";
import { sendRegistrationOtpEmail } from "../../utils/email.js";
import { validate } from "class-validator";
import { GetUserDetailsResponse, UserRegisterResponse } from "./types.js";
import { EntityManager } from "typeorm";

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
}
