import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Calendar, IndianRupee, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Backend statuses
const statusSteps = ["ORDER_PLACED", "IN_TRANSIT", "IN_WAREHOUSE", "DELIVERED"];

// Human-readable labels for UI
const statusLabels = {
  ORDER_PLACED: "Order Placed",
  IN_TRANSIT: "In Transit",
  IN_WAREHOUSE: "In Warehouse",
  DELIVERED: "Delivered"
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // ✅ Use full details endpoint
    axios
      .get(`http://localhost:8080/api/orders/consumer/${user.id}/full`)
      .then((res) => {
        setOrders(res.data);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders 📦</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              const completedIndex = statusSteps.indexOf(order.status);

              return (
                <motion.div
                  key={order.orderId}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {order.orderCode || `#${order.orderId}`}
                    </h2>
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  {/* Crop, Farmer, Distributor Details */}
                  <div className="space-y-2 text-gray-600 text-sm mb-4">
                    <div>
                      <b>Crop:</b> {order.cropName} ({order.cropType})
                    </div>
                    <div>
                      <b>Farmer:</b> {order.farmerName} | Contact: {order.farmerContact}
                    </div>
                    <div>
                      <b>Distributor:</b> {order.distributorName} | Contact: {order.distributorContact}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Package size={16} /> Quantity: <b>{order.quantity} kg</b>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} /> Total Amount: <b>₹{order.totalAmount}</b>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> Ordered On:{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-4 flex items-center justify-between relative">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= completedIndex;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center relative">
                          {/* Circle */}
                          <div
                            className={`w-6 h-6 rounded-full ${
                              isCompleted ? "bg-green-600" : "bg-gray-300"
                            }`}
                          ></div>
                          {/* Label */}
                          <span
                            className={`text-xs mt-1 text-center ${
                              isCompleted ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {statusLabels[step]}
                          </span>
                          {/* Connecting line */}
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`absolute top-2.5 left-1/2 w-full h-1 -translate-x-1/2 z-0 ${
                                index < completedIndex ? "bg-green-600" : "bg-gray-300"
                              }`}
                              style={{ width: "100%", height: "2px" }}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Track Button */}
                  <button
                    type="button"
                    onClick={() => alert(`Tracking order ${order.orderCode || order.orderId}`)}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    Track Order
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyOrders;
