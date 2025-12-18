
import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080/api/auth";

  // --------------------------
  // REGISTER
  // --------------------------
  const register = async (formData, navigate) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/register`, formData);

      alert("Registration successful! Please login.");

      navigate("/login");   // redirect after success

      return res.data;
    } catch (err) {
      alert("Registration failed!");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // LOGIN (Corrected)
  // --------------------------
  ~~~{"id":"40291","variant":"standard"}
const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });

    // ❗ If backend returns a STRING → invalid login
    if (typeof res.data === "string") {
      return { success: false, message: res.data };
    }

    // Otherwise, data contains full user object
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));

    return { success: true, user: res.data };

  } catch (err) {
    return { success: false, message: "Login failed! Server error" };
  } finally {
    setLoading(false);
  }
};



  // --------------------------
  // LOGOUT
  // --------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

