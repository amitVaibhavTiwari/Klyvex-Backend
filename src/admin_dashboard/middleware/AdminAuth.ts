import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateAdminAccessToken } from "../utils/adminTokens.js";
import { adminUserRepository } from "../../repositories/repositories.js";

if (!process.env.ADMIN_ACCESS_TOKEN_SECRET) {
  throw new Error("ADMIN_ACCESS_TOKEN_SECRET is not defined in dotenv");
}
if (!process.env.ADMIN_REFRESH_TOKEN_SECRET) {
  throw new Error("ADMIN_REFRESH_TOKEN_SECRET is not defined in dotenv");
}

const ACCESS_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;

const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req?.cookies?.access_token;
  const refreshToken = req?.cookies?.refresh_token;

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, ACCESS_SECRET);
      req.body.user = decoded;
      return next();
    }

    if (refreshToken) {
      const decodedRefresh: any = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = await adminUserRepository.findOne({
        where: { id: decodedRefresh.userId },
      });

      if (!user) {
        res.status(401).json({
          status: "failed",
          message: "User not found.",
        });
        return;
      }

      // before generating new access token, we'll first check for tokenId from db and tokenId from decoded token.
      // (this thing will help in future for blocking the refresh token for some user.)
      if (user.tokenId !== decodedRefresh.tokenId) {
        console.warn(
          "Invalid or expired refresh tokenId used.",
          decodedRefresh.tokenId
        );
        res.status(401).json({ status: "failed", message: "Unauthorized" });
        return;
      }
      console.log("Valid refresh token, generating new access token...");

      const newAccessToken = generateAdminAccessToken({ userId: user.id });
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60,
      });

      req.body.user = { userId: user.id };
      return next();
    }

    res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
    return;
  } catch (error: any) {
    res.status(401).json({
      status: "failed",
      message: error?.message || "Unauthorized",
    });
    console.error("Auth Middleware Error:", error);
    return;
  }
};
