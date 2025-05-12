import express from "express";
import { addNewProduct } from "../controllers/productControllers.js";
import {
  addPermissionToGroup,
  createPermission,
  createPermissionGroup,
  getPermissionGroups,
} from "../controllers/permissionControllers.js";

const permissionRouter = express.Router();

permissionRouter.post("/add/new/permission", createPermission);
permissionRouter.post("/add/new/permission-group", createPermissionGroup);
permissionRouter.post("/add-permission-to-group", addPermissionToGroup);
permissionRouter.get("/get-permission-groups", getPermissionGroups);

export default permissionRouter;
