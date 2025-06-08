import crypto from "crypto";

if (!process.env.ADMIN_ENCRYPTION_KEY) {
  throw new Error("ADMIN_ENCRYPTION_KEY is not defined in dotenv");
}

const secretKey = process.env.ADMIN_ENCRYPTION_KEY;
const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

export const encryptAdminEmail = (email: string) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(email, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
      token: encrypted,
      iv: iv.toString("hex"),
    };
  } catch (error: any) {
    console.log("Error encrypting email:", error?.message);
    throw new Error("Failed to encrypt email");
  }
};

export const decryptAdminEmail = (token: string, ivHex: string) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(token, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
