import express from "express";
import { getSelfDetails } from "../controllers/staffControllers.js";

const staffRouter = express.Router();

staffRouter.get("/get-user-details", getSelfDetails);

export default staffRouter;
