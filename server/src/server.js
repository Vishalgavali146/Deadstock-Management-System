import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";
import connectDb from "./DB/db.js";

import LoginRouter from "./Routes/RegisterRoute.js"
import Requests from "./Routes/Requests.js";
import departmentRoutes from "./Routes/departmentLabCreationRoutes.js"; 
import labcontent from "./Routes/departmentLabFetchRoutes.js";
import ApprovalRequest from "./Routes/ApprovalEquipment.js"; 
import Notification from "./Routes/NotificationRouter.js";
import Staff from "./Routes/StaffRouter.js";
import RequisitionRouter from './Routes/RequisationRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser());

const corsOption = {
    origin: process.env.VITE_URL,
    methods: "GET, POST, DELETE, PATCH, PUT",
    optionsSuccessStatus: 200,
    credentials: true, 
};

app.use(cors(corsOption));

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not defined in .env file");
    process.exit(1);
}
app.get("/", (req, res) => {
  res.send("Hello, MongoDB Atlas!");
});

app.use(LoginRouter);
app.use(Requests);
app.use(departmentRoutes);
app.use(labcontent);
app.use(ApprovalRequest);
app.use(Notification);
app.use(RequisitionRouter);
app.use(Staff);
app.use(RequisitionRouter);



connectDb()
.then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection Error", err)
    process.exit(1)
})
