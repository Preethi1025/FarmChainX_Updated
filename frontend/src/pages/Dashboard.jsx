import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Sprout,
  Users,
  ShoppingCart,
  IndianRupee,
  Clock,
} from "lucide-react";

import AddCropModal from "../components/AddCropModal";
import ListingModal from "../components/farmer/ListingModal";
import BatchManagement from "../components/farmer/BatchManagement";
import FarmerDashboard from "../components/farmer/FarmerDashboard";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showBatchManager, setShowBatchManager] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCropForListing, setSelectedCropForListing] = useState(null);

  /* =========================
     FETCH FARMER DATA (MERGED)
     ========================= */
  const fetchFarmerData = async () => {
    try {
      setLoading(true);

      const cropRes = await axios.get(
        `http://localhost:8080/api/crops/farmer/${user.id}`
      );

      const listingRes = await axios.get(
        "http://localhost:8080/api/listings/"
      );

      const farmerListings = Array.isArray(listingRes.data)
        ? listingRes.data.filter((l) => l.farmerId === user.id)
        : [];

      const mergedCrops = cropRes.data.map((crop) => ({
        ...crop,
        listed: farmerListings.some((l) => l.cropId === crop.cropId),
      }));

      setCrops(mergedCrops);

      /* 🔑 STATS DERIVED FROM CROPS */
      setStats({
        overview: [
          {
            label: "Total Products",
            value: mergedCrops.length,
            icon: Package,
          },
          {
            label: "Active Listings",
            value: mergedCrops.filter((c) => c.listed).length,
            icon: Sprout,
          },
          {
            label: "Monthly Revenue",
            value: "₹0",
            icon: IndianRupee,
          },
          {
            label: "Customer Rating",
            value: "0/5.0",
            icon: Users,
          },
        ],
      });
    } catch (err) {
      console.error("Error fetching farmer dashboard:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH BUYER DATA (UNCHANGED)
     ========================= */
  const fetchBuyerData = async () => {
    setLoading(true);
    setStats({
      overview: [
        { label: "Total Orders", value: 0, icon: ShoppingCart },
        { label: "Pending Orders", value: 0, icon: Clock },
        { label: "Total Spent", value: "₹0", icon: IndianRupee },
        { label: "Favorite Farmers", value: 0, icon: Users },
      ],
    });
    setOrders([]);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    user.role === "FARMER" ? fetchFarmerData() : fetchBuyerData();
  }, [user]);

  /* =========================
     GUARDS
     ========================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please Sign In
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name} 👋
          </h1>

          {user.role === "FARMER" && (
            <button
              className="btn-secondary"
              onClick={() => setShowBatchManager(true)}
            >
              Manage Batches
            </button>
          )}
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.overview.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow border"
              >
                <Icon className="h-6 w-6 text-green-600" />
                <h3 className="text-2xl font-bold mt-3">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* FARMER PANEL */}
        {user.role === "FARMER" && (
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Crops</h2>
              <button
                onClick={() => setShowAddCrop(true)}
                className="btn-primary"
              >
                Add Crop
              </button>
            </div>

            {/* IMAGE-BASED CROP DASHBOARD */}
            <FarmerDashboard
              crops={crops}
              setCrops={setCrops}
              onList={(crop) => {
                setSelectedCropForListing({
                  ...crop,
                  farmerId: user.id,
                });
                setShowListingModal(true);
              }}
            />
          </div>
        )}

        {/* MODALS */}
        {showAddCrop && (
          <AddCropModal
            farmerId={user.id}
            onClose={() => setShowAddCrop(false)}
            onCropAdded={fetchFarmerData}
          />
        )}

        {showListingModal && selectedCropForListing && (
          <ListingModal
            crop={selectedCropForListing}
            onClose={() => setShowListingModal(false)}
            onSuccess={fetchFarmerData}
          />
        )}

        {showBatchManager && (
          <BatchManagement onClose={() => setShowBatchManager(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
