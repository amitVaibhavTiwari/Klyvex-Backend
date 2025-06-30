import { Request, Response } from "express";
import crypto from "crypto";
import { generateCSRFToken, generateSessionId } from "../utils/token.js";
import { MiddlewareFn } from "type-graphql";

if (!process.env.CSRF_TOKEN_SECRET) {
  throw new Error("CSRF_TOKEN_SECRET is not defined in dotenv");
}
const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;
const CSRF_SECRET = process.env.CSRF_TOKEN_SECRET;

export const CSRFMiddleware: MiddlewareFn<{
  req: Request;
  res: Response;
  user?: any;
}> = async ({ context }, next) => {
  const { req, res } = context;
  try {
    const csrfHeader = decodeURIComponent(
      String(req.headers["x-csrf-token"]).trim()
    );
    const sessionId = req.cookies.sessionId;

    if (!csrfHeader || !sessionId) {
      throw new Error("CSRF or sessionId token missing");
    }

    const [receivedHmac, receivedTimestamp] = csrfHeader.split(":");
    const expiryTime = 15 * 60 * 1000;

    // first checking validity of CSRF token
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(`${sessionId}|${receivedTimestamp}`);
    const expectedHmac = hmac.digest("hex");

    if (receivedHmac !== expectedHmac) {
      console.log("Invalid CSRF token recieved", {
        user: context?.user?.id,
      });
      throw new Error("Invalid CSRF token");
    }

    //now checking if token is expired or not
    if (Date.now() - parseInt(receivedTimestamp) > expiryTime) {
      console.log("CSRF token expired, regenerating CSRF token and session ID");

      const newSessionId = generateSessionId();
      res.cookie("sessionId", newSessionId, {
        secure: secureCookie,
        sameSite: sameSite,
        httpOnly: true,
      });
      const token = generateCSRFToken(newSessionId);
      res.cookie("csrfToken", token, {
        secure: secureCookie,
        sameSite: sameSite,
        httpOnly: false,
      });
      return next();
    } else {
      console.log("CSRF token is valid, proceeding with request");
      return next();
    }
  } catch (error: any) {
    return {
      error: (error as Error).message || "CSRF middleware failed.",
    };
  }
};
