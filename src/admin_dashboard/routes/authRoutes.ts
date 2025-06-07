import express from "express";
import { addSuperAdmin, loginStaff } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/add/superadmin", addSuperAdmin);
authRouter.post("/login", loginStaff);

export default authRouter;
