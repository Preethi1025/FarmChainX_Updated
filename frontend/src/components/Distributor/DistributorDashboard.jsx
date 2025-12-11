import React, { useEffect, useState } from "react";
import axios from "axios";
import BatchCard from "./BatchCard";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { CircleCheckBig, Clock, ListChecks } from "lucide-react";

const DistributorDashboard = () => {
  const { user } = useAuth();
  const distributorId = user?.id;

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    if (!distributorId) return;
    fetchBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributorId]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(`${API_BASE}/batches/pending`),
        axios.get(`${API_BASE}/batches/approved/${distributorId}`)
      ]);

      setPending(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setApproved(Array.isArray(approvedRes.data) ? approvedRes.data : []);
    } catch (e) {
      console.error("Failed to load batches:", e);
      alert("Failed to load batches");
      setPending([]);
      setApproved([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ APPROVE BATCH ------------------
  const handleApprove = async (batchId) => {
    try {
      await axios.put(`${API_BASE}/batches/distributor/approve/${batchId}/${distributorId}`);
      fetchBatches();
    } catch (e) {
      console.error("Approve failed:", e);
      alert("Approve failed");
    }
  };
  // ------------------ REJECT BATCH ------------------
  const handleReject = async (batchId) => {
    try {
      const reason = window.prompt("Enter rejection reason (optional):", "Quality issues");
      await axios.put(
        `${API_BASE}/batches/distributor/reject/${batchId}/${distributorId}`,
        { reason }
      );
      fetchBatches();
    } catch (e) {
      console.error("Reject failed:", e);
      alert("Reject failed");
    }
  };



  if (!distributorId) return <p className="text-center mt-10">Please login as distributor.</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 w-full">
      {/* ----- HEADER SECTION ----- */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 glass-effect rounded-2xl p-6 shadow-lg"
      >
        <h1 className="text-3xl font-semibold text-gray-800">Distributor Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage and approve daily farmer batches</p>
      </motion.div>

      {/* ----- STATUS CARDS ----- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          icon={<Clock size={30} />}
          label="Pending Batches"
          value={pending.length}
          color="text-yellow-600"
        />
        <StatsCard
          icon={<CircleCheckBig size={30} />}
          label="Approved Batches"
          value={approved.length}
          color="text-green-600"
        />
        <StatsCard
          icon={<ListChecks size={30} />}
          label="Total Processed"
          value={pending.length + approved.length}
          color="text-blue-600"
        />
      </div>

      {/* ----- PENDING BATCHES ----- */}
      <SectionHeading title="Pending Batches for Review" />

      {pending.length === 0 ? (
        <p className="text-gray-600 mt-3">No pending batches.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map((batch) => (
            <BatchCard
              key={batch.batchId || batch.id}
              batch={batch}
              onApprove={() => handleApprove(batch.batchId)}
              onReject={(reason) => handleReject(batch.batchId, reason)}
            />
          ))}
        </div>
      )}

      {/* ----- APPROVED BATCHES ----- */}
      <SectionHeading title="Approved & Listed Batches" className="mt-12" />

      {approved.length === 0 ? (
        <p className="text-gray-600 mt-3">No approved batches yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approved.map((batch) => (
            <BatchCard key={batch.batchId || batch.id} batch={batch} readOnly />
          ))}
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;

/* ---------------------- EXTRA COMPONENTS ------------------------ */

const StatsCard = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-effect rounded-2xl p-5 flex items-center gap-4 shadow-md"
  >
    <div className={`p-3 rounded-xl bg-white shadow ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const SectionHeading = ({ title, className = "" }) => (
  <h2 className={`text-2xl font-semibold text-gray-800 mb-4 ${className}`}>
    {title}
  </h2>
);
