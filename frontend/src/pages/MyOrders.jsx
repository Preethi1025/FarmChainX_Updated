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
  CheckCircle,
  XCircle,
  Phone
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8080";

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
  const fetchOrders = () => {
    if (!user?.id) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/api/orders/consumer/${user.id}/full`)
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  /* =======================
     CANCEL ORDER
  ======================= */
  const cancelOrder = async (orderId) => {
    const reason = window.prompt(
      "Please enter a reason for cancellation (this will notify the distributor):",
      "Cancelled by consumer"
    );

    if (!reason) return;

    try {
      await axios.put(
        `${API_BASE}/api/orders/${orderId}/cancel`,
        { cancelReason: reason },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Order cancelled successfully and distributor notified!");
      fetchOrders();
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Unable to cancel order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Orders 📦
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              const imageUrl =
                order.cropImageUrl?.startsWith("/uploads")
                  ? `${API_BASE}${order.cropImageUrl}`
                  : order.imageName
                  ? `${API_BASE}/uploads/${order.imageName}`
                  : null;

              return (
                <motion.div
                  key={order.orderId}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${
                    order.status === "CANCELLED"
                      ? "border-red-500"
                      : "border-green-500"
                  }`}
                >
                  {/* IMAGE */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={order.cropName}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg mb-4 text-gray-400 text-sm">
                      No Image Available
                    </div>
                  )}

                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">{order.orderCode}</h2>
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
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>
                      <b>Crop:</b> {order.cropName} ({order.cropType})
                    </p>

                    <p className="flex items-center gap-2">
                      <b>Farmer:</b> {order.farmerName}
                      {order.farmerPhone && (
                        <a
                          href={`tel:${order.farmerPhone}`}
                          className="flex items-center gap-1 text-green-600 underline"
                        >
                          <Phone size={14} /> {order.farmerPhone}
                        </a>
                      )}
                    </p>

                    <p className="flex items-center gap-2">
                      <b>Distributor:</b> {order.distributorName}
                      {order.distributorPhone && (
                        <a
                          href={`tel:${order.distributorPhone}`}
                          className="flex items-center gap-1 text-blue-600 underline"
                        >
                          <Phone size={14} /> {order.distributorPhone}
                        </a>
                      )}
                    </p>
                  </div>

                  {/* META */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Package size={16} /> {order.quantity} kg
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} /> ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setTrackingOrder(order)}
                      disabled={order.status === "CANCELLED"}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white ${
                        order.status === "CANCELLED"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Track Order
                    </button>

                    {order.status === "ORDER_PLACED" && (
                      <button
                        onClick={() => cancelOrder(order.orderId)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* TRACKING MODAL */}
      <AnimatePresence>
        {trackingOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  📦 Tracking – {trackingOrder.orderCode}
                </h2>
                <button onClick={() => setTrackingOrder(null)}>
                  <X />
                </button>
              </div>

              <TrackingItem
                icon={<CheckCircle className="text-green-600" />}
                title="Order Placed"
                time={trackingOrder.createdAt}
              />
              <TrackingItem
                icon={<Warehouse className="text-blue-600" />}
                title="In Warehouse"
                time={trackingOrder.warehouseAt}
              />
              <TrackingItem
                icon={<Truck className="text-orange-600" />}
                title="Out for Delivery"
                time={trackingOrder.inTransitAt}
              />
              <TrackingItem
                icon={<CheckCircle className="text-green-700" />}
                title="Delivered"
                time={trackingOrder.deliveredAt}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrackingItem = ({ icon, title, time }) => (
  <div className="flex gap-3 mb-3">
    {icon}
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500">
        {time ? new Date(time).toLocaleString() : "Pending"}
      </p>
    </div>
  </div>
);

export default MyOrders;
