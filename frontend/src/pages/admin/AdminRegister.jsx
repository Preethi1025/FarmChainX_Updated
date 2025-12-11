import React, { useState } from "react";
import axios from "axios";

export default function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/admin/register", form);
      setMsg("Admin Registered Successfully!");
    } catch (err) {
      setMsg("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Register</h2>

        {msg && <p className="text-center text-blue-600">{msg}</p>}

        <input name="name" className="border w-full p-3 mb-3 rounded" placeholder="Name" onChange={handleChange} />
        <input name="email" className="border w-full p-3 mb-3 rounded" placeholder="Email" onChange={handleChange} />
        <input name="password" className="border w-full p-3 mb-3 rounded" type="password" placeholder="Password" onChange={handleChange} />

        <button onClick={handleRegister} className="bg-primary-600 text-white w-full py-3 rounded">
          Register
        </button>
      </div>
    </div>
  );
}
