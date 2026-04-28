import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Landmark, LogIn } from "lucide-react";

export default function Login() {
  const { loginUser, loginAdmin } = useAuth();
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
 
      // DEBUG — yeh add karo
      console.log("Login response:", data);
      console.log("User:", data.user);
      console.log("Token:", data.token);

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      if (data.user?.systemUser) {
        loginAdmin(data.user, data.token);
        toast.success(`Welcome Admin, ${data.user.name}!`);
        navigate("/admin/dashboard", { replace: true });
      } else {
        loginUser(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
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
          <h1 className="font-display text-3xl font-bold text-navy-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your NovBank account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="off"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="off"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent text-sm transition-all pr-12"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-100"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><LogIn size={18} /> Sign In</>
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold-600 font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Admin?{" "}
          <Link to="/admin/login" className="text-navy-600 hover:underline font-medium">
            Go to Admin Portal
          </Link>
        </p>
      </div>
    </div>
  );
}