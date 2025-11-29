import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
BarChart3, Package, TrendingUp, Users, Sprout, DollarSign, Clock, CheckCircle, Truck, ShoppingCart
} from 'lucide-react';
import AddCropModal from '../components/AddCropModal';


const Dashboard = () => {
const { user } = useAuth();
const navigate = useNavigate();
const [activeTab, setActiveTab] = useState('overview');
const [showAddCrop, setShowAddCrop] = useState(false);

const farmerStats = {
overview: [
{ label: 'Total Products', value: '1,247', icon: Package, change: '+12%', trend: 'up' },
{ label: 'Active Listings', value: '89', icon: Sprout, change: '+5%', trend: 'up' },
{ label: 'Monthly Revenue', value: '$12,847', icon: DollarSign, change: '+23%', trend: 'up' },
{ label: 'Customer Rating', value: '4.8/5.0', icon: Users, change: '+0.2', trend: 'up' }
],
crops: [
{ name: 'Organic Tomatoes', progress: 85, status: 'Harvesting', date: '2024-01-20' },
{ name: 'Bell Peppers', progress: 60, status: 'Growing', date: '2024-02-15' }
],
orders: [
{ id: 'ORD_001', product: 'Tomatoes', quantity: '50kg', status: 'delivered', date: '2024-01-18' }
]
};

const buyerStats = {
overview: [
{ label: 'Total Orders', value: '47', icon: ShoppingCart, change: '+8%', trend: 'up' },
{ label: 'Pending Orders', value: '3', icon: Clock, change: '-2', trend: 'down' },
{ label: 'Total Spent', value: '$2,847', icon: DollarSign, change: '+15%', trend: 'up' },
{ label: 'Favorite Farmers', value: '12', icon: Users, change: '+3', trend: 'up' }
],
recentOrders: [
{ id: 'ORD_001', product: 'Organic Tomatoes', farmer: 'Green Valley Farms', quantity: '5kg', total: '$14.95', status: 'delivered', date: '2024-01-18', tracking: 'BCH_2024_001' }
],
wishlist: [
{ name: 'Rainbow Carrots', farmer: 'Root Revolution', price: '$2.79/kg' }
]
};

const stats = user?.role === 'FARMER' ? farmerStats : buyerStats;

const getStatusColor = (status) => {
switch (status) {
case 'delivered': return 'text-green-600 bg-green-100';
case 'shipped': return 'text-blue-600 bg-blue-100';
case 'processing': return 'text-yellow-600 bg-yellow-100';
default: return 'text-gray-600 bg-gray-100';
}
};

const getStatusIcon = (status) => {
switch (status) {
case 'delivered': return CheckCircle;
case 'shipped': return Truck;
case 'processing': return Clock;
default: return Clock;
}
};

const handleViewTrace = (trackingId) => {
navigate(`/trace/${trackingId}`);
};

if (!user) {
return ( <div className="min-h-screen flex items-center justify-center bg-gray-50"> <div className="text-center"> <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2> <p className="text-gray-600 mb-8">You need to be signed in to view the dashboard</p>
<button onClick={() => navigate('/login')} className="btn-primary">Sign In</button> </div> </div>
);
}

return ( <div className="min-h-screen bg-gray-50 py-8"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8"> <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1> <p className="text-gray-600 mt-2">
{user?.role === 'FARMER' ? "Here's your farm overview." : "Track your orders and wishlist."} </p>
</motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.overview.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-xl">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-4 w-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        );
      })}
    </div>

    {user.role === 'FARMER' ? (
      <FarmerDashboard stats={stats} activeTab={activeTab} setActiveTab={setActiveTab} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} showAddCrop={showAddCrop} setShowAddCrop={setShowAddCrop} />
    ) : (
      <BuyerDashboard stats={stats} handleViewTrace={handleViewTrace} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
    )}

    {showAddCrop && <AddCropModal onClose={() => setShowAddCrop(false)} />}
  </div>
  </div>
);
};

const FarmerDashboard = ({ stats, activeTab, setActiveTab, getStatusColor, getStatusIcon, showAddCrop, setShowAddCrop }) => {
return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Crop Progress</h3>
        <div className="space-y-6">
          {stats.crops.map((crop) => (
            <div key={crop.name} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{crop.name}</span>
                  <span className="text-sm text-gray-500">{crop.status}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${crop.progress}%` }} className="bg-primary-600 h-2 rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Progress: {crop.progress}%</span>
                  <span>Est: {crop.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
        {stats.orders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div>
                <div className="font-medium text-gray-900">{order.product}</div>
                <div className="text-sm text-gray-500">{order.quantity}</div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{order.date}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <button onClick={() => setShowAddCrop(true)} className="w-full btn-primary text-sm py-2 mb-2">Add New Crop</button>
        <button className="w-full btn-secondary text-sm py-2 mb-2">Create Listing</button>
        <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-2 text-sm font-medium transition-colors">View Analytics</button>
      </div>
    </div>
  </div>
);
};

const BuyerDashboard = ({ stats, handleViewTrace, getStatusColor, getStatusIcon }) => {
return ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div className="lg:col-span-2"> <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"> <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
{stats.recentOrders.map((order) => {
const StatusIcon = getStatusIcon(order.status);
return ( <div key={order.id} className="bg-gray-50 rounded-xl p-4 mb-4"> <div className="flex items-center justify-between mb-3"> <div> <h4 className="font-semibold text-gray-900">{order.product}</h4> <p className="text-sm text-gray-600">by {order.farmer}</p> </div>
<div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}> <StatusIcon className="h-4 w-4" /> <span className="capitalize">{order.status}</span> </div> </div> <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4"> <div><div className="text-gray-500">Quantity</div><div className="font-medium">{order.quantity}</div></div> <div><div className="text-gray-500">Total</div><div className="font-medium">{order.total}</div></div> <div><div className="text-gray-500">Order Date</div><div className="font-medium">{order.date}</div></div> <div><div className="text-gray-500">Tracking ID</div><div className="font-medium text-primary-600">{order.tracking}</div></div> </div> <div className="flex space-x-3">
<button onClick={() => handleViewTrace(order.tracking)} className="btn-primary text-sm flex-1">View Trace</button> <button className="btn-secondary text-sm flex-1">Contact Farmer</button> </div> </div>
);
})} </div> </div>


  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist</h3>
      {stats.wishlist.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2">
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-600">{item.farmer}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary-600">{item.price}</div>
            <button className="text-xs text-gray-500 hover:text-primary-600">Add to Cart</button>
          </div>
        </div>
      ))}
      <button className="w-full btn-secondary mt-2 text-sm">View Full Wishlist</button>
    </div>
  </div>
</div>


);
};

export default Dashboard;
