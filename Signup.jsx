import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../lib/axios.js";
import { Link } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(6, "Min 6 characters"),
});

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await api.post("/auth/signup", values);
      alert("Signup successful! Please login.");
      window.location.href = "/login";
    } catch (e) {
      alert(e?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="grid place-items-center py-10">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur shadow-md">
          <div className="px-8 py-7">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">It takes less than a minute</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none
                             focus:ring-4 focus:ring-slate-200 focus:border-slate-400"
                  placeholder="Your name"
                  {...register("name")}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none
                             focus:ring-4 focus:ring-slate-200 focus:border-slate-400"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none
                             focus:ring-4 focus:ring-slate-200 focus:border-slate-400"
                  placeholder="Create a strong password"
                  {...register("password")}
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                className="w-full rounded-xl bg-slate-900 text-white py-2.5 font-medium shadow
                           hover:shadow-md active:scale-[.99] transition"
              >
                {isSubmitting ? "Creating..." : "Create account"}
              </button>
            </form>

            <div className="mt-5 text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-slate-900 underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          By continuing you agree to our Terms & Privacy.
        </p>
      </div>
    </div>
  );
}
