import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // -----------------------
  // VALIDATIONS
  // -----------------------
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value) ? "" : "Invalid email format",
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password:
        validatePassword(value) ? "" : "Password must be at least 6 characters",
    }));
  };

  // -----------------------
  // LOGIN ADMIN
  // -----------------------
  const loginAdmin = async () => {
    if (errors.email || errors.password || !email || !password) {
      setError("Fix validation errors before logging in.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("admin", JSON.stringify(res.data));
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-96 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Email */}
        <input
          type="email"
          className={`border p-3 rounded w-full mb-1 ${
            errors.email ? "border-red-500" : ""
          }`}
          placeholder="Admin Email"
          value={email}
          onChange={handleEmailChange}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mb-2">{errors.email}</p>
        )}

        {/* Password + Eye Toggle */}
        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            className={`border p-3 rounded w-full ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />

          <span
            className="absolute right-3 top-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mb-2">{errors.password}</p>
        )}

        {/* Login Button */}
        <button
          onClick={loginAdmin}
          disabled={!validateEmail(email) || !validatePassword(password)}
          className={`w-full py-3 rounded text-white ${
            !validateEmail(email) || !validatePassword(password)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          Login
        </button>
      </div>
    </div>
  );
}
