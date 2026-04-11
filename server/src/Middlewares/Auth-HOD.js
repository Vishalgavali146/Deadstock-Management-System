import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const AuthHoD = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ msg: "No token Provided" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWTKEY
    );

    if (decoded.role !== "HOD") {
      return res.status(403).json({ msg: "Access Denied HOD only" });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res
      .status(401)
      .json({ msg: "Invalid or expired token. Please log in again." });
  }
};
