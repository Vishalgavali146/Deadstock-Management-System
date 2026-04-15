import express from "express";
import {
  getApproverRequests, postApproverRequests,
  getApproverApproval
} from "../Controllers/StaffController.js";
import { authenticateUser } from "../Middlewares/Auth-Assistance.js";

const router = express.Router();

// Staff 
router.get("/getApproverApproval", authenticateUser, getApproverApproval);

router.get("/approver-requests", authenticateUser, getApproverRequests);

router.put("/approve/:id", authenticateUser, postApproverRequests);

export default router;