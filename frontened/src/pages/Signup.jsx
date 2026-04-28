import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Landmark, UserPlus } from "lucide-react";

export default function Signup() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return toast.error("Please fill all fields");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      loginUser(data.user, data.token);
      toast.success(`Welcome to NovBank, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-800 mb-4">
            <Landmark size={28} className="text-gold-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-navy-800">Create Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Join NovBank — it's free!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Muhammad Ali"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ali@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
              <input
                type={showPass ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm transition-all"
              />
            </div>

            {/* Password strength hint */}
            {form.password && (
              <div className="flex gap-1.5 items-center">
                {[1,2,3].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                    form.password.length >= i * 4
                      ? i === 1 ? "bg-red-400" : i === 2 ? "bg-yellow-400" : "bg-green-400"
                      : "bg-gray-200"
                  }`} />
                ))}
                <span className="text-xs text-gray-400 ml-1">
                  {form.password.length < 4 ? "Weak" : form.password.length < 8 ? "Fair" : "Strong"}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] mt-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><UserPlus size={18} /> Create Account</>
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-gold-600 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}