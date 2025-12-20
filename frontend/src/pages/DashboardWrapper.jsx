import React from 'react';
import { Navigate } from 'react-router-dom';

import DistributorDashboard from '../components/Distributor/DistributorDashboard';
import Dashboard from './Dashboard';

 //import ConsumerDashboard from '../components/consumer/ConsumerDashboard'; 

const DashboardWrapper = () => {
  const role = localStorage.getItem("userRole"); // persist role after login

  if (role === "DISTRIBUTOR") return <DistributorDashboard />;
  if (role === "FARMER") return <Dashboard />;
  // if (role === "CONSUMER") return <ConsumerDashboard />;

  return <Navigate to="/login" />; // fallback if role missing
};

export default DashboardWrapper;
