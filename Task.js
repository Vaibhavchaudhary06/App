 import mongoose from "mongoose";
 const taskSchema = new mongoose.Schema(
 {
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 title: { type: String, required: true },
 status: { type: String, enum: ["pending", "done"], default: "pending" },
 },
 { timestamps: true }
 );
 export default mongoose.model("Task", taskSchema);