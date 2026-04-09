import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const url = process.env.MONGO_URI;

const connectDb = async () => {
    try {

        await mongoose.connect(url);
        console.log("database connect successfully");

    } catch (err) {
        console.log("error occured", err);
        process.exit(1);
    }
};
export default connectDb;