import { useEffect, useState } from "react";
import { api } from "../lib/axios.js";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/profile")
      .then(({ data }) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl bg-white/80 backdrop-blur shadow-md border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h1>

        {user ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border">
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
