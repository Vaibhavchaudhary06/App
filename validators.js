 import { z } from "zod";
 export const signupSchema = z.object({
 name: z.string().min(2),
 email: z.string().email(),
 password: z.string().min(6),
 });
 export const loginSchema = z.object({
 email: z.string().email(),
 password: z.string().min(6),
 });
 export const taskCreateSchema = z.object({
 title: z.string().min(1),
 status: z.enum(["pending", "done"]).optional(),
 });
 export const taskUpdateSchema = z.object({
 title: z.string().min(1).optional(),
 status: z.enum(["pending", "done"]).optional(),
 });