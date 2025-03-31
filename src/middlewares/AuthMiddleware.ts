import { MiddlewareFn } from "type-graphql";
import { Request, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { accountUserRepository } from "../repositories/repositories.js";
if (!process?.env?.SAME_SITE_COOKIES) {
  throw new Error("SAME_SITE_COOKIES is not defined in .env");
}
if (!process?.env?.SECURE_COOKIES) {
  throw new Error("SECURE_COOKIES is not defined in .env");
}

const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;

export const isAuthenticated: MiddlewareFn<{
  req: Request;
  res: Response;
  user?: any;
}> = async ({ context }, next) => {
  const { req, res } = context;
  const accessToken = req?.cookies?.accessToken;
  const refreshToken = req?.cookies?.refreshToken;

  try {
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      context.user = decoded; // Attaching user info to context
      return next();
    }
  } catch (error) {
    console.log("Access Token Expired or Invalid");
  }

  if (refreshToken) {
    try {
      const decodedRefresh: any = verifyRefreshToken(refreshToken);
      const user = await accountUserRepository.findOne({
        where: { id: decodedRefresh.userId },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // before generating new access token, first check for tokenId from db and tokenId from decoded token.
      // (this thing will help in future for blocking the refresh token for some user.)
      if (user.tokenId !== decodedRefresh.tokenId) {
        throw new Error("Invalid refresh tokenId.");
      }

      const newAccessToken = generateAccessToken({ userId: user.id });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60, // 1 hour
      });

      context.user = { userId: user.id };
      return next();
    } catch (error) {
      console.log("Refresh Token Expired or Invalid");
    }
  }

  throw new Error("Not authenticated. Please log in.");
};
