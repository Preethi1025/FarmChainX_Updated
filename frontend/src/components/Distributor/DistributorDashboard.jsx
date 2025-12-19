import React, { useEffect, useState } from "react";
import axios from "axios";
import BatchCard from "./BatchCard";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  ListChecks,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

/* -------------------- UI COMPONENTS -------------------- */

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

const SectionHeading = ({ title }) => (
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">
    {title}
  </h2>
);

/* -------------------- MAIN COMPONENT -------------------- */

const DistributorDashboard = () => {
  const { user } = useAuth();
  const distributorId = user?.id;
  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!distributorId) return;
    fetchBatches();
    fetchOrders();
  }, [distributorId]);

  /* -------------------- FETCH BATCHES -------------------- */

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(`${API_BASE}/batches/pending`),
        axios.get(`${API_BASE}/batches/approved/${distributorId}`),
      ]);

      setPending(pendingRes.data || []);
      setApproved(approvedRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- FETCH ORDERS -------------------- */

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/orders/distributor/${distributorId}`
      );
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  /* -------------------- ORDER ACTIONS (FIXED) -------------------- */

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API_BASE}/orders/${orderId}/status`,
        null,
        {
          params: {
            status,
            distributorId,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  const setExpectedDelivery = async (orderId) => {
    const dateStr = prompt("Enter expected delivery (YYYY-MM-DDTHH:mm)");
    if (!dateStr) return;

    try {
      await axios.put(
        `${API_BASE}/orders/${orderId}/expected-delivery`,
        null,
        {
          params: {
            expectedDelivery: dateStr,
            distributorId,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to set delivery date");
    }
  };

  /* -------------------- BATCH ACTIONS -------------------- */

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
      const reason = prompt("Enter rejection reason:", "Quality issues");
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

  /* -------------------- RENDER -------------------- */

  if (!distributorId) {
    return <p className="text-center mt-10">Please login as distributor.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 w-full">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-2xl p-6 shadow-lg bg-gradient-to-r from-green-100 to-green-50"
      >
        <h1 className="text-3xl font-semibold text-gray-800">
          Distributor Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage batches and customer orders
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
          label="Total Orders"
          value={orders.length}
          bg="from-blue-50 to-blue-100"
        />
      </div>

      {/* ORDERS SECTION */}
      <SectionHeading title="Active Orders" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto pr-2 mb-12">
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl shadow bg-white border"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {order.orderCode}
                </h3>
                <span className="text-sm text-gray-500">
                  {order.status}
                </span>
              </div>

              <p><b>Crop:</b> {order.cropName} ({order.cropType})</p>
              <p><b>Quantity:</b> {order.quantity} kg</p>
              <p><b>Total:</b> ₹{order.totalAmount}</p>
              <p>
                <b>Expected Delivery:</b>{" "}
                {order.expectedDelivery || "Not set"}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() =>
                    updateOrderStatus(order.orderId, "IN_TRANSIT")
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  In Transit
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(order.orderId, "DELIVERED")
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Delivered
                </button>
                <button
                  onClick={() => setExpectedDelivery(order.orderId)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded"
                >
                  Set Delivery
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* BATCH SECTIONS */}
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

      <SectionHeading title="Approved Batches" />
      {approved.length === 0 ? (
        <p className="text-gray-600">No approved batches.</p>
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
