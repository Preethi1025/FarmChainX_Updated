import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Truck,
  Gift,
  Timer,
  ShoppingCart
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:8080/api";

/* ---------------- HELPERS ---------------- */
const getCountdown = (dateStr) => {
  if (!dateStr) return "TBD";
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return "Arriving soon";
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${hrs}h ${mins}m`;
};

const OrderTimeline = ({ status }) => {
  const steps = ["ORDER_PLACED", "IN_WAREHOUSE", "IN_TRANSIT", "DELIVERED"];
  return (
    <div className="flex gap-2 mt-2 text-xs flex-wrap">
      {steps.map((s) => (
        <span
          key={s}
          className={`px-2 py-1 rounded-full ${
            steps.indexOf(s) <= steps.indexOf(status)
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {s.replace("_", " ")}
        </span>
      ))}
    </div>
  );
};

/* ---------------- MAIN ---------------- */
const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [liveOrders, setLiveOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  /* ---------------- LOAD USER DATA ---------------- */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "BUYER") {
      navigate("/", { replace: true });
    } else {
      fetchOrders();
      loadCart();
    }
  }, [user, navigate]);

  /* ---------------- FETCH LIVE ORDERS ---------------- */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/buyer/${user.id}`);
      const orders = res.data || [];

      const live = orders.filter((o) =>
        ["ORDER_PLACED", "IN_WAREHOUSE", "IN_TRANSIT"].includes(o.status)
      );

      setLiveOrders(live);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  /* ---------------- LOAD CART ---------------- */
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  };

  /* ---------------- REWARDS POPUP ---------------- */
  const showRewardsPopup = () => {
    alert(
      "🎁 AVAILABLE REWARDS\n\n" +
        "• ₹100 OFF on shopping above ₹500\n" +
        "• ₹250 OFF on shopping above ₹1000\n" +
        "• Free delivery on your 5th order"
    );
  };

  if (!user) return null;

  const card =
    "bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.name} 🌱
          </h1>
          <p className="text-gray-500 mt-1">
            Fresh produce. Transparent delivery.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className={card}>
            <ShoppingBag className="text-green-600 mb-2" />
            <h3 className="font-semibold">Marketplace</h3>
            <p className="text-sm text-gray-500">Buy fresh produce</p>
            <button
              onClick={() => navigate("/marketplace", { state: { showCart: true } })}
              className="mt-3 text-green-600"
            >
              Go to Cart →
            </button>
          </div>

          <div className={card}>
            <Truck className="text-blue-600 mb-2" />
            <h3 className="font-semibold">My Orders</h3>
            <p className="text-sm text-gray-500">Track deliveries</p>
            <button
              onClick={() => navigate("/my-orders")}
              className="mt-3 text-blue-600"
            >
              Track →
            </button>
          </div>

          <div className={card}>
            <Gift className="text-purple-600 mb-2" />
            <h3 className="font-semibold">Rewards</h3>
            <p className="text-sm text-gray-500">Unlock coupons</p>
            <button
              onClick={showRewardsPopup}
              className="mt-3 text-purple-600"
            >
              View →
            </button>
          </div>
        </div>

        {/* LIVE ORDERS */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4"></h2>
          {liveOrders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg font-medium text-gray-700">
                
              </p>
              <p className="text-sm text-gray-500 mt-1">
                🌾 Fresh produce from local farmers is waiting for you
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Place Your Order →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {liveOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-xl p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{order.cropName}</p>
                      <OrderTimeline status={order.status} />
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Timer size={14} />
                      {getCountdown(order.expectedDelivery)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART PREVIEW */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="text-green-600" />
            <h2 className="text-xl font-semibold">My Cart</h2>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty 🧺
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border rounded-lg p-3 text-sm"
                >
                  <span>{item.cropName}</span>
                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))}
              <button
                onClick={() => navigate("/marketplace", { state: { showCart: true } })}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Go to Marketplace → Cart
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ConsumerDashboard;
