import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = async (req, res, next) => {
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

  req.user = decoded;

  next();
};
