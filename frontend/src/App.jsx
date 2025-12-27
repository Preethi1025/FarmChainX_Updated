import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MyOrders from "./pages/MyOrders";
import HelpCenter from "./components/common/HelpCenter";  // Note: "Center" not "Centre"
import PrivacyPolicy from "./components/common/PrivacyPolicy";
import TermsConditions from "./components/common/TermsConditions";
// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route (OUTLET BASED)
import ProtectedUserRoute from "./routes/ProtectedUserRoute";

// Common Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { PageLoader } from "./components/common/LoadingSpinner";

// Auth Pages
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
import AdminSupportDashboard from "./pages/admin/AdminSupportDashboard";
import SystemReports from "./pages/admin/SystemReports"; 
import SupportPage from "./pages/SupportPage";
// Add import
import UserTickets from "./pages/UserTickets";





// Dashboards
import DashboardWrapper from "./pages/DashboardWrapper";

/* ---------------- APP CONTENT ---------------- */

function AppContent() {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />

      <main>
        <Routes>
          {/* -------- PUBLIC -------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* -------- PROTECTED USER ROUTES -------- */}
          <Route element={<ProtectedUserRoute />}>
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/trace" element={<Traceability />} />
            <Route path="/trace/:batchId" element={<Traceability />} />
          </Route>
 
          {/* -------- SUPPORT PAGE -------- */}
          <Route element={<ProtectedUserRoute allowedRoles={['FARMER', 'DISTRIBUTOR', 'BUYER']} />}>
            <Route path="/support" element={<SupportPage />} />
          </Route>

          {/* -------- ADMIN PUBLIC ROUTES -------- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* -------- ADMIN PROTECTED ROUTES -------- */}
          <Route element={<ProtectedUserRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/support" element={<AdminSupportDashboard />} />
            <Route path="/admin/reports" element={<SystemReports />} />
          </Route>
          // Add this route in your Routes section (with other protected routes)
          <Route element={<ProtectedUserRoute allowedRoles={['FARMER', 'DISTRIBUTOR', 'BUYER']} />}>
            <Route path="/my-tickets" element={<UserTickets />} />
          </Route>
         <Route path="/helpcenter" element={<HelpCenter />} />
<Route path="/privacypolicy" element={<PrivacyPolicy />} />
<Route path="/termsconditions" element={<TermsConditions />} />

          {/* -------- FALLBACK -------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}