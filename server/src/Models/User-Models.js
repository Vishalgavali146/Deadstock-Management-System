import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "Password must be at least 8 characters long"],
        },
        role: {
            type: String,
            enum: [
                "Lab_Assistance",
                "Lab_Incharge",
                "DSR_Incharge",
                "HOD",
                "Central_DSR_Incharge",
                "Principal",
            ],
            default: "Lab_Assistance"
        },
        DepartmentId: {
            type: String,
            required: true,
        },
        LabId: {
            type: String, 
            default: "",
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        requestAt: {
            type: Date,
            default: Date.now
        },
        
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
export default User;