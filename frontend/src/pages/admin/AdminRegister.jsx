import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // -----------------------
  // VALIDATION
  // -----------------------
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 6 characters",
      }));
    }
  };

  // -----------------------
  // REGISTER ADMIN
  // -----------------------
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setMsg("All fields are required.");
      return;
    }
    if (errors.email || errors.password) {
      setMsg("Fix validation errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/admin/register", form);

      setMsg("Admin Registered Successfully! Redirecting...");

      // Redirect after 1 second
      setTimeout(() => navigate("/admin/login"), 1000);

    } catch (err) {
      setMsg("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          Admin Register
        </h2>

        {msg && <p className="text-center text-blue-600 mb-3">{msg}</p>}

        {/* Name */}
        <input
          name="name"
          className="border w-full p-3 mb-3 rounded"
          placeholder="Name"
          onChange={handleChange}
        />

        {/* Email */}
        <input
          name="email"
          className={`border w-full p-3 mb-1 rounded ${
            errors.email ? "border-red-500" : ""
          }`}
          placeholder="Email"
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mb-2">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className={`border w-full p-3 mb-1 rounded ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Password"
            onChange={handleChange}
          />

          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {errors.password && (
          <p className="text-red-500 text-xs mb-3">{errors.password}</p>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={!validateEmail(form.email) || !validatePassword(form.password)}
          className={`w-full py-3 rounded text-white ${
            !validateEmail(form.email) || !validatePassword(form.password)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}