import express from "express";
import {
  addSuperAdmin,
  loginStaff,
  setStaffPassword,
  verifyStaffEmail,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/add/superadmin", addSuperAdmin);
authRouter.post("/login", loginStaff);
authRouter.post("/verify-staff-email", verifyStaffEmail);
authRouter.post("/set-staff-password", setStaffPassword);

export default authRouter;
