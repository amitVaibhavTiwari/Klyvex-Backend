import { Request, Response } from "express";
import {
  adminUserRepository,
  permissionGroupRepository,
} from "../../repositories/repositories.js";
import { comparePasswords, hashPassword } from "../../utils/password.js";
import {
  generateAdminAccessToken,
  generateAdminRefreshToken,
} from "../../utils/adminTokens.js";

const sameSite: any = process.env.SAME_SITE_COOKIES;
const secureCookie: any = process.env.SECURE_COOKIES;

export const addSuperAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      throw new Error("Name, email and password are required");
    }

    const existingSuperAdmin = await adminUserRepository.findOneBy({
      AdminGroups: { name: "super_admin" },
    });

    if (existingSuperAdmin) {
      throw new Error("Super Admin already exists.");
    }

    const existingEmail = await adminUserRepository.findOneBy({
      email: req.body.email,
    });

    if (existingEmail) {
      throw new Error("Staff email already exists.");
    }

    const hashedPassword = await hashPassword(req.body.password);

    const super_admin = await permissionGroupRepository.findOneBy({
      name: "super_admin",
    });

    if (!super_admin) {
      throw new Error("super_admin group not found.");
    }

    const newSuperAdmin = adminUserRepository.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      AdminGroups: super_admin,
    });
    await adminUserRepository.save(newSuperAdmin);
    res.status(201).json({
      status: "success",
      message: "Super Admin created successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error creating super admin.",
    });
  }
};

export const loginStaff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (email || !password) {
      res.status(400).json({
        status: "failed",
        message: "email and password are required.",
      });
      return;
    }

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
    const isPasswordMatch = await comparePasswords(
      req.body.password,
      hashedPassword
    );

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
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error Logging to your account.",
    });
  }
};
