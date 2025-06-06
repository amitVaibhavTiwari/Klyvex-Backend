import express from "express";
import { addNewProduct } from "../controllers/productControllers.js";
import {
  addPermissionToGroup,
  createPermission,
  createPermissionGroup,
  deletePermissionFromGroup,
  getAllPermissions,
  getPermissionGroups,
  getSinglePermissionGroup,
} from "../controllers/permissionControllers.js";
import { adminAuthMiddleware } from "../middleware/AdminAuth.js";

const permissionRouter = express.Router();

permissionRouter.post(
  "/add/new/permission",
  adminAuthMiddleware,
  createPermission
);
permissionRouter.post(
  "/add/new/permission-group",
  adminAuthMiddleware,
  createPermissionGroup
);
permissionRouter.post(
  "/add-permission-to-group",
  adminAuthMiddleware,
  addPermissionToGroup
);
permissionRouter.get(
  "/get-permission-groups",
  adminAuthMiddleware,
  getPermissionGroups
);

permissionRouter.get(
  "/get-permission-group",
  adminAuthMiddleware,
  getSinglePermissionGroup
);

permissionRouter.get(
  "/get-all-permissions",
  adminAuthMiddleware,
  getAllPermissions
);

permissionRouter.delete(
  "/delete-permission-from-group",
  adminAuthMiddleware,
  deletePermissionFromGroup
);

export default permissionRouter;
