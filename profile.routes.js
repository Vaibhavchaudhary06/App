import { Router } from "express";
 import User from "../models/User.js";
 import { auth } from "../middleware/auth.js";
 const router = Router();
 router.get("/", auth, async (req, res) => {
 const user = await User.findById(req.userId).select("-password");
 return res.json({ user });
 });
 router.put("/", auth, async (req, res) => {
 const { name } = req.body;
 const user = await User.findByIdAndUpdate(
 req.userId,
 { $set: { name } },
 { new: true }
 ).select("-password");
 return res.json({ user });
 });
 export default router;