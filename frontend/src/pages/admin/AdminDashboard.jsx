import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [farmers, setFarmers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [crops, setCrops] = useState([]);
  const admin = JSON.parse(localStorage.getItem("admin"));

  const loadData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:8080/api/admin/stats");
      const farmerRes = await axios.get("http://localhost:8080/api/admin/farmers");
      const distributorRes = await axios.get("http://localhost:8080/api/admin/distributors");
      const consumerRes = await axios.get("http://localhost:8080/api/admin/consumers");
      const cropRes = await axios.get("http://localhost:8080/api/admin/crops");

      setStats(statsRes.data);
      setFarmers(farmerRes.data);
      setDistributors(distributorRes.data);
      setConsumers(consumerRes.data);
      setCrops(cropRes.data);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-primary-700">
        Welcome Admin, {admin?.name}
      </h1>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Farmers", value: stats.farmers },
          { label: "Distributors", value: stats.distributors },
          { label: "Consumers", value: stats.consumers },
          { label: "Total Crops", value: stats.crops }
        ].map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-primary-700">{card.value}</h2>
            <p className="text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      {/* --- Data Tables --- */}

      <AdminTable title="Farmers" data={farmers} />
      <AdminTable title="Distributors" data={distributors} />
      <AdminTable title="Consumers" data={consumers} />
      <AdminTable title="Crops" data={crops} cropTable />
    </div>
  );
}

function AdminTable({ title, data, cropTable }) {
  return (
    <div className="mb-10 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="py-2 px-3 border text-left capitalize">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  {Object.values(row).map((v, i) => (
                    <td key={i} className="py-2 px-3 border">
                      {String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
