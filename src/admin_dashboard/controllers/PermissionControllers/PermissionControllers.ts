import {
  permissionGroupRepository,
  permissionRepository,
} from "../../../repositories/repositories.js";
import { Request, Response } from "express";
import { AppDataSource } from "../../../dataSource/dataSource.js";
import { AdminPermissions } from "../../../entities/AdminPermissions.js";
import { AdminGroups } from "../../../entities/AdminGroups.js";
import { PermissionEnum } from "../../utils/Permissions.js";
import { validateDTO } from "../../utils/validateDto.js";
import {
  AddPermissionToGroupDTO,
  CreatePermissionDTO,
  CreatePermissionGroupDTO,
  DeletePermissionFromGroupDTO,
} from "./DTOs.js";
import { validateAdminUser } from "../../utils/validateAdminUser.js";

export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, user } = await validateDTO(CreatePermissionDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_permissions);

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
    const newPermission = transactionalEntityManager.create(AdminPermissions, {
      permission: name,
    });

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
};

export const createPermissionGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, user } = await validateDTO(CreatePermissionGroupDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_permissions);

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
};

export const addPermissionToGroup = async (req: Request, res: Response) => {
  const { permissionId, user, groupId } = await validateDTO(
    AddPermissionToGroupDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_permissions);

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
};

export const deletePermissionFromGroup = async (
  req: Request,
  res: Response
) => {
  const { permissionId, user, groupId } = await validateDTO(
    DeletePermissionFromGroupDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_permissions);

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
};

export const getPermissionGroups = async (req: Request, res: Response) => {
  const { isActive }: { isActive?: boolean } = req.body;
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
};

export const getSinglePermissionGroup = async (req: Request, res: Response) => {
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
};

export const getAllPermissions = async (req: Request, res: Response) => {
  const permission = await permissionRepository.find({
    select: {
      permission: true,
    },
  });
  res.json({
    status: "success",
    data: permission,
  });
};
