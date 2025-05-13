import { NextFunction, Request, Response } from "express";
import {
  generateAdminAccessToken,
  verifyAdminAccessToken,
  verifyAdminRefreshToken,
} from "../../utils/adminTokens.js";
import { adminUserRepository } from "../../repositories/repositories.js";

const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req?.cookies?.accessToken;
  const refreshToken = req?.cookies?.refreshToken;

  try {
    if (accessToken) {
      const decoded = verifyAdminAccessToken(accessToken);
      req.body.user = decoded; // Attaching user info to request
      return next();
    }
  } catch (error) {
    console.log("Access Token Expired or Invalid");
  }

  if (refreshToken) {
    try {
      const decodedRefresh: any = verifyAdminRefreshToken(refreshToken);
      const user = await adminUserRepository.findOne({
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

      const newAccessToken = generateAdminAccessToken({ userId: user.id });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60, // 1 hour
      });

      req.body.user = { userId: user.id };
      return next();
    } catch (error) {
      console.log("Refresh Token Expired or Invalid");
    }
  }
  res.status(401).json({
    status: "failed",
    message: "Unauthorized",
  });
};
