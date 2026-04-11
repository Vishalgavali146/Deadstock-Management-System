import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const AuthIncharge = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token Provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWTKEY);
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token", error: err.message });
  }

  if (decoded.role !== "Lab_Incharge") {
    return res.status(403).json({ msg: "Access Denied Lab_Incharge only" });
  }

  req.user = decoded;

  next();
};
