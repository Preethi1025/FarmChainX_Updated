import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

// Auth Provider
import { AuthProvider, useAuth } from "./context/AuthContext";

// Common Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { PageLoader } from "./components/common/LoadingSpinner";

// User Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Public Pages
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Traceability from "./pages/Traceability";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SystemReports from "./pages/admin/SystemReports";

// User Dashboard Router
import DashboardWrapper from "./pages/DashboardWrapper";

// ---------------- PROTECTED USER ROUTE ----------------
function ProtectedUserRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  return user ? children : <Navigate to="/login" />;
}

// ---------------- PROTECTED ADMIN ROUTE ----------------
function ProtectedAdminRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));
  return admin?.role === "ADMIN" ? children : <Navigate to="/admin/login" />;
}

// ---------------- MAIN CONTENT ----------------
function AppContent() {
  const location = useLocation();

  // Detect admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      
      {/* Header ONLY for non-admin pages */}
      {!isAdminRoute && <Header />}

      <main>
        <Routes>

          {/* -------- PUBLIC ROUTES -------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* -------- USER DASHBOARD -------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                <DashboardWrapper />
              </ProtectedUserRoute>
            }
          />

          {/* -------- PROTECTED USER ROUTES -------- */}
          <Route
            path="/marketplace"
            element={
              <ProtectedUserRoute>
                <Marketplace />
              </ProtectedUserRoute>
            }
          />

          <Route path="/trace/:batchId" element={<Traceability />} />

          {/* -------- ADMIN ROUTES -------- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedAdminRoute>
                <SystemReports />
              </ProtectedAdminRoute>
            }
          />

          {/* -------- FALLBACK -------- */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

      {/* Footer ONLY for non-admin pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

// ---------------- MAIN APP ----------------
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
