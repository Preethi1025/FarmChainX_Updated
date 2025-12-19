import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Gift, Activity } from "lucide-react"; // Replace MapPin with Gift
import { useAuth } from "../context/AuthContext";

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "BUYER") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const cardClass = "bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name} 🌱</h1>
            <p className="text-gray-500 mt-1">Track your orders and earn rewards while buying fresh produce</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Marketplace */}
          <div className={cardClass}>
            <ShoppingBag className="text-green-600 mb-2" />
            <h3 className="text-lg font-semibold">Marketplace</h3>
            <p className="text-gray-500 text-sm">Buy fresh products directly</p>
            <button type="button" onClick={() => navigate("/marketplace")} className="mt-4 text-green-600 font-medium">
              Explore →
            </button>
          </div>

          {/* My Orders */}
          <div className={cardClass}>
            <Truck className="text-blue-600 mb-2" />
            <h3 className="text-lg font-semibold">My Orders</h3>
            <p className="text-gray-500 text-sm">View live & past orders</p>
            <button type="button" onClick={() => navigate("/my-orders")} className="mt-4 text-blue-600 font-medium">
              Track Orders →
            </button>
          </div>

          {/* Rewards */}
          <div className={cardClass}>
            <Gift className="text-purple-600 mb-2" />
            <h3 className="text-lg font-semibold">Rewards</h3>
            <p className="text-gray-500 text-sm">Check your earned points & vouchers</p>
            <button type="button" onClick={() => navigate("/rewards")} className="mt-4 text-purple-600 font-medium">
              View Rewards →
            </button>
          </div>
        </div>

        {/* Live Activity */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Live Order Activity</h2>
          </div>
          <p className="text-gray-500 text-sm">Your active orders and delivery updates will appear here in real-time.</p>
          <button type="button" onClick={() => navigate("/my-orders")} className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            View Live Orders
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsumerDashboard;
