import { Routes, Route } from "react-router-dom";
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import { ProtectedUserRoute, ProtectedAdminRoute } from "./components/ProtectedRoute";

import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import AdminLogin     from "./pages/AdminLogin";
import Dashboard      from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Account        from "./pages/Account";
import Transactions   from "./pages/Transactions";
import Transfer       from "./pages/Transfer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <Routes>
          {/* Public */}
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected — User */}
          <Route path="/dashboard"    element={<ProtectedUserRoute><Dashboard /></ProtectedUserRoute>} />
          <Route path="/account"      element={<ProtectedUserRoute><Account /></ProtectedUserRoute>} />
          <Route path="/transactions" element={<ProtectedUserRoute><Transactions /></ProtectedUserRoute>} />
          <Route path="/transfer"     element={<ProtectedUserRoute><Transfer /></ProtectedUserRoute>} />

          {/* Protected — Admin */}
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}