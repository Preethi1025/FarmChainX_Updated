import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/common/LoadingSpinner";

const ProtectedUserRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show loader while auth state is resolving
  if (loading) {
    return <PageLoader />;
  }

  // Check for admin in localStorage first (for admin-specific routes)
  const adminFromStorage = localStorage.getItem("admin");
  
  // If route requires ADMIN role
  if (allowedRoles && allowedRoles.includes('ADMIN')) {
    console.log('🔒 Checking admin access...');
    console.log('👑 Admin from localStorage:', adminFromStorage);
    console.log('👤 User from context:', user);
    
    // Check if admin is logged in via localStorage
    if (adminFromStorage) {
      console.log('✅ Admin authenticated via localStorage');
      return <Outlet />; // Admin is logged in, allow access
    }
    
    // Check if user from context is admin
    if (user && user.role === 'ADMIN') {
      console.log('✅ Admin authenticated via context');
      return <Outlet />; // User is admin, allow access
    }
    
    // Not admin, redirect to admin login
    console.log('❌ Not authorized as admin, redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }

  // For non-admin protected routes (regular users)
  if (!user) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role for non-admin routes
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      console.log(`❌ User role ${user.role} not in allowed roles:`, allowedRoles);
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Logged in with correct role → allow access
  console.log('✅ Access granted for role:', user.role);
  return <Outlet />;
};

export default ProtectedUserRoute;