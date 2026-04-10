import { Router } from "express";
import { Login, Register } from "../Controllers/LoginController.js";
import rateLimit from "express-rate-limit";

const router = Router()

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 5,                
  message: { msg: "Too many failed login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, 
});

router.post("/Login", loginLimiter, Login);
router.post("/Register", loginLimiter, Register);


export default router;
