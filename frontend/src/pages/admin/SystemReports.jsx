import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#a855f7", "#ef4444", "#f97316", "#14b8a6"];

export default function SystemReports() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/stats")
      .then(res => setStats(res.data));

    axios.get("http://localhost:8080/api/admin/crops")
      .then(res => setCrops(res.data));
  }, []);

  if (!stats) {
    return <div className="p-10">Loading reports...</div>;
  }

  /* ---------------- USER DATA ---------------- */
  const userData = [
    { name: "Farmers", value: stats.farmers },
    { name: "Distributors", value: stats.distributors },
    { name: "Consumers", value: stats.consumers },
    { name: "Admins", value: stats.admins }
  ];

  /* ---------------- CROP COUNT PER TYPE ---------------- */
  const cropCountMap = {};

  crops.forEach(crop => {
    cropCountMap[crop.cropName] =
      (cropCountMap[crop.cropName] || 0) + 1;
  });

  const cropChartData = Object.entries(cropCountMap).map(
    ([name, count]) => ({
      name,
      value: count,   // for pie
      count           // for bar
    })
  );

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* NAV BAR */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">System Reports</h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-5 py-2 rounded-full bg-purple-600 text-white shadow hover:bg-purple-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* ---------------- USER REPORTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        {/* USER PIE */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">User Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {userData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* USER BAR */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">User Count</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- CROPS SUMMARY ---------------- */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold mb-6">Crop-wise Count Summary</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* CROPS BAR CHART */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={cropChartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#f97316"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* CROPS PIE CHART */}
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={cropChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {cropChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}