import { authenticateUser } from "../Middlewares/Auth-Assistance.js";
import { AuthHoD } from "../Middlewares/Auth-HOD.js";
import { Router } from "express";
import {
  getDepartmentWithLabs,
  getEquipmentForLab,
} from "../Controllers/FetchDepartmentLabs.js";

const router = Router();

router.get("/api/department", AuthHoD, getDepartmentWithLabs);

router.get("/department/lab/equipments", authenticateUser, getEquipmentForLab);

export default router;
