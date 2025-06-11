import { Request, Response } from "express";
import {
  adminUserRepository,
  permissionGroupRepository,
} from "../../../repositories/repositories.js";
import {
  generateAdminAccessToken,
  generateAdminCSRFToken,
  generateAdminRefreshToken,
  generateAdminSessionId,
} from "../../utils/adminTokens.js";
import {
  compareAdminPasswords,
  hashAdminPassword,
} from "../../utils/password.js";
import { decryptAdminEmail } from "../../utils/encryptToken.js";
import { validateDTO } from "../../utils/validateDto.js";
import {
  addSuperAdminDTO,
  loginStaffDTO,
  setStaffPasswordDTO,
  verifyStaffEmailDTO,
} from "./DTOs.js";

const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;

export const addSuperAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = await validateDTO(
    addSuperAdminDTO,
    req.body
  );

  const existingSuperAdmin = await adminUserRepository.findOneBy({
    AdminGroups: { name: "super_admin" },
  });

  if (existingSuperAdmin) {
    throw new Error("Super Admin already exists.");
  }

  const existingEmail = await adminUserRepository.findOneBy({
    email: email,
  });

  if (existingEmail) {
    throw new Error("Staff email already exists.");
  }

  const hashedPassword = await hashAdminPassword(password);

  const super_admin = await permissionGroupRepository.findOneBy({
    name: "super_admin",
  });

  if (!super_admin) {
    throw new Error("super_admin group not found.");
  }

  const newSuperAdmin = adminUserRepository.create({
    name: name,
    email: email,
    password: hashedPassword,
    AdminGroups: super_admin,
  });
  await adminUserRepository.save(newSuperAdmin);
  res.status(201).json({
    status: "success",
    message: "Super Admin created successfully.",
  });
};

export const loginStaff = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { password, email } = await validateDTO(loginStaffDTO, req.body);

  const staffMember = await adminUserRepository.findOneBy({
    email: email,
  });

  if (!staffMember) {
    res.status(401).json({
      status: "failed",
      message: "Invalid email or password.",
    });
    return;
  }

  if (!staffMember.isVerified) {
    res.status(401).json({
      status: "failed",
      message: "Your account is not verified.",
    });
    return;
  }

  if (!staffMember.isActive) {
    res.status(401).json({
      status: "failed",
      message: "Your account is not active.",
    });
    return;
  }

  const hashedPassword = staffMember.password;
  const isPasswordMatch = await compareAdminPasswords(password, hashedPassword);

  if (!isPasswordMatch) {
    res.status(401).json({
      status: "failed",
      message: "Invalid email or password.",
    });
    return;
  }

  const accessToken = generateAdminAccessToken({
    userId: staffMember.id,
  });
  const refreshToken = await generateAdminRefreshToken({
    userId: staffMember.id,
  });

  const sessionId = generateAdminSessionId();
  const csrfToken = generateAdminCSRFToken(sessionId);

  //not adding expiry time of csrf token cookie as it itself contains a timestamp and will expire after 15 minutes.
  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: secureCookie,
    sameSite: sameSite,
  });
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: sameSite,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: sameSite,
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: sameSite,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    status: "success",
    message: "Login successful.",
  });
};

export const verifyStaffEmail = async (req: Request, res: Response) => {
  const { token, signature } = await validateDTO(verifyStaffEmailDTO, req.body);

  const email = decryptAdminEmail(token, signature);
  if (!email) {
    res.status(400).json({
      status: "failed",
      message: "Invalid or expired link.",
    });
    return;
  }

  const staffMember = await adminUserRepository.findOneBy({ email });

  if (!staffMember) {
    res.status(404).json({
      status: "failed",
      message: "Staff member not found.",
    });
    return;
  }

  if (staffMember.lastOtpSent !== token) {
    res.status(500).json({
      status: "failed",
      message: "Invalid Token.",
    });
    return;
  }

  if (staffMember.otpExpiry && staffMember.otpExpiry < new Date()) {
    res.status(500).json({
      status: "failed",
      message: "Token Expired.",
    });
    return;
  }

  staffMember.isVerified = true;
  staffMember.lastOtpSent = null;
  staffMember.lastOtpSentTime = null;
  staffMember.otpExpiry = null;

  await adminUserRepository.save(staffMember);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully.",
  });
};

export const setStaffPassword = async (req: Request, res: Response) => {
  const { id, password } = await validateDTO(setStaffPasswordDTO, req.body);

  const existingStaffMember = await adminUserRepository.findOneBy({
    id: id,
  });

  if (!existingStaffMember) {
    res.status(400).json({
      status: "failed",
      message: "Staff member not found.",
    });
    return;
  }
  if (!existingStaffMember.isVerified) {
    res.status(400).json({
      status: "failed",
      message: "Staff member email is not verified.",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      status: "failed",
      message: "Password must be at least 8 characters long.",
    });
    return;
  }

  const hashedPassword = await hashAdminPassword(password);

  existingStaffMember.password = hashedPassword;
  existingStaffMember.isActive = true;
  await adminUserRepository.save(existingStaffMember);

  res.status(200).json({
    status: "success",
    message: "Password set successfully.",
  });
};
