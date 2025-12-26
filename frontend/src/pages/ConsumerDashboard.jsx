import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Gift, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---------------- LOAD USER DATA ---------------- */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "BUYER") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

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

  const card = "bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition";

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
          <p className="text-gray-500 mt-1">Fresh produce. Transparent delivery.</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Marketplace */}
          <div className={card}>
            <ShoppingBag className="text-green-600 mb-2" />
            <h3 className="font-semibold">Marketplace</h3>
            <p className="text-sm text-gray-500">Buy fresh produce</p>
            <button
              onClick={() =>
                navigate("/marketplace", { state: { showCart: true } })
              }
              className="mt-3 text-green-600"
            >
              Go to Cart →
            </button>
          </div>

          {/* My Orders */}
          <div className={card}>
            <Truck className="text-blue-600 mb-2" />
            <h3 className="font-semibold">My Orders</h3>
            <p className="text-sm text-gray-500">Track deliveries</p>
            <button onClick={() => navigate("/my-orders")} className="mt-3 text-blue-600">
              Track →
            </button>
          </div>

          {/* Rewards */}
          <div className={card}>
            <Gift className="text-purple-600 mb-2" />
            <h3 className="font-semibold">Rewards</h3>
            <p className="text-sm text-gray-500">Unlock coupons</p>
            <button onClick={showRewardsPopup} className="mt-3 text-purple-600">
              View →
            </button>
          </div>
        </div>

        {/* CART PREVIEW */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="text-green-600" />
            <h2 className="text-xl font-semibold">My Cart</h2>
          </div>

          {JSON.parse(localStorage.getItem("cart") || "[]").length === 0 ? (
            <p className="text-gray-500">Your cart is empty 🧺</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {JSON.parse(localStorage.getItem("cart") || "[]").map((item, i) => (
                <div key={i} className="flex justify-between border rounded-lg p-3 text-sm">
                  <span>{item.cropName}</span>
                  <span>
                    {item.quantity} × ₹{item.priceAtCart || item.price}
                  </span>
                </div>
              ))}
              <button
                onClick={() =>
                  navigate("/marketplace", { state: { showCart: true } })
                }
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
