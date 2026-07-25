import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authenticate } from "../lib/store";
import { setToken } from "../lib/api";

const AuthContext = createContext(null);
const SESSION_KEY = "auv_session_v1";

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  // If token disappeared (e.g. cleared), drop the cached session too.
  useEffect(() => {
    if (user && !localStorage.getItem("auv_token_v1")) {
      setUser(null);
      localStorage.removeItem(SESSION_KEY);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (username, password) => {
    const res = await authenticate(username, password);
    if (res.ok) {
      setUser(res.user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
