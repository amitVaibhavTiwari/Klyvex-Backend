import { MiddlewareFn } from "type-graphql";
import { Request, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { accountUserRepository } from "../repositories/repositories.js";

export const isAuthenticated: MiddlewareFn<{
  req: Request;
  res: Response;
  user?: any;
}> = async ({ context }, next) => {
  const { req, res } = context;
  const accessToken = req?.cookies?.accessToken;
  const refreshToken = req?.cookies?.refreshToken;

  try {
    // Check if access token is valid
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      context.user = decoded; // Attach user info to context
      return next();
    }
  } catch (error) {
    console.log("Access Token Expired or Invalid");
  }

  // Check if refresh token is valid and generate new access token if access token is expired.
  if (refreshToken) {
    try {
      const decodedRefresh: any = verifyRefreshToken(refreshToken);
      const user = await accountUserRepository.findOne({
        where: { id: decodedRefresh.userId },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // before generating new refresh token, check for tokenId from db and tokenId from decoded token.
      if (user.tokenId !== decodedRefresh.tokenId) {
        throw new Error("Invalid refresh tokenId.");
      }

      const newAccessToken = generateAccessToken({ userId: user.id });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
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
