import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  IndianRupee,
  X,
  Truck,
  Warehouse,
  CheckCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* =======================
   STATUS CONFIG
======================= */
const statusLabels = {
  ORDER_PLACED: "Order Placed",
  IN_WAREHOUSE: "In Warehouse",
  IN_TRANSIT: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled ❌"
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);

  /* =======================
     FETCH ORDERS
  ======================= */
  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:8080/api/orders/consumer/${user.id}/full`)
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Orders 📦
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.orderId}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${
                  order.status === "CANCELLED"
                    ? "border-red-500"
                    : "border-green-500"
                }`}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {order.orderCode}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="space-y-2 text-gray-600 text-sm mb-4">
                  <p><b>Crop:</b> {order.cropName} ({order.cropType})</p>
                  <p><b>Farmer:</b> {order.farmerName} | {order.farmerContact}</p>
                  <p><b>Distributor:</b> {order.distributorName} | {order.distributorContact}</p>
                </div>

                <div className="space-y-2 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Package size={16} /> Quantity: <b>{order.quantity} kg</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee size={16} /> Total: <b>₹{order.totalAmount}</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> Ordered On:{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* CANCELLED INFO */}
                {order.status === "CANCELLED" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
                    <p className="text-red-700 font-semibold">
                      ❌ Order Cancelled by Distributor
                    </p>
                    <p className="text-red-600 text-sm mt-1">
                      <b>Reason:</b> {order.cancelReason || "No reason provided"}
                    </p>
                  </div>
                )}

                {/* TRACK BUTTON */}
                <button
                  type="button"
                  disabled={order.status === "CANCELLED"}
                  onClick={() => {
                    if (order.status !== "CANCELLED") {
                      setTrackingOrder(order);
                    }
                  }}
                  className={`mt-5 w-full px-5 py-2 rounded-lg font-semibold text-white transition ${
                    order.status === "CANCELLED"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Track Order
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* =======================
          TRACKING MODAL
      ======================= */}
      <AnimatePresence>
        {trackingOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 relative"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📦 Tracking – {trackingOrder.orderCode}
                </h2>
                <button onClick={() => setTrackingOrder(null)}>
                  <X />
                </button>
              </div>

              {/* TRACKING STEPS */}
              <div className="space-y-4">
                <TrackingItem
                  icon={<CheckCircle className="text-green-600" />}
                  title="Order Placed"
                  time={trackingOrder.createdAt}
                  desc="Your order has been placed successfully."
                />
                <TrackingItem
                  icon={<Warehouse className="text-blue-600" />}
                  title="In Warehouse"
                  time={trackingOrder.warehouseAt}
                  desc="Order received and packed at warehouse."
                />
                <TrackingItem
                  icon={<Truck className="text-orange-600" />}
                  title="Out for Delivery"
                  time={trackingOrder.inTransitAt}
                  desc="Order is on the way to your address."
                />
                <TrackingItem
                  icon={<Calendar className="text-purple-600" />}
                  title="Expected Delivery"
                  time={trackingOrder.expected_delivery}
                  desc="Your order is expected to be delivered by this time."
                />
                <TrackingItem
                  icon={<CheckCircle className="text-green-700" />}
                  title="Delivered"
                  time={trackingOrder.deliveredAt}
                  desc="Order delivered successfully."
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =======================
   TRACK ITEM COMPONENT
======================= */
const TrackingItem = ({ icon, title, time, desc }) => (
  <div className="flex gap-3 items-start">
    <div>{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">
        {time ? new Date(time).toLocaleString() : "Pending"}
      </p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  </div>
);

export default MyOrders;
