import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-full text-sm transition
        ${pathname === to ? "bg-white/90 text-slate-900 shadow" : "hover:bg-white/20"}
      `}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/40 bg-slate-900/80 text-white">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 max-w-6xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-white text-slate-900 grid place-items-center font-extrabold">A</div>
          <span className="text-lg font-semibold tracking-tight">App</span>
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/tasks">Tasks</NavLink>
              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-sm font-medium shadow hover:shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
