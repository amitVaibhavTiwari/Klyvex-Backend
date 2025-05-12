import { Request, Response } from "express";
import { adminUserRepository } from "../../repositories/repositories.js";
import { hashPassword } from "../../utils/password.js";

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

    const existingemail = await adminUserRepository.findOneBy({
      email: req.body.email,
    });

    if (existingemail) {
      throw new Error("Staff email already exists.");
    }

    const hashedPassword = await hashPassword(req.body.password);

    const newSuperAdmin = adminUserRepository.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      AdminGroups: { name: "super_admin" },
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
