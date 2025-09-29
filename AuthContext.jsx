import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:4000/api") + "/profile",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
