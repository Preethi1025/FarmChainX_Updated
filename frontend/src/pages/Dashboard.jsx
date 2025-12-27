import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Package, TrendingUp, Sprout, Clock,
  ShoppingCart, IndianRupee, Users
} from 'lucide-react';

import AddCropModal from '../components/AddCropModal';
import ListingModal from '../components/farmer/ListingModal';
import BatchManagement from '../components/farmer/BatchManagement';
import AIAssistantButton from '../components/AIAssistantButton';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showBatchManager, setShowBatchManager] = useState(false);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCropForListing, setSelectedCropForListing] = useState(null);

  // ------------------ Fetch Farmer Data ------------------
  const fetchFarmerData = async () => {
    try {
      setLoading(true);

      // Fetch crops
      const cropsRes = await axios.get(`http://localhost:8080/api/crops/farmer/${user.id}`);
      // Fetch listings
      const listingsRes = await axios.get(`http://localhost:8080/api/listings/`);
      const farmerListings = listingsRes.data.filter(l => l.farmerId === user.id);

      const mappedCrops = cropsRes.data.map(crop => ({
        ...crop,
        listed: farmerListings.some(l => l.cropId === crop.cropId)
      }));
      setCrops(mappedCrops);

      // Fetch farmer orders
      const ordersRes = await axios.get(`http://localhost:8080/api/orders/farmer/${user.id}`);
      const farmerOrders = ordersRes.data;
      setOrders(farmerOrders);

      // Filter only delivered orders for profit/revenue
      const deliveredOrders = farmerOrders.filter(o => o.status === 'DELIVERED');

      const totalProfit = deliveredOrders.reduce((acc, order) => acc + (order.farmerProfit || 0), 0);
      const totalRevenue = deliveredOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

      const farmerStats = {
        overview: [
          { label: 'Total Products', value: cropsRes.data?.length || 0, icon: Package, change: '+0%', trend: 'up' },
          { label: 'Active Listings', value: farmerListings.length, icon: Sprout, change: '+0%', trend: 'up' },
          { label: 'Monthly Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, change: '0%', trend: 'up' },
          { label: 'Total Profit', value: `₹${totalProfit.toFixed(2)}`, icon: TrendingUp, change: '0%', trend: 'up' }
        ],
        crops: mappedCrops.map(crop => ({
          name: crop.cropName,
          progress: 50,
          status: 'Active',
          date: new Date(crop.createdAt).toLocaleDateString(),
          batchId: crop.batchId,
          cropId: crop.cropId,
          quantity: crop.quantity,
          price: crop.price
        })),
        orders: farmerOrders
      };

      setStats(farmerStats);

    } catch (err) {
      console.error('Error fetching farmer data:', err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Fetch Buyer Data ------------------
  const fetchBuyerData = async () => {
    try {
      setLoading(true);
      const buyerStats = {
        overview: [
          { label: 'Total Orders', value: 0, icon: ShoppingCart, change: '0%', trend: 'up' },
          { label: 'Pending Orders', value: 0, icon: Clock, change: 'down', trend: 'down' },
          { label: 'Total Spent', value: '₹0.00', icon: IndianRupee, change: '0%', trend: 'up' },
          { label: 'Favorite Farmers', value: 0, icon: Users, change: '0', trend: 'up' }
        ],
        recentOrders: [],
        wishlist: []
      };
      setStats(buyerStats);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      user.role === 'FARMER' ? fetchFarmerData() : fetchBuyerData();
    }
  }, [user]);

  const handleCropAdded = (newCrop) => {
    if (!newCrop) return;
    setCrops(prev => [...prev, newCrop]);
    setShowAddCrop(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold">Please Sign In</h2>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen bg-gray-50">
      <main className="dashboard-main py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === 'FARMER' ? 'Manage your crops and track progress' : 'Browse and buy fresh produce'}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <AIAssistantButton userType="FARMER" />
              {user.role === "FARMER" && (
                <button
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors text-sm font-medium"
                  onClick={() => setShowBatchManager(true)}
                >
                  Manage Batches
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.overview.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-md border">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-green-600" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold mt-3">{stat.value}</h3>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Farmer Panel */}
          {user.role === 'FARMER' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Crops</h3>
                <button onClick={() => setShowAddCrop(true)} className="btn-primary">
                  Add Crop
                </button>
              </div>

              {crops.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No crops added yet.</p>
              ) : (
                crops.map(crop => (
                  <div key={crop.cropId} className="border rounded-lg p-4 mb-3 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{crop.cropName}</p>
                      <p className="text-sm text-gray-500">Batch: {crop.batchId}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium mb-2">
                        Qty: {crop.quantity} <br />
                        Price: ₹{crop.price}
                      </div>
                      <button
                        onClick={() => { setSelectedCropForListing({ ...crop, farmerId: user.id }); setShowListingModal(true); }}
                        className={`btn-primary text-sm ${crop.listed ? 'opacity-50 cursor-not-allowed bg-gray-300 border-gray-300' : ''}`}
                        disabled={crop.listed}
                      >
                        {crop.listed ? 'Listed' : 'List for Sale'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Modals */}
          {showAddCrop && (
            <AddCropModal onClose={() => setShowAddCrop(false)} farmerId={user.id} onCropAdded={handleCropAdded} />
          )}

          {showListingModal && selectedCropForListing && (
            <ListingModal
              crop={selectedCropForListing}
              onClose={() => { setShowListingModal(false); setSelectedCropForListing(null); }}
              onSuccess={(listing) => {
                setCrops(prev =>
                  prev.map(c =>
                    c.cropId === listing.cropId ? { ...c, listed: true } : c
                  )
                );
              }}
            />
          )}

          {showBatchManager && (
            <BatchManagement onClose={() => setShowBatchManager(false)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
