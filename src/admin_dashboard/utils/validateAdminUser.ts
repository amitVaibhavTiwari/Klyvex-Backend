import { adminUserRepository } from "../../repositories/repositories.js";
import { PermissionEnum } from "./Permissions.js";
import { checkActionPermission } from "./checkPermission.js";
import { AppError } from "./errorHandler.js";

export const validateAdminUser = async (
  userId: number,
  requiredPermission: PermissionEnum
) => {
  const adminUser = await adminUserRepository.findOne({
    where: { id: userId },
  });

  if (!adminUser) {
    throw new AppError("User not found.", 404);
  }

  const hasPermission = await checkActionPermission(
    requiredPermission,
    adminUser.adminGroupsId
  );

  if (!hasPermission) {
    throw new AppError(
      "You don't have permission to perform this action.",
      403
    );
  }

  return adminUser;
};
