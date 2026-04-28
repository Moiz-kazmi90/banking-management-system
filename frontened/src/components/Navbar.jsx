import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu, X, LogOut, User, LayoutDashboard,
  ChevronDown, Landmark
} from "lucide-react";

export default function Navbar() {
  const { user, admin, isUserLoggedIn, isAdminLoggedIn, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
    setDropOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAdminLoggedIn
    ? [{ to: "/admin/dashboard", label: "Dashboard" }]
    : isUserLoggedIn
    ? [
        { to: "/dashboard",         label: "Dashboard" },
        { to: "/account",           label: "My Account" },
        { to: "/transactions",      label: "Transactions" },
        { to: "/transfer",          label: "Transfer" },
      ]
    : [
        { to: "/",       label: "Home" },
        { to: "/login",  label: "Login" },
        { to: "/signup", label: "Sign Up" },
      ];

  const currentName = isAdminLoggedIn
    ? admin?.name || "Admin"
    : user?.name || user?.username || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
              <Landmark size={20} className="text-navy-800" />
            </div>
            <span className="font-display text-xl font-semibold tracking-wide">
              Nov<span className="text-gold-400">Bank</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-gold-500 text-navy-800"
                    : "text-gray-300 hover:text-white hover:bg-navy-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Logged-in user dropdown */}
            {(isUserLoggedIn || isAdminLoggedIn) && (
              <div className="relative ml-4">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-navy-600 hover:bg-navy-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center">
                    <User size={14} className="text-navy-800" />
                  </div>
                  <span className="font-medium">{currentName}</span>
                  {isAdminLoggedIn && (
                    <span className="text-xs bg-gold-500 text-navy-800 px-2 py-0.5 rounded-full font-semibold">
                      Admin
                    </span>
                  )}
                  <ChevronDown size={14} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Logged in as</p>
                      <p className="text-sm font-semibold text-navy-700 truncate">{currentName}</p>
                    </div>
                    <Link
                      to={isAdminLoggedIn ? "/admin/dashboard" : "/dashboard"}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Not logged in — CTA */}
            {!isUserLoggedIn && !isAdminLoggedIn && (
              <Link
                to="/signup"
                className="ml-4 px-5 py-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold text-sm rounded-lg transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-700 border-t border-navy-600 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-gold-500 text-navy-800"
                  : "text-gray-300 hover:text-white hover:bg-navy-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {(isUserLoggedIn || isAdminLoggedIn) && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 mt-2 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-navy-600"
            >
              <LogOut size={15} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}