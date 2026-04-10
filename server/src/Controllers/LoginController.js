import User from "../Models/User-Models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();
   
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    if (user.status === "Pending") {
      return res.status(403).json({ msg: "Account approval is pending" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        labId: user.LabId,
        departmentId: user.DepartmentId,
      },
      process.env.JWTKEY,
      { expiresIn: "30m" }
    );

    return res.status(200).json({ msg: "Login Successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const Register = async (req, res) => {
  try {
    const { username, email, password, role, DepartmentId, LabId } = req.body;

    const emailLower = email.toLowerCase();

    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      return res.status(409).json({ msg: "User Already Registered" });
    }
                          
    const hash_password = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email: emailLower,
      password: hash_password,
      role,
      DepartmentId,
      LabId,
    });

    return res
      .status(201)
      .json({ msg: "User Registered Successfully", user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
