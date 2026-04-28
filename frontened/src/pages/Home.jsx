import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield, Zap, Globe, ArrowRight,
  TrendingUp, Lock, Headphones, ChevronRight
} from "lucide-react";

const features = [
  { icon: Shield,      title: "Bank-Grade Security",   desc: "256-bit SSL encryption on every transaction. Your money is always safe." },
  { icon: Zap,         title: "Instant Transfers",     desc: "Send money to any account in seconds, 24/7 without delays." },
  { icon: Globe,       title: "Access Anywhere",       desc: "Manage your account from any device, anytime, anywhere." },
  { icon: TrendingUp,  title: "Real-time Balance",     desc: "Always know your balance with live account updates." },
  { icon: Lock,        title: "Fraud Protection",      desc: "Advanced monitoring to detect and prevent unauthorized activity." },
  { icon: Headphones,  title: "24/7 Support",          desc: "Our team is always ready to help you with any issue." },
];

const stats = [
  { value: "50K+",  label: "Active Users" },
  { value: "₨2B+",  label: "Transactions Processed" },
  { value: "99.9%", label: "Uptime Guaranteed" },
  { value: "24/7",  label: "Customer Support" },
];

export default function Home() {
  const { isUserLoggedIn, isAdminLoggedIn } = useAuth();

  return (
    <div className="font-body">

      {/* Hero */}
      <section className="relative bg-navy-800 overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #e6b800 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e3a5f 0%, transparent 50%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-navy-700 text-gold-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-navy-600">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Trusted Banking Since 2024
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Banking Made <br />
              <span className="text-gold-400">Simple &amp; Secure</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
              Experience next-generation banking with NovBank. Open your account today and enjoy instant transfers, real-time balance tracking, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              {isUserLoggedIn || isAdminLoggedIn ? (
                <Link
                  to={isAdminLoggedIn ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-105"
                >
                  Go to Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-105"
                  >
                    Open Free Account <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 border border-gray-500 text-white hover:bg-navy-700 px-7 py-3.5 rounded-xl transition-all"
                  >
                    Sign In <ChevronRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Card */}
          <div className="hidden lg:block">
            <div className="bg-navy-700 rounded-3xl p-8 border border-navy-600 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-gray-400 text-sm">Total Balance</p>
                  <p className="font-display text-4xl text-white font-bold mt-1">₨ 84,250<span className="text-gold-400">.00</span></p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center">
                  <TrendingUp size={26} className="text-navy-800" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Salary Credit",   amt: "+ ₨ 45,000", color: "text-green-400", date: "Today" },
                  { label: "Utility Bill",     amt: "- ₨ 3,200",  color: "text-red-400",   date: "Yesterday" },
                  { label: "Transfer to Ali",  amt: "- ₨ 10,000", color: "text-red-400",   date: "Apr 20" },
                  { label: "Freelance Income", amt: "+ ₨ 22,000", color: "text-green-400", date: "Apr 18" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center justify-between bg-navy-600 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{t.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{t.date}</p>
                    </div>
                    <span className={`font-semibold text-sm ${t.color}`}>{t.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-navy-800">{s.value}</p>
                <p className="text-navy-600 text-sm mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-navy-800 mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              NovBank gives you all the tools to manage your finances with confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-gold-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors">
                  <f.icon size={22} className="text-navy-700 group-hover:text-navy-800 transition-colors" />
                </div>
                <h3 className="font-semibold text-navy-800 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-5">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of Pakistanis who trust NovBank for their daily banking needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-4 rounded-xl transition-all"
            >
              Admin Portal <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}