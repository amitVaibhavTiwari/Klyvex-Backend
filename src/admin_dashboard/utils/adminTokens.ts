import jwt from "jsonwebtoken";
import crypto from "crypto";
import { adminUserRepository } from "../../repositories/repositories.js";
if (!process.env.ADMIN_ACCESS_TOKEN_SECRET) {
  throw new Error("ADMIN_ACCESS_TOKEN_SECRET is not defined in dotenv");
}
if (!process.env.ADMIN_REFRESH_TOKEN_SECRET) {
  throw new Error("ADMIN_REFRESH_TOKEN_SECRET is not defined in dotenv");
}
if (!process.env.ADMIN_CSRF_TOKEN_SECRET) {
  throw new Error("ADMIN_CSRF_TOKEN_SECRET is not defined in dotenv");
}

const ACCESS_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;
const CSRF_SECRET = process.env.ADMIN_CSRF_TOKEN_SECRET;

type Payload = {
  userId: number;
};

// Access Token (valid for 1 hour)
export const generateAdminAccessToken = (payload: Payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
};

//  Refresh Token (valid for 7 days)
export const generateAdminRefreshToken = async (payload: Payload) => {
  const user = await adminUserRepository.findOneBy({
    id: payload.userId,
  });

  if (!user) {
    throw new Error("User not found while generating refresh token.");
  }

  const refreshTokenPayload = {
    userId: user.id,
    tokenId: user.tokenId,
  };
  return jwt.sign(refreshTokenPayload, REFRESH_SECRET, { expiresIn: "7d" });
};

// CSRF Token (valid for 15 minutes)
export const generateAdminCSRFToken = (sessionId: string) => {
  const timestamp = Date.now().toString();
  // Token format: HMAC(sessionId + timestamp) + ":" + timestamp
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(`${sessionId}|${timestamp}`);
  const token = `${hmac.digest("hex")}:${timestamp}`;
  return token;
};

export const generateAdminSessionId = () => {
  return crypto.randomBytes(32).toString("hex");
};
