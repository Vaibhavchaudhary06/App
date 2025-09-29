import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/axios.js";

export default function Tasks() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () =>
      items.filter(
        (t) =>
          (filter === "all" || t.status === filter) &&
          t.title.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query, filter]
  );

  const fetchAll = async () => {
    const { data } = await api.get("/tasks");
    setItems(data.tasks);
  };
  useEffect(() => {
    fetchAll();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await api.post("/tasks", { title, status });
    setTitle("");
    setStatus("pending");
    fetchAll();
  };
  const toggle = async (id, curr) => {
    const next = curr === "done" ? "pending" : "done";
    await api.put(`/tasks/${id}`, { status: next });
    fetchAll();
  };
  const remove = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchAll();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl bg-white/80 backdrop-blur shadow-md border border-slate-200 p-8 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>

        {/* Add new task */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-slate-200"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={addTask}
            className="rounded-xl bg-slate-900 text-white px-5 py-2 font-medium shadow hover:shadow-md active:scale-[.98] transition"
          >
            Add
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-slate-200"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Tasks list */}
        {filtered.length === 0 ? (
          <p className="text-slate-500 text-center">No tasks found.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {filtered.map((t) => (
              <li
                key={t._id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <p
                    className={`font-medium ${
                      t.status === "done" ? "line-through text-slate-500" : ""
                    }`}
                  >
                    {t.title}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === "done"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggle(t._id, t.status)}
                    className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => remove(t._id)}
                    className="rounded-lg border px-3 py-1 text-sm hover:bg-red-50 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
