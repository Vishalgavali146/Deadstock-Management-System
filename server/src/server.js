import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";
import connectDb from "./DB/db.js";

import LoginRouter from "./Routes/RegisterRoute.js"

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
