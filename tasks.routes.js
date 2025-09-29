 import { Router } from "express";
 import Task from "../models/Task.js";
 import { auth } from "../middleware/auth.js";
 import { taskCreateSchema, taskUpdateSchema } from "../utils/validators.js";
 const router = Router();
 router.use(auth);
 router.get("/", async (req, res) => {
 const { q, status } = req.query;
 const filter = { user: req.userId };
 if (status) filter.status = status;
 if (q) filter.title = { $regex: q, $options: "i" };
 const tasks = await Task.find(filter).sort({ createdAt:-1 });
 res.json({ tasks });
 });
 router.post("/", async (req, res) => {
 const parsed = taskCreateSchema.safeParse(req.body);
 if (!parsed.success) return res.status(400).json({ message: "Invalid input" });
 const task = await Task.create({ ...parsed.data, user: req.userId });
 res.json({ task });
 });
 router.put("/:id", async (req, res) => {
 const parsed = taskUpdateSchema.safeParse(req.body);
 if (!parsed.success) return res.status(400).json({ message: "Invalidinput" });
 const task = await Task.findOneAndUpdate(
 { _id: req.params.id, user: req.userId },
 { $set: parsed.data },
 { new: true }
 );
 if (!task) return res.status(404).json({ message: "Not found" });
 res.json({ task });
 });
 router.delete("/:id", async (req, res) => {
 const task = await Task.findOneAndDelete({ _id: req.params.id, user:
 req.userId });
 if (!task) return res.status(404).json({ message: "Not found" });
 res.json({ message: "Deleted" });
 });
 export default router;