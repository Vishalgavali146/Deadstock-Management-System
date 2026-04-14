import { getRequisitions, approveRequisitionByRole, getRequisitionsApproved } from "../Controllers/RequisitionController.js";
import { authenticateUser } from "../Middlewares/Auth-Assistance.js";
import express from "express"

const router = express.Router();

// Requisation
router.get("/api/requisitions", authenticateUser, getRequisitionsApproved);

router.get("/RequisitionsRequest",authenticateUser , getRequisitions);

router.put("/requisitions/:id/approve", authenticateUser, approveRequisitionByRole);

export default router;
