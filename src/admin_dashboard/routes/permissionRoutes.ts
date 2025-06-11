import express from "express";
import { addNewProduct } from "../controllers/ProductControllers/ProductControllers.js";
import {
  addPermissionToGroup,
  createPermission,
  createPermissionGroup,
  deletePermissionFromGroup,
  getAllPermissions,
  getPermissionGroups,
  getSinglePermissionGroup,
} from "../controllers/PermissionControllers/PermissionControllers.js";

const permissionRouter = express.Router();

permissionRouter.post("/add/new/permission", createPermission);
permissionRouter.post("/add/new/permission-group", createPermissionGroup);
permissionRouter.post("/add-permission-to-group", addPermissionToGroup);
permissionRouter.get("/get-permission-groups", getPermissionGroups);

permissionRouter.get("/get-permission-group", getSinglePermissionGroup);

permissionRouter.get("/get-all-permissions", getAllPermissions);

permissionRouter.delete(
  "/delete-permission-from-group",
  deletePermissionFromGroup
);

export default permissionRouter;
