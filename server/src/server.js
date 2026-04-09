import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDb from "./DB/db.js";

dotenv.config({
    path: "./.env"
});

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:3000",
    methods: "GET, POST, DELETE, PATCH, PUT",
    optionsSuccessStatus: 200,
  credentials: true, 
};

app.use(cors(corsOption));

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined in .env file");
    process.exit(1);
}
app.get("/", (req, res) => {
  res.send("Hello, MongoDB Atlas!");
});

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
