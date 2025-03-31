import jwt from "jsonwebtoken";
import { accountUserRepository } from "../repositories/repositories.js";
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

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

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
