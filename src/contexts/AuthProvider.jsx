import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { authApi } from "../services/authApi";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then((value) => {
        if (active) setUser(value);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    const expired = () => setUser(null);
    window.addEventListener("cloudberth-session-expired", expired);
    return () => {
      active = false;
      window.removeEventListener("cloudberth-session-expired", expired);
    };
  }, []);
  async function login(body) {
    const value = await authApi.login(body);
    setUser(value);
  }
  async function register(body) {
    const value = await authApi.register(body);
    setUser(value);
  }
  async function logout() {
    await authApi.logout();
    setUser(null);
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
