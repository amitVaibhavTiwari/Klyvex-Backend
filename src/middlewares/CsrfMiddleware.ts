if (!process?.env?.ALLOWED_ORIGIN) {
  throw new Error("ALLOWED_ORIGIN is not defined in .env");
}

export const CsrfMiddleware = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV != "production") {
    next();
  } else {
    const origin = req.get("Origin");
    const referrer = req.get("Referer");
    if (
      origin &&
      referrer &&
      origin == process.env.ALLOWED_ORIGIN &&
      referrer.startsWith(process.env.ALLOWED_ORIGIN)
    ) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  }
};
