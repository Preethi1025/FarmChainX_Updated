import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import DistributorDashboard from "../components/Distributor/DistributorDashboard";

import ConsumerDashboard from "./ConsumerDashboard";

const DashboardWrapper = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "FARMER":
      return <Dashboard />;

    case "DISTRIBUTOR":
      return <DistributorDashboard />;

    case "BUYER":
      return <ConsumerDashboard />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardWrapper;
