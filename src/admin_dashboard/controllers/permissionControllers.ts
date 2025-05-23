import {
  adminUserRepository,
  permissionGroupRepository,
  permissionRepository,
} from "../../repositories/repositories.js";
import { Request, Response } from "express";
import { checkActionPermission } from "../../utils/checkPermission.js";

export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, user } = req.body;

    if (!name) {
      res.status(400).json({
        status: "failed",
        message: "name is required for Permission.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_permissions",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

    const existingPermission = await permissionRepository.findOneBy({
      permission: name,
    });
    if (existingPermission) {
      res.status(400).json({
        status: "failed",
        message: "Permission already exists.",
      });
      return;
    }

    const newPermission = permissionRepository.create({
      permission: name,
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
    const { user, name } = req.body;
    if (!name) {
      res.status(400).json({
        status: "failed",
        message: "name is required for permission group.",
      });
      return;
    }
    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_permissions",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

    const existingPermission = await permissionGroupRepository.findOneBy({
      name: name,
    });

    if (existingPermission) {
      res.status(400).json({
        status: "failed",
        message: "Permission Group already exists.",
      });
      return;
    }

    const newGroup = permissionGroupRepository.create({
      name: name,
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
    const { groupId, permissionId, user } = req.body;

    if (!groupId || !permissionId) {
      res.status(400).json({
        status: "failed",
        message: "groupId and permissionId are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_permissions",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
    const { user } = req.body;

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_permissions",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
