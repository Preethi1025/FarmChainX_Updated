import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/common/LoadingSpinner";

const ProtectedUserRoute = () => {
  const { user, loading } = useAuth();

  // Show loader while auth state is resolving
  if (loading) {
    return <PageLoader />;
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
};

export default ProtectedUserRoute;
