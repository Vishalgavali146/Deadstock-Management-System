import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const dsrInchargeMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWTKEY);
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token", error: error.message });
  }

  req.user = decoded;

  if (req.user.role !== "DSR_Incharge") {
    return res.status(403).json({
      error: "Access denied: Only DSR_Incharge users can perform this action",
    });
  }

  next();
};
