import {
  PendingRequests,
  ApprovedUsers,
} from "../Controllers/RequestController.js";
import { AuthHoD } from "../Middlewares/Auth-HOD.js";
import { Router } from "express";
import { authenticateUser } from "../Middlewares/Auth-Assistance.js";
import { RequestApprove } from "../Controllers/RequestController.js";

const router = Router();

router.get("/Requests", AuthHoD, PendingRequests);

router.post("/ApproveRequest", AuthHoD, RequestApprove);

router.get("/AppUsers" ,authenticateUser , ApprovedUsers);

export default router;
