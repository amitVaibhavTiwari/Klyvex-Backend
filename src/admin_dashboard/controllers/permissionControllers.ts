import {
  adminUserRepository,
  permissionGroupRepository,
  permissionRepository,
} from "../../repositories/repositories.js";
import { Request, Response } from "express";
import { checkActionPermission } from "../../utils/checkPermission.js";
import { User } from "../Types.js";
import { AppDataSource } from "../../dataSource/dataSource.js";
import { AdminPermissions } from "../../entities/AdminPermissions.js";
import { AdminGroups } from "../../entities/AdminGroups.js";
import { PermissionEnum } from "../Permissions.js";

export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, user }: { name: string; user: User } = req.body;

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

    const hasPermission = await checkActionPermission(
      PermissionEnum.manage_permissions,
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

    //  new permission will be created and automatically assigned to super_admin.
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const newPermission = transactionalEntityManager.create(
        AdminPermissions,
        {
          permission: name,
        }
      );

      await transactionalEntityManager.save(newPermission);

      const superUserGroup = await transactionalEntityManager.findOne(
        AdminGroups,
        {
          where: { name: "super_admin" },
          relations: ["Permissions"],
        }
      );

      if (!superUserGroup) {
        throw new Error("Super User group not found.");
      }

      superUserGroup.Permissions = [
        ...(superUserGroup.Permissions || []),
        newPermission,
      ];
      await transactionalEntityManager.save(superUserGroup);
    });

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
    const { user, name }: { user: User; name: string } = req.body;

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
      PermissionEnum.manage_permissions,
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
    const {
      groupId,
      permissionId,
      user,
    }: { groupId: number; permissionId: number; user: User } = req.body;

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
      PermissionEnum.manage_permissions,
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

export const deletePermissionFromGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      groupId,
      permissionId,
      user,
    }: { groupId: number; permissionId: number; user: User } = req.body;

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
      PermissionEnum.manage_permissions,
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

    if (!group) {
      res.status(404).json({
        status: "failed",
        message: "Permission Group not found.",
      });
      return;
    }

    group.Permissions = group.Permissions.filter(
      (permission) => permission.id !== permissionId
    );

    await permissionGroupRepository.save(group);

    res.status(200).json({
      status: "success",
      message: "Permission removed from group successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error removing Permission from Group.",
    });
  }
};

export const getPermissionGroups = async (req: Request, res: Response) => {
  const { isActive }: { isActive?: boolean } = req.query;
  try {
    const groups = await permissionGroupRepository.find({
      select: {
        name: true,
      },
      where: {
        isActive: isActive ? isActive : true,
      },
    });

    res.json({
      status: "success",
      data: groups,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error fetching permission groups",
    });
  }
};

export const getSinglePermissionGroup = async (req: Request, res: Response) => {
  try {
    const { groupId }: { groupId: number } = req.body;

    if (!groupId) {
      res.status(404).json({
        status: "failed",
        message: "groupId is required.",
      });
      return;
    }

    const group = await permissionGroupRepository.findOne({
      where: { id: groupId },
      relations: ["Permissions"],
    });

    if (!group) {
      res.status(404).json({
        status: "failed",
        message: "Permission Group not found.",
      });
      return;
    }

    const permissions = group?.Permissions;

    res.json({
      status: "success",
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error removing Permission from Group.",
    });
  }
};

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permission = await permissionRepository.find({
      select: {
        permission: true,
      },
    });

    res.json({
      status: "success",
      data: permission,
    });
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching permissions");
  }
};
