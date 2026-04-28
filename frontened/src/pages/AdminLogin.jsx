import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, LogIn } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please fill all fields");

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });

      // Admin check
      if (!data.user?.systemUser) {
        toast.error("Unauthorized: This portal is for Admins only.");
        return;
      }

      // Token foran axios mein set karo
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Context mein save karo
      loginAdmin(data.user, data.token);

      toast.success(`Welcome Admin, ${data.user.name}!`);
      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-700 border border-navy-600 mb-4 shadow-2xl">
            <ShieldCheck size={32} className="text-gold-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">
            Authorized Access Only
          </p>
        </div>

        <div className="bg-navy-800 rounded-3xl border border-navy-600 p-8 shadow-2xl">

          <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-700/40 text-yellow-400 text-xs px-4 py-3 rounded-xl mb-6">
            <ShieldCheck size={14} />
            Secure Admin Login — All activity is logged
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@novbank.pk"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-navy-600 bg-navy-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-navy-600 bg-navy-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-navy-900 font-bold py-4 rounded-xl transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Sign In to Panel</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
              ← Back to User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}