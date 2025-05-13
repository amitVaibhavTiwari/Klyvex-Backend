import express from "express";
import { addSuperAdmin, loginStaff } from "../controllers/staffControllers.js";
import { adminAuthMiddleware } from "../middleware/AdminAuth.js";
import { adminUserRepository } from "../../repositories/repositories.js";

const adminUserRouter = express.Router();

adminUserRouter.post("/add/superadmin", addSuperAdmin);
adminUserRouter.post("/login", loginStaff);
adminUserRouter.get(
  "/get-user-details",
  adminAuthMiddleware,
  async (req: any, res: any) => {
    try {
      console.log("yo se user", req?.body?.user);
      console.log("yo se user 2", req?.body?.user?.userId);
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
  }
);
// permissionRouter.post("/add/new/permission", createPermission);
// permissionRouter.post("/add/new/permission-group", createPermissionGroup);
// permissionRouter.post("/add-permission-to-group", addPermissionToGroup);
// permissionRouter.get("/get-permission-groups", getPermissionGroups);

export default adminUserRouter;
