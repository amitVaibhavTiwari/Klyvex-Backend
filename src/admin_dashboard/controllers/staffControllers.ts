import { Request, Response } from "express";
import {
  adminUserRepository,
  permissionGroupRepository,
} from "../../repositories/repositories.js";
import { encryptAdminEmail } from "../utils/encryptToken.js";
import { sendStaffInvitatonEmail } from "../utils/email.js";
import { checkActionPermission } from "../utils/checkPermission.js";
import { PermissionEnum } from "../utils/Permissions.js";
import { User } from "../Types.js";

export const getSelfDetails = async (req: Request, res: Response) => {
  try {
    const user = await adminUserRepository.findOneBy({
      id: req?.body?.user?.userId,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error fetching user details.",
    });
  }
};

export const createStaffMember = async (req: Request, res: Response) => {
  try {
    const {
      email,
      name,
      groupId,
      user,
    }: { email: string; name: string; groupId: number; user: User } = req.body;

    if (!email || !name || !groupId) {
      res.status(400).json({
        status: "failed",
        message: "email, groupId and name are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    console.log("admin user id", adminUser?.adminGroupsId);

    const hasPermission = await checkActionPermission(
      PermissionEnum.manage_staff,
      adminUser?.adminGroupsId
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error inviting staff member.",
    });
  }
};

export const sendStaffInvitationLink = async (req: Request, res: Response) => {
  try {
    const { id, URL, user }: { id: number; URL: string; user: User } = req.body;

    if (!id || !URL) {
      res.status(400).json({
        status: "failed",
        message: "id and URL are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = await checkActionPermission(
      PermissionEnum.manage_staff,
      adminUser?.adminGroupsId
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error inviting staff member.",
    });
  }
};

export const changeStaffMemberGroup = async (req: Request, res: Response) => {
  try {
    const { id, groupId, user }: { id: number; groupId: number; user: User } =
      req.body;

    if (!id || !groupId) {
      res.status(400).json({
        status: "failed",
        message: "id and groupId are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = await checkActionPermission(
      PermissionEnum.manage_staff,
      adminUser?.adminGroupsId
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error changing staff member group.",
    });
  }
};

export const deleteStaffMember = async (req: Request, res: Response) => {
  try {
    const { id, user }: { id: number; user: User } = req.body;

    if (!id) {
      res.status(400).json({
        status: "failed",
        message: "id is required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = await checkActionPermission(
      PermissionEnum.manage_staff,
      adminUser?.adminGroupsId
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error deleting staff member.",
    });
  }
};
