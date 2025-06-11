import { NextFunction, Request, Response } from "express";
import {
  generateAdminCSRFToken,
  generateAdminSessionId,
} from "../utils/adminTokens.js";
import crypto from "crypto";

if (!process.env.ADMIN_CSRF_TOKEN_SECRET) {
  throw new Error("ADMIN_CSRF_TOKEN_SECRET is not defined in dotenv");
}
const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;
const CSRF_SECRET = process.env.ADMIN_CSRF_TOKEN_SECRET;

export const adminCSRFMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const csrfHeader = decodeURIComponent(
      String(req.headers["x-csrf-token"]).trim()
    );
    const sessionId = req.cookies.sessionId;

    if (!csrfHeader || !sessionId)
      throw new Error("CSRF or sessionId token missing");

    const [receivedHmac, receivedTimestamp] = csrfHeader.split(":");
    const expiryTime = 15 * 60 * 1000;

    // first checking validity of CSRF token
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(`${sessionId}|${receivedTimestamp}`);
    const expectedHmac = hmac.digest("hex");

    if (receivedHmac !== expectedHmac) {
      console.log("Invalid CSRF token recieved", {
        user: req?.body?.user,
      });
      throw new Error("Invalid CSRF token");
    }

    //now checking if token is expired or not
    if (Date.now() - parseInt(receivedTimestamp) > expiryTime) {
      console.log("CSRF token expired, regenerating CSRF token and session ID");

      const newSessionId = generateAdminSessionId();
      res.cookie("sessionId", newSessionId, {
        secure: secureCookie,
        sameSite: sameSite,
        httpOnly: true,
      });
      const token = generateAdminCSRFToken(newSessionId);
      res.cookie("csrf_token", token, {
        secure: secureCookie,
        sameSite: sameSite,
        httpOnly: false,
      });
      return next();
    } else {
      console.log("CSRF token is valid, proceeding with request");
      return next();
    }
  } catch (err: any) {
    res.status(403).json({ error: "Security violation", message: err.message });
    return;
  }
};
