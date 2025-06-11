import { Request, Response } from "express";
import {
  adminUserRepository,
  permissionGroupRepository,
} from "../../../repositories/repositories.js";
import { encryptAdminEmail } from "../../utils/encryptToken.js";
import { sendStaffInvitatonEmail } from "../../utils/email.js";
import { checkActionPermission } from "../../utils/checkPermission.js";
import { PermissionEnum } from "../../utils/Permissions.js";
import { User } from "../../Types.js";
import { validateDTO } from "../../utils/validateDto.js";
import { validateAdminUser } from "../../utils/validateAdminUser.js";
import {
  changeStaffMemberGroupDTO,
  createStaffMemberDTO,
  deleteStaffMemberDTO,
  sendStaffInvitationLinkDTO,
} from "./DTOs.js";

export const createStaffMember = async (req: Request, res: Response) => {
  const { email, name, groupId, user } = await validateDTO(
    createStaffMemberDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_staff);

  const existingStaffMember = await adminUserRepository.findOneBy({
    email: email,
  });

  if (existingStaffMember) {
    res.status(400).json({
      status: "failed",
      message: "Staff member with this email already exists.",
    });
    return;
  }

  const existingGroup = await permissionGroupRepository.findOneBy({
    id: groupId,
  });

  if (!existingGroup) {
    res.status(400).json({
      status: "failed",
      message: "Admin group not found.",
    });
    return;
  }

  if (existingGroup.name === "super_admin") {
    res.status(400).json({
      status: "failed",
      message: "Cannot invite staff member to super_admin group.",
    });
    return;
  }

  const newStaffMember = adminUserRepository.create({
    name: name,
    email: email,
    isActive: false,
    adminGroupsId: groupId,
  });
  await adminUserRepository.save(newStaffMember);

  res.status(200).json({
    status: "success",
    message: "Staff member created successfully.",
  });
};

export const sendStaffInvitationLink = async (req: Request, res: Response) => {
  const { id, URL, user } = await validateDTO(
    sendStaffInvitationLinkDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_staff);

  const existingStaffMember = await adminUserRepository.findOneBy({
    id: id,
  });

  if (!existingStaffMember) {
    res.status(404).json({
      status: "failed",
      message: "Staff member not found.",
    });
    return;
  }

  const { iv, token } = encryptAdminEmail(existingStaffMember.email);

  // only t, user and sig are required in URL, rest all is just to make URL look sexy
  const invitationLink = `${URL}?ref=auth&action=verify&t=${token}&sig=${iv}&user=&${id}&ref_id=${Math.random()
    .toString(36)
    .substring(2, 15)}`;

  const { sent, error } = await sendStaffInvitatonEmail(
    invitationLink,
    existingStaffMember.email
  );

  if (!sent) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error sending invitation email.",
    });
    return;
  }

  existingStaffMember.lastOtpSent = token;
  existingStaffMember.lastOtpSentTime = new Date();
  existingStaffMember.otpExpiry = new Date(
    Date.now() + 15 * 60 * 1000 // 15 minutes from now
  );

  await adminUserRepository.save(existingStaffMember);

  res.status(200).json({
    status: "success",
    message: "Invitation sent successfully.",
  });
};

export const changeStaffMemberGroup = async (req: Request, res: Response) => {
  const { id, groupId, user } = await validateDTO(
    changeStaffMemberGroupDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_staff);

  const existingStaffMember = await adminUserRepository.findOneBy({ id });

  if (!existingStaffMember) {
    res.status(404).json({
      status: "failed",
      message: "Staff member not found.",
    });
    return;
  }

  const existingGroup = await permissionGroupRepository.findOneBy({
    id: groupId,
  });

  if (!existingGroup) {
    res.status(400).json({
      status: "failed",
      message: "Admin group not found.",
    });
    return;
  }

  if (existingGroup.name === "super_admin") {
    res.status(400).json({
      status: "failed",
      message: "Cannot change staff member to super_admin group.",
    });
    return;
  }

  existingStaffMember.adminGroupsId = groupId;
  await adminUserRepository.save(existingStaffMember);

  res.status(200).json({
    status: "success",
    message: "Staff member group changed successfully.",
  });
};

export const deleteStaffMember = async (req: Request, res: Response) => {
  const { id, user } = await validateDTO(deleteStaffMemberDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_staff);

  const existingStaffMember = await adminUserRepository.findOne({
    where: { id: id },
    relations: ["AdminGroups"],
  });

  if (!existingStaffMember) {
    res.status(404).json({
      status: "failed",
      message: "Staff member not found.",
    });
    return;
  }

  if (existingStaffMember.AdminGroups.name === "super_admin") {
    res.status(400).json({
      status: "failed",
      message: "Cannot delete super_admin.",
    });
    return;
  }

  await adminUserRepository.remove(existingStaffMember);

  res.status(200).json({
    status: "success",
    message: "Staff member deleted successfully.",
  });
};

export const getSelfDetails = async (req: Request, res: Response) => {
  const user = await adminUserRepository.findOneBy({
    id: req?.body?.user?.userId,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
