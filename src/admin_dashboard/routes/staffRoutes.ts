import express from "express";
import {
  createStaffMember,
  getSelfDetails,
  sendStaffInvitationLink,
} from "../controllers/staffControllers.js";

const staffRouter = express.Router();

staffRouter.get("/get-user-details", getSelfDetails);
staffRouter.post("/add-new-staff", createStaffMember);
staffRouter.post("/send-staff-invitation", sendStaffInvitationLink);

export default staffRouter;
