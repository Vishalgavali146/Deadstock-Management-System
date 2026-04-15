import { Router } from "express";
import { getBudget , updateBudget } from "../Controllers/BudgetController.js";
import { dsrInchargeMiddleware } from "../Middlewares/Auth-DDSR_Incharge.js";
import { authenticateUser } from "../Middlewares/Auth-Assistance.js";

const router = Router();

router.get("/getBudget", authenticateUser , getBudget);

router.put("/updateBudget", dsrInchargeMiddleware, updateBudget);

export default router;
