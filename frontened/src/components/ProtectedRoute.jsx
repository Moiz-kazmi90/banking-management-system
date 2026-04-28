import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedUserRoute({ children }) {
  const { user, loading } = useAuth();

  // Jab tak app check kar rahi hai ke user login hai ya nahi, spinner dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
}