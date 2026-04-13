import { Router } from "express";
import { createEquipmentRequestForLab } from "../Controllers/RequestLabEquipment.js";
import { dsrInchargeMiddleware } from "../Middlewares/Auth-DDSR_Incharge.js";

const router = Router();

router.post(
  "/api/department/equipment",
  dsrInchargeMiddleware,
  createEquipmentRequestForLab
);


export default router;
