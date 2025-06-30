import jwt from "jsonwebtoken";
import crypto from "crypto";
import { accountUserRepository } from "../repositories/repositories.js";
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in dotenv");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined in dotenv");
}
if (!process.env.CSRF_TOKEN_SECRET) {
  throw new Error("CSRF_TOKEN_SECRET is not defined in dotenv");
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const CSRF_SECRET = process.env.CSRF_TOKEN_SECRET;

type Payload = {
  userId: string;
};

// Access Token (valid for 1 hour)
export const generateAccessToken = (payload: Payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
};

//  Refresh Token (valid for 7 days)
export const generateRefreshToken = async (payload: Payload) => {
  const user = await accountUserRepository.findOne({
    where: { id: payload.userId },
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

export const generateCSRFToken = (sessionId: string) => {
  const timestamp = Date.now().toString();
  // token format: HMAC(sessionId + timestamp) + ":" + timestamp
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(`${sessionId}|${timestamp}`);
  const token = `${hmac.digest("hex")}:${timestamp}`;
  return token;
};

export const generateSessionId = () => {
  return crypto.randomBytes(32).toString("hex");
};
