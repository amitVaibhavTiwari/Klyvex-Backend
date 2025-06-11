import express from "express";
import {
  changeStaffMemberGroup,
  createStaffMember,
  deleteStaffMember,
  getSelfDetails,
  sendStaffInvitationLink,
} from "../controllers/StaffControllers/StaffControllers.js";

const staffRouter = express.Router();

staffRouter.get("/get-user-details", getSelfDetails);
staffRouter.post("/add-new-staff", createStaffMember);
staffRouter.post("/send-staff-invitation", sendStaffInvitationLink);
staffRouter.post("/change-staff-member-group", changeStaffMemberGroup);
staffRouter.delete("/delete-staff", deleteStaffMember);

export default staffRouter;
