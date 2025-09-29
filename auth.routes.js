 import { Router } from "express";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
 import User from "../models/User.js";
 import { loginSchema, signupSchema } from "../utils/validators.js";
 const router = Router();
 router.post("/signup", async (req, res) => {
    try {
 const parsed = signupSchema.parse(req.body);
 const exists = await User.findOne({ email: parsed.email });
 if (exists) return res.status(400).json({ message: "Email already used" });
 const hash = await bcrypt.hash(parsed.password, 10);
 await User.create({ ...parsed, password: hash });
 return res.json({ message: "User created" });
 } catch (e) {
 const msg = e.errors?.[0]?.message || e.message || "Invalid input";
 return res.status(400).json({ message: msg });
 }
 });
  router.post("/login", async (req, res) => {
 try {
 const parsed = loginSchema.parse(req.body);
 const user = await User.findOne({ email: parsed.email });
 if (!user) return res.status(400).json({ message: "Invalid credentials" });
 const ok = await bcrypt.compare(parsed.password, user.password);
 if (!ok) return res.status(400).json({ message: "Invalid credentials" });
 const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
 expiresIn: "7d" });
 return res.json({ token });
 } catch (e) {
 const msg = e.errors?.[0]?.message || e.message || "Invalid input";
 return res.status(400).json({ message: msg });
 }
 });
 export default router;