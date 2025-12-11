import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginAdmin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/admin/login", {
        email,
        password
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

        <input
          type="email"
          className="border p-3 rounded w-full mb-3"
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 rounded w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginAdmin} className="bg-primary-600 text-white py-3 rounded w-full">
          Login
        </button>
      </div>
    </div>
  );
}
