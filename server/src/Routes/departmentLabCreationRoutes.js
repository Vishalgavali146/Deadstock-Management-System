import { Router } from "express";
import {
  createDepartment,
  createLab,
  createEquipmentForLab,
  addHistoryCard,
  toggleEquipmentStatus,
  getHistoryCards
} from "../Controllers/DepartmentLabCreationController.js";
import { AuthHoD } from "../Middlewares/Auth-HOD.js";

const router = Router();

router.post("/api/department", createDepartment);

router.post("/api/department/lab", AuthHoD, createLab);

// direct add equipment in lab without Approval
router.post(
  "/api/department/:departmentId/lab/:labId/equipment",
  createEquipmentForLab
);

router.put("/api/equipment/toggle/:id", toggleEquipmentStatus);

router.get("/equipment/history/:equipmentId", getHistoryCards);

router.post("/equipment/history/:equipmentId", addHistoryCard);

export default router;
