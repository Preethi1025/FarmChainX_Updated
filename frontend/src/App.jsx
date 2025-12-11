import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// User Pages
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Marketplace from "./pages/Marketplace";
import Traceability from "./pages/Traceability";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";

import { PageLoader } from "./components/common/LoadingSpinner";
import DashboardWrapper from './pages/DashboardWrapper'; // role-based dashboard wrapper

// --------------------------------------------
// Protected Route for Normal Users
// --------------------------------------------
function ProtectedUserRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  return user ? children : <Navigate to="/login" />;
}

// --------------------------------------------
// Protected Route for Admin
// --------------------------------------------
function ProtectedAdminRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));
  return admin?.role === "ADMIN" ? children : <Navigate to="/admin/login" />;
}

// --------------------------------------------
// App Content Wrapper
// --------------------------------------------
function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                <DashboardWrapper />
              </ProtectedUserRoute>
            }
          />

          {/* Other Routes */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trace/:batchId"
            element={
              <ProtectedRoute>
                <Traceability />
              </ProtectedRoute>
            }
          />

          {/* Other pages */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/trace/:batchId" element={<Traceability />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// --------------------------------------------
// Main App Wrapper with Auth Provider
// --------------------------------------------
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
