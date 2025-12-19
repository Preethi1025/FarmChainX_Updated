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
  Warehouse,
  Truck,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

/* -------------------- STATS CARD -------------------- */
const StatsCard = ({ icon, label, value }) => (
  <div className="p-4 rounded-xl shadow bg-white flex items-center gap-3">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

/* -------------------- ORDER TIMELINE -------------------- */
const OrderTimeline = ({ order }) => {
  const steps = [
    { key: "ORDER_PLACED", label: "Order Placed", icon: <ShoppingCart /> },
    { key: "IN_WAREHOUSE", label: "In Warehouse", icon: <Warehouse /> },
    { key: "IN_TRANSIT", label: "In Transit", icon: <Truck /> },
    { key: "DELIVERED", label: "Delivered", icon: <CheckCircle2 /> }
  ];

  return (
    <div className="mt-4 space-y-3">
      {steps.map((step) => {
        const active =
          steps.findIndex(s => s.key === order.status) >=
          steps.findIndex(s => s.key === step.key);

        return (
          <div
            key={step.key}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              active ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
            }`}
          >
            {step.icon}
            <span className="font-medium">{step.label}</span>
          </div>
        );
      })}

      {order.status === "CANCELLED" && (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50 text-red-700">
          <XCircle />
          <span className="font-medium">
            Cancelled — {order.cancelReason || "No reason"}
          </span>
        </div>
      )}

      <p className="text-sm text-gray-600 mt-2">
        <b>Expected Delivery:</b>{" "}
        {order.expectedDelivery
          ? new Date(order.expectedDelivery).toLocaleString()
          : "Not set"}
      </p>
    </div>
  );
};

/* -------------------- MAIN -------------------- */
const DistributorDashboard = () => {
  const { user } = useAuth();
  const distributorId = user?.id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("BATCHES");
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [orders, setOrders] = useState([]);

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    if (!distributorId) return;
    fetchBatches();
    fetchOrders();
  }, [distributorId]);

  const fetchBatches = async () => {
    try {
      const [p, a] = await Promise.all([
        axios.get(`${API_BASE}/batches/pending`),
        axios.get(`${API_BASE}/batches/approved/${distributorId}`)
      ]);
      setPending(p.data || []);
      setApproved(a.data || []);
    } catch (err) {
      console.error("Batch fetch error", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/orders/distributor/${distributorId}`
      );
      setOrders(res.data || []);
    } catch (err) {
      console.error("Order fetch error", err);
    }
  };

  /* -------------------- ORDER ACTIONS -------------------- */
  const updateOrderStatus = async (orderId, status) => {
    await axios.put(
      `${API_BASE}/orders/${orderId}/status`,
      null,
      { params: { status, distributorId } }
    );
    fetchOrders();
  };

  const setExpectedDelivery = async (orderId, date) => {
    if (!date) return;
    await axios.put(
      `${API_BASE}/orders/${orderId}/expected-delivery`,
      null,
      { params: { expectedDelivery: date, distributorId } }
    );
    fetchOrders();
  };

  const cancelOrder = async (orderId) => {
    const reason = prompt("Reason for cancellation?");
    if (!reason) return;

    await axios.put(
      `${API_BASE}/orders/${orderId}/cancel`,
      null,
      { params: { distributorId, reason } }
    );
    fetchOrders();
  };

  /* -------------------- FILTERS -------------------- */
  const liveOrders = orders.filter(
    o => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  );

  const historyOrders = orders.filter(
    o => o.status === "DELIVERED" || o.status === "CANCELLED"
  );

  if (!distributorId) {
    return <p className="mt-10 text-center">Login as distributor</p>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Distributor Dashboard</h1>
        <p className="text-gray-600">Supply chain & order handling</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<ShoppingCart />} label="Live Orders" value={liveOrders.length} />
        <StatsCard icon={<CheckCircle2 />} label="Approved Batches" value={approved.length} />
        <StatsCard icon={<Clock />} label="Pending Batches" value={pending.length} />
        <StatsCard icon={<ListChecks />} label="Order History" value={historyOrders.length} />
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["BATCHES", "ORDERS"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium ${
              activeTab === tab ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* -------------------- BATCHES -------------------- */}
      {activeTab === "BATCHES" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Pending Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pending.length === 0 ? (
              <p className="text-gray-500">No pending batches</p>
            ) : (
              pending.map(batch => (
                <BatchCard
                  key={batch.batchId}
                  batch={batch}
                  onApprove={() =>
                    axios.put(
                      `${API_BASE}/batches/distributor/approve/${batch.batchId}/${distributorId}`
                    ).then(fetchBatches)
                  }
                  onReject={() => {
                    const reason = prompt("Reason?");
                    axios.put(
                      `${API_BASE}/batches/distributor/reject/${batch.batchId}/${distributorId}`,
                      { reason }
                    ).then(fetchBatches);
                  }}
                  onTrace={() => navigate(`/trace/${batch.batchId}`)}
                />
              ))
            )}
          </div>

          <h2 className="text-xl font-semibold mt-10 mb-4">Approved Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approved.length === 0 ? (
              <p className="text-gray-500">No approved batches</p>
            ) : (
              approved.map(batch => (
                <BatchCard
                  key={batch.batchId}
                  batch={batch}
                  readOnly
                  onTrace={() => navigate(`/trace/${batch.batchId}`)}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* -------------------- ORDERS -------------------- */}
      {activeTab === "ORDERS" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Live Orders</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveOrders.length === 0 ? (
              <p className="text-gray-500">No active orders</p>
            ) : (
              liveOrders.map(order => (
                <motion.div
                  key={order.orderId}
                  className="p-5 bg-white rounded-2xl shadow border"
                >
                  <h3 className="font-semibold text-lg mb-2">{order.orderCode}</h3>
                  <p><b>Crop:</b> {order.cropName}</p>
                  <p><b>Quantity:</b> {order.quantity} kg</p>
                  <p><b>Total:</b> ₹{order.totalAmount}</p>

                  <OrderTimeline order={order} />

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button onClick={() => updateOrderStatus(order.orderId, "IN_WAREHOUSE")}
                      className="px-3 py-1 bg-green-600 text-white rounded">
                      In Warehouse
                    </button>
                    <button onClick={() => updateOrderStatus(order.orderId, "IN_TRANSIT")}
                      className="px-3 py-1 bg-blue-600 text-white rounded">
                      In Transit
                    </button>
                    <button onClick={() => updateOrderStatus(order.orderId, "DELIVERED")}
                      className="px-3 py-1 bg-green-700 text-white rounded">
                      Delivered
                    </button>
                    <button onClick={() => cancelOrder(order.orderId)}
                      className="px-3 py-1 bg-red-600 text-white rounded">
                      Cancel
                    </button>
                    <input
                      type="datetime-local"
                      className="border rounded px-2 py-1"
                      onChange={(e) =>
                        setExpectedDelivery(order.orderId, e.target.value)
                      }
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DistributorDashboard;
