import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from './context/AuthContext';

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Marketplace from "./pages/Marketplace";
import Traceability from "./pages/Traceability";

import { PageLoader } from "./components/common/LoadingSpinner";
import DashboardWrapper from './pages/DashboardWrapper'; // role-based dashboard wrapper

// --------------------------------------------
// Protected Route Wrapper
// --------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  return user ? children : <Navigate to="/login" />;
};

// --------------------------------------------
// Main App Content
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

          {/* Role-based Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
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

          {/* Redirect All Unknown Paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// --------------------------------------------
// App Wrapper With AuthProvider
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
