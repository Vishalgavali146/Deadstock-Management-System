import express from "express";
import { getApprovedRequestsForLab, getPendingRequestForLab, approveRequestUsingDSRNo } from "../Controllers/NotificationController.js";
import { createRequisition } from "../Controllers/RequisitionController.js";
import { authenticateUser } from "../Middlewares/Auth-Assistance.js";


const router = express.Router();

router.post("/submit", authenticateUser , createRequisition);


// Notification

router.get("/pending-requests", authenticateUser, getPendingRequestForLab);

router.get("/ApprovebyRole", authenticateUser, getApprovedRequestsForLab);

router.post(
  "/requests/dsr/:dsrNo/RoleApproval",
  authenticateUser,
  approveRequestUsingDSRNo
);








export default router;






