import React, { useEffect, useState } from "react";
import axios from "axios";
import BatchCard from "./BatchCard";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Warehouse,
  Truck,
  CheckCircle2,
  Phone,
  MapPin,
} from "lucide-react";

const API = "http://localhost:8080/api";

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    IN_WAREHOUSE: "bg-yellow-100 text-yellow-700",
    IN_TRANSIT: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};

/* ---------------- TIMELINE ---------------- */
const OrderTimeline = ({ status }) => {
  const steps = [
    { key: "ORDER_PLACED", icon: <ShoppingCart size={16} /> },
    { key: "IN_WAREHOUSE", icon: <Warehouse size={16} /> },
    { key: "IN_TRANSIT", icon: <Truck size={16} /> },
    { key: "DELIVERED", icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <div className="flex justify-between mt-4">
      {steps.map((step) => {
        const active =
          steps.findIndex((s) => s.key === status) >=
          steps.findIndex((s) => s.key === step.key);

        return (
          <div
            key={step.key}
            className={`flex flex-col items-center text-xs ${
              active ? "text-green-600" : "text-gray-400"
            }`}
          >
            {step.icon}
          </div>
        );
      })}
    </div>
  );
};

/* ===================== MAIN ===================== */
const DistributorDashboard = () => {
  const { user } = useAuth();
  const distributorId = user?.id;
  const navigate = useNavigate();

  const [tab, setTab] = useState("BATCHES");
  const [pendingBatches, setPendingBatches] = useState([]);
  const [approvedBatches, setApprovedBatches] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!distributorId) return;
    fetchBatches();
    fetchOrders();
  }, [distributorId]);

  /* ---------------- FETCH BATCHES ---------------- */
  const fetchBatches = async () => {
    const [pendingRes, approvedRes] = await Promise.all([
      axios.get(`${API}/batches/pending`),
      axios.get(`${API}/batches/approved/${distributorId}`),
    ]);

    setPendingBatches(pendingRes.data || []);
    setApprovedBatches(approvedRes.data || []);
  };

  /* ---------------- APPROVE / REJECT (FIX) ---------------- */
  const approveBatch = async (batchId) => {
    await axios.put(
      `${API}/batches/distributor/approve/${batchId}/${distributorId}`
    );
    fetchBatches();
  };

  const rejectBatch = async (batchId) => {
    const reason = prompt("Reason for rejection?");
    if (!reason) return;

    await axios.put(
      `${API}/batches/distributor/reject/${batchId}/${distributorId}`,
      { reason }
    );
    fetchBatches();
  };

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    const res = await axios.get(`${API}/orders/distributor/${distributorId}`);
    setOrders(res.data || []);
  };

  /* ---------------- ORDER ACTIONS ---------------- */
  const updateStatus = async (id, status) => {
    await axios.put(`${API}/orders/${id}/status`, null, {
      params: { status, distributorId },
    });
    fetchOrders();
  };

  const cancelOrder = async (id) => {
    const reason = prompt("Reason for cancellation?");
    if (!reason) return;

    await axios.put(`${API}/orders/${id}/cancel`, null, {
      params: { distributorId, reason },
    });
    fetchOrders();
  };

  const liveOrders = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  );

  const historyOrders = orders.filter(
    (o) => o.status === "DELIVERED" || o.status === "CANCELLED"
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 p-6 rounded-2xl shadow bg-gradient-to-r from-green-100 to-emerald-50">
        <h1 className="text-3xl font-bold">Distributor Dashboard</h1>
        <p className="text-gray-600">Manage batches & orders</p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["BATCHES", "ORDERS", "HISTORY"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-medium ${
              tab === t ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------------- BATCHES ---------------- */}
      {tab === "BATCHES" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Pending Batches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {pendingBatches.map((b) => (
              <BatchCard
                key={b.batchId}
                batch={b}
                onApprove={approveBatch}
                onReject={rejectBatch}
                onTrace={(id) => navigate(`/trace/${id}`)}
              />
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Approved Batches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedBatches.map((b) => (
              <BatchCard
                key={b.batchId}
                batch={b}
                readOnly
                onTrace={(id) => navigate(`/trace/${id}`)}
              />
            ))}
          </div>
        </>
      )}

      {/* ---------------- ORDERS ---------------- */}
      {tab === "ORDERS" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {liveOrders.map((order) => {
            const imageUrl = order.cropImageUrl
              ? `http://localhost:8080${encodeURI(order.cropImageUrl)}`
              : "/placeholder.png";

            return (
              <motion.div
                key={order.orderId}
                className="bg-white p-5 rounded-xl shadow border"
              >
                <img
                  src={imageUrl}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  alt=""
                />

                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{order.orderCode}</h3>
                  <StatusBadge status={order.status} />
                </div>

                <p className="font-medium">{order.cropName}</p>
                <p>Quantity: {order.quantity} kg</p>
                <p>Total: ₹{order.totalAmount}</p>

                <p className="flex gap-2 text-sm mt-2">
                  <Phone size={14} /> {order.contactNumber}
                </p>
                <p className="flex gap-2 text-sm">
                  <MapPin size={14} /> {order.deliveryAddress}
                </p>

                <OrderTimeline status={order.status} />

                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => updateStatus(order.orderId, "IN_WAREHOUSE")} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Warehouse
                  </button>
                  <button onClick={() => updateStatus(order.orderId, "IN_TRANSIT")} className="bg-blue-500 text-white px-3 py-1 rounded">
                    Transit
                  </button>
                  <button onClick={() => updateStatus(order.orderId, "DELIVERED")} className="bg-green-600 text-white px-3 py-1 rounded">
                    Delivered
                  </button>
                  <button onClick={() => cancelOrder(order.orderId)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ---------------- HISTORY ---------------- */}
      {tab === "HISTORY" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {historyOrders.map((order) => {
            const imageUrl = order.cropImageUrl
              ? `http://localhost:8080${encodeURI(order.cropImageUrl)}`
              : "/placeholder.png";

            return (
              <motion.div
                key={order.orderId}
                className="bg-green-50 p-5 rounded-xl shadow border"
              >
                <img
                  src={imageUrl}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                  alt=""
                />

                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{order.orderCode}</h3>
                  <StatusBadge status={order.status} />
                </div>

                <p className="font-medium">{order.cropName}</p>
                <p>Quantity: {order.quantity} kg</p>
                <p>Total: ₹{order.totalAmount}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;
