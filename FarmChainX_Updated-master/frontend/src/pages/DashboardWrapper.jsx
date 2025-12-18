import React from 'react';
import { Navigate } from 'react-router-dom';

import DistributorDashboard from '../components/Distributor/DistributorDashboard';
import FarmerDashboard from '../components/farmer/FarmerDashboard';
import Dashboard from './Dashboard';
import BuyerDashboard from '../components/Buyer/BuyerDashboard'; // Uncomment when ready

const DashboardWrapper = () => {
  const role = localStorage.getItem("userRole"); // persist role after login

  if (role === "DISTRIBUTOR") return <DistributorDashboard />;
  if (role === "FARMER") return <Dashboard />;
  if (role === "BUYER") return <BuyerDashboard />;

  return <Navigate to="/login" />; // fallback if role missing
};

export default DashboardWrapper;
