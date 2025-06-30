import { MiddlewareFn } from "type-graphql";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { generateAccessToken } from "../utils/token.js";
import { accountUserRepository } from "../repositories/repositories.js";
if (!process?.env?.SAME_SITE_COOKIES) {
  throw new Error("SAME_SITE_COOKIES is not defined in .env");
}
if (!process?.env?.SECURE_COOKIES) {
  throw new Error("SECURE_COOKIES is not defined in .env");
}
if (!process?.env?.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in .env");
}
if (!process?.env?.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined in .env");
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
      const decoded = jwt.verify(accessToken, ACCESS_SECRET);
      context.user = decoded;
      return next();
    }

    if (refreshToken) {
      const decodedRefresh: any = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = await accountUserRepository.findOne({
        where: { id: decodedRefresh.userId },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // before generating new access token, first check for tokenId from db and tokenId from decoded token.
      // (this thing will help in future for blocking the refresh token for some user.)
      if (user.tokenId !== decodedRefresh.tokenId) {
        console.warn(
          "Invalid or expired refresh tokenId used.",
          decodedRefresh.tokenId
        );
        throw new Error("Invalid refresh tokenId.");
      }
      const newAccessToken = generateAccessToken({ userId: user.id });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60,
      });

      context.user = { userId: user.id };
      return next();
    }

    return {
      error: "Unauthorized",
    };
  } catch (error) {
    return {
      error: (error as Error).message || "Authentication failed.",
    };
  }
};
