import {
  permissionGroupRepository,
  permissionRepository,
} from "../../repositories/repositories.js";
import { Request, Response } from "express";

export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.name) {
      throw new Error("Permission name is required");
    }

    const existingPermission = await permissionRepository.findOneBy({
      permission: req.body.name,
    });
    if (existingPermission) {
      throw new Error("Permission name already exists.");
    }

    const newPermission = permissionRepository.create({
      permission: req.body.name,
    });

    await permissionRepository.save(newPermission);
    res.status(201).json({
      status: "success",
      message: "Permission created successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error creating Permission.",
    });
  }
};
export const createPermissionGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.name) {
      throw new Error("Permission Group name is required");
    } 

    const existingPermission = await permissionGroupRepository.findOneBy({
      name: req.body.name,
    });

    if (existingPermission) {
      throw new Error("Permission Group already exists.");
    }

    const newGroup = permissionGroupRepository.create({
      name: req.body.name,
    });

    await permissionGroupRepository.save(newGroup);
    res.status(201).json({
      status: "success",
      message: "Permission Group created successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error creating Permission Group.",
    });
  }
};

export const addPermissionToGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, permissionId } = req.body;
    const group = await permissionGroupRepository.findOne({
      where: { id: groupId },
      relations: ["Permissions"],
    });
    const permission = await permissionRepository.findOneBy({
      id: permissionId,
    });

    if (!group || !permission)
      return res.status(404).json({ error: "Group or Permission not found" });

    group.Permissions.push(permission);
    await permissionGroupRepository.save(group);
    res.status(200).json({
      status: "success",
      message: "Permission added to group successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "success",
      message: error?.message || "Error creating Permission.",
    });
  }
};

export const getPermissionGroups = async (req: Request, res: Response) => {
  try {
    const groups = await permissionGroupRepository.find({
      select: {
        name: true,
      },
    });
    res.json({
      status: "success",
      data: groups,
    });
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching permission groups");
  }
};
