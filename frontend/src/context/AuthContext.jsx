import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8080/api/auth";

  /* --------------------------------------------------
     INITIAL LOAD (run once)
     -------------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  /* --------------------------------------------------
     REGISTER
     -------------------------------------------------- */
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/register`, formData);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     LOGIN
     -------------------------------------------------- */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });

      // Backend may return string on failure
      if (typeof res.data === "string") {
        return { success: false, message: res.data };
      }

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      return { success: true, user: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     LOGOUT
     -------------------------------------------------- */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* --------------------------------------------------
   HOOK
   -------------------------------------------------- */
export const useAuth = () => useContext(AuthContext);
