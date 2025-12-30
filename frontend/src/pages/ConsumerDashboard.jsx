import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Scan, ShoppingBag, Shield, Clock, 
  TrendingUp, CheckCircle, BarChart3,
  Package, Star, Users, Leaf, Search, Bot,
  ChevronRight, ExternalLink, Bell, Settings,
  DollarSign, Truck, Award, Heart, Gift, Activity,
  ArrowLeft, Sparkles, Globe, MessageCircle, Zap, BookOpen, Brain
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import FreeAIAgent from "./FreeAIAgent"; 
import { ShoppingCart } from "lucide-react";
// Assuming FreeAIAgent is in same folder

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

   const showRewardsPopup = () => {
    alert(
      "🎁 AVAILABLE REWARDS\n\n" +
        "• ₹100 OFF on shopping above ₹500\n" +
        "• ₹250 OFF on shopping above ₹1000\n" +
        "• Free delivery on your 5th order"
    );
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "BUYER") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const cardClass = "bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition";

  const exampleQuestions = [
    "What are the nutritional benefits of tomatoes?",
    "How many calories in 100g of potatoes?",
    "What's the best way to store apples?",
    "Are there any side effects of eating too much spinach?",
    "What's the market price of wheat this season?",
    "How to identify fresh vegetables vs stale ones?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Header - MODIFIED WITH AI BUTTON */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl shadow-lg">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Welcome, {user.name} 🌱</h1>
                  <p className="text-sm text-gray-600 hidden md:block">Track your orders and earn rewards while buying fresh produce</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                <Bot size={20} />
                <span className="font-medium">{showAIAssistant ? "Close AI" : "Ask AI Assistant"}</span>
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-full border border-primary-200">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary-700">Live Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Assistant Section - Only shows when toggled */}
        {showAIAssistant && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                {/* Welcome Message */}
                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <MessageCircle className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Hello! I'm your Buyer's AI Assistant 🤖</h2>
                      <p className="text-gray-600 mt-1">
                        Ask me anything about crop nutrition, prices, quality tips, or buying advice.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Free AI Agent Component */}
                <div className="mb-6">
                  <FreeAIAgent />
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-blue-600" size={18} />
                        <h4 className="font-semibold text-gray-900">Buyer Focused</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Get nutrition info, prices, and quality tips for better buying decisions.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="text-emerald-600" size={18} />
                        <h4 className="font-semibold text-gray-900">Market Insights</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Access current market prices and seasonal trends for informed purchases.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-purple-600" size={18} />
                        <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Learn how to identify fresh produce and avoid common buying mistakes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Original Dashboard Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Quick Actions Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                <h3 className="text-lg font-semibold">Offers</h3>
                <p className="text-gray-500 text-sm">Check Upcoming Offers</p>
                <button type="button" onClick={() => navigate("/rewards")} className="mt-4 text-purple-600 font-medium">
                  Offer can be activated from New Year →
                </button>
              </div>
            </div>
          </div>

          {/* Live Activity Section */}
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

          {/* Stats Overview */}
          {/* <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-700">0</div>
                <div className="text-sm text-gray-600">Orders Today</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-700">₹0</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-700">0</div>
                <div className="text-sm text-gray-600">Reward Points</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-700">0</div>
                <div className="text-sm text-gray-600">Favorite Items</div>
              </div>
            </div>
          </div> */}

          

          {/* Tips for Buyers */}
          <div className="bg-gradient-to-r from-primary-100 to-emerald-100 border border-primary-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Buying Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-primary-600 mt-0.5">1</span>
                <div>
                  <h4 className="font-medium text-gray-900">Check Freshness</h4>
                  <p className="text-sm text-gray-600">
                    Look for vibrant colors, firm texture, and no blemishes when buying produce.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-600 mt-0.5">2</span>
                <div>
                  <h4 className="font-medium text-gray-900">Seasonal Buying</h4>
                  <p className="text-sm text-gray-600">
                    Buy seasonal produce for better taste, nutrition, and lower prices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
