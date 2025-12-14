import React, { useEffect, useState } from "react";
import axios from "axios";
import BatchCard from "./BatchCard";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

const DistributorDashboard = () => {
  const { user } = useAuth();
  const distributorId = user?.id;
  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!distributorId) return;
    fetchBatches();
  }, [distributorId]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      // 1️⃣ Fetch batches
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(`${API_BASE}/batches/pending`),
        axios.get(`${API_BASE}/batches/approved/${distributorId}`),
      ]);

      // 2️⃣ Attach price to each batch
      const enrichWithPrice = async (batches) => {
        return Promise.all(
          batches.map(async (batch) => {
            try {
              const cropRes = await axios.get(
                `${API_BASE}/crops/by-batch`,
                { params: { batchId: batch.batchId } }
              );

              const crops = cropRes.data || [];
              const price =
                crops.length > 0 && crops[0].price != null
                  ? crops[0].price
                  : null;

              return { ...batch, price };
            } catch {
              return { ...batch, price: null };
            }
          })
        );
      };

      setPending(await enrichWithPrice(pendingRes.data || []));
      setApproved(await enrichWithPrice(approvedRes.data || []));
    } catch (e) {
      console.error("Failed to load batches:", e);
      alert("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (batchId) => {
    try {
      await axios.put(
        `${API_BASE}/batches/distributor/approve/${batchId}/${distributorId}`
      );
      fetchBatches();
    } catch {
      alert("Approve failed");
    }
  };

  const handleReject = async (batchId) => {
    try {
      const reason = window.prompt(
        "Enter rejection reason (optional):",
        "Quality issues"
      );
      await axios.put(
        `${API_BASE}/batches/distributor/reject/${batchId}/${distributorId}`,
        { reason }
      );
      fetchBatches();
    } catch {
      alert("Reject failed");
    }
  };

  const handleTrace = (batchId) => {
    navigate(`/trace/${batchId}`);
  };

  if (!distributorId)
    return <p className="text-center mt-10">Please login as distributor.</p>;

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-2xl p-6 shadow-lg bg-gradient-to-r from-green-100 via-emerald-50 to-green-100"
      >
        <h1 className="text-3xl font-semibold text-gray-800">
          Distributor Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and approve farmer batches with ease
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          icon={<Clock size={28} />}
          label="Pending Batches"
          value={pending.length}
          bg="from-yellow-50 to-yellow-100"
        />
        <StatsCard
          icon={<CheckCircle2 size={28} />}
          label="Approved Batches"
          value={approved.length}
          bg="from-green-50 to-green-100"
        />
        <StatsCard
          icon={<ListChecks size={28} />}
          label="Total Processed"
          value={pending.length + approved.length}
          bg="from-blue-50 to-blue-100"
        />
      </div>

      {/* PENDING */}
      <SectionHeading title="Pending Batches" />
      {pending.length === 0 ? (
        <p className="text-gray-600">No pending batches.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map((batch) => (
            <BatchCard
              key={batch.batchId}
              batch={batch}
              onApprove={handleApprove}
              onReject={handleReject}
              onTrace={handleTrace}
            />
          ))}
        </div>
      )}

      {/* APPROVED */}
      <SectionHeading title="Approved Batches" className="mt-12" />
      {approved.length === 0 ? (
        <p className="text-gray-600">No approved batches yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approved.map((batch) => (
            <BatchCard
              key={batch.batchId}
              batch={batch}
              readOnly
              onTrace={handleTrace}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;

/* -------------------- */

const StatsCard = ({ icon, label, value, bg }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-5 rounded-2xl shadow-md bg-gradient-to-br ${bg} flex items-center gap-4`}
  >
    <div className="p-3 rounded-xl bg-white shadow">{icon}</div>
    <div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const SectionHeading = ({ title, className = "" }) => (
  <h2
    className={`text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-green-500 pl-3 ${className}`}
  >
    {title}
  </h2>
);
