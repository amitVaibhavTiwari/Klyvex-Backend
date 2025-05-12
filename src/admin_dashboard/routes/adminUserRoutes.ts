import express from "express";
import { addSuperAdmin } from "../controllers/staffControllers.js";

const adminUserRouter = express.Router();

adminUserRouter.post("/add/superadmin", addSuperAdmin);
// permissionRouter.post("/add/new/permission", createPermission);
// permissionRouter.post("/add/new/permission-group", createPermissionGroup);
// permissionRouter.post("/add-permission-to-group", addPermissionToGroup);
// permissionRouter.get("/get-permission-groups", getPermissionGroups);

export default adminUserRouter;
