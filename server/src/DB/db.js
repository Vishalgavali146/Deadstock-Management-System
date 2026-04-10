import mongoose from "mongoose";

const connectDb = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connect successfully");

    } catch (err) {
        console.log("error occured", err);
        process.exit(1);
    }
};
export default connectDb;