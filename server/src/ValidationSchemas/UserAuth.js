import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address".min(1, "Email is required")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum([
      "lab_assistance",
      "lab_incharge",
      "dsr_incharge",
      "hod",
      "central_dsr_incharge",
      "principal",
    ])
    .optional()
    .default("lab_assistance"),
});
