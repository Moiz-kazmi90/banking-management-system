import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ShieldCheck, Users, Send, RefreshCw,
  Landmark, History, CheckCircle2, Clock,
  XCircle, ArrowUpRight,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [accounts,     setAccounts]    = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [activeTab,    setActiveTab]   = useState("accounts");
  const [depositForm,  setDepositForm] = useState({ toAccount: "", amount: "" });
  const [depositing,   setDepositing]  = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [accRes, transRes] = await Promise.all([
        api.get("/accounts/all"),
        api.get("/transactions/all"),
      ]);

      setAccounts(accRes.data.accounts || []);
      setTransactions(transRes.data.transactions || []);

    } catch (err) {
      console.error("Admin fetch error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Page load pe token axios mein set karo
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchData();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositForm.toAccount)
      return toast.error("Please select a target account");
    if (!depositForm.amount || Number(depositForm.amount) <= 0)
      return toast.error("Enter a valid amount");

    try {
      setDepositing(true);
      await api.post("/transactions/system/initial-funds", {
        toAccount:      depositForm.toAccount,
        amount:         Number(depositForm.amount),
        idempotencyKey: uuidv4(),
      });
      toast.success(`₨ ${Number(depositForm.amount).toLocaleString()} deposited!`);
      setDepositForm({ toAccount: "", amount: "" });
      fetchData();
    } catch (err) {
      console.error("Deposit error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Deposit failed");
    } finally {
      setDepositing(false);
    }
  };

  const statusConfig = {
    COMPLETED: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    PENDING:   { icon: Clock,        color: "text-amber-600", bg: "bg-amber-100" },
    FAILED:    { icon: XCircle,      color: "text-red-600",   bg: "bg-red-100"   },
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-gold-500" />
              <span className="text-xs font-semibold text-gold-600 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-navy-800">Command Center</h1>
            <p className="text-gray-500 text-sm mt-1">
              Logged in as{" "}
              <span className="font-semibold text-navy-700">{admin?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab("accounts")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "accounts"
                    ? "bg-navy-800 text-white shadow"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <Users size={14} /> Accounts
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "history"
                    ? "bg-navy-800 text-white shadow"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <History size={14} /> Transactions
              </button>
            </div>
            <button
              onClick={fetchData}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Accounts",     value: accounts.length },
            { label: "Active Accounts",    value: accounts.filter(a => a.status === "ACTIVE").length },
            { label: "Total Transactions", value: transactions.length },
            { label: "Completed",          value: transactions.filter(t => t.status === "COMPLETED").length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-gray-400 text-xs mb-2">{s.label}</p>
              <p className="font-display text-3xl font-bold text-navy-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Deposit Form */}
          <div className="lg:col-span-1">
            <div className="bg-navy-800 rounded-3xl p-7 text-white border border-navy-700">
              <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
                <Landmark className="text-gold-400" size={20} /> Inject Funds
              </h2>
              <form onSubmit={handleDeposit} className="space-y-4">

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase block mb-2">
                    Target Account
                  </label>
                  <select
                    value={depositForm.toAccount}
                    onChange={(e) => setDepositForm({ ...depositForm, toAccount: e.target.value })}
                    className="w-full bg-navy-700 border border-navy-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="">-- Select Account --</option>
                    {accounts
                      .filter(a => a.status === "ACTIVE")
                      .map(acc => (
                        <option key={acc._id} value={acc._id}>
                          {acc.user?.name || "Unknown"} — ...{acc._id.slice(-8)}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase block mb-2">
                    Amount (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                      ₨
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="0.00"
                      value={depositForm.amount}
                      onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                      className="w-full bg-navy-700 border border-navy-600 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-gold-500 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-3 gap-2">
                  {[10000, 50000, 100000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositForm({ ...depositForm, amount: String(amt) })}
                      className="text-xs py-2 bg-navy-700 hover:bg-navy-600 border border-navy-600 rounded-lg text-gray-300 transition-all"
                    >
                      {amt >= 1000 ? `${amt / 1000}K` : amt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={depositing}
                  className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-navy-800 font-bold py-3.5 rounded-xl transition-all active:scale-95"
                >
                  {depositing ? (
                    <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send size={15} /> Authorize Deposit</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Accounts Tab */}
            {activeTab === "accounts" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-navy-800 flex items-center gap-2">
                    <Users size={16} /> All Accounts ({accounts.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {accounts.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">No accounts found</p>
                  ) : (
                    accounts.map((acc) => (
                      <div
                        key={acc._id}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all"
                      >
                        <div>
                          <p className="font-semibold text-sm text-navy-800">
                            {acc.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-400">{acc.user?.email}</p>
                          <p className="text-xs font-mono text-gray-300 mt-0.5">{acc._id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            acc.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                            acc.status === "FROZEN" ? "bg-blue-100 text-blue-700"  :
                            "bg-red-100 text-red-700"
                          }`}>
                            {acc.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(acc.createdAt).toLocaleDateString("en-PK")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "history" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-navy-800 flex items-center gap-2">
                    <History size={16} /> All Transactions ({transactions.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {transactions.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">
                      No transactions found
                    </p>
                  ) : (
                    transactions.map((tx) => {
                      const s = statusConfig[tx.status] || statusConfig.PENDING;
                      const StatusIcon = s.icon;
                      return (
                        <div
                          key={tx._id}
                          className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                              <ArrowUpRight size={16} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy-800">
                                {tx.fromAccount?.user?.name || "System"}{" "}
                                →{" "}
                                {tx.toAccount?.user?.name || "Unknown"}
                              </p>
                              <p className="text-xs font-mono text-gray-400 mt-0.5">
                                {tx._id.slice(-12)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(tx.createdAt).toLocaleString("en-PK")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-navy-800">
                              ₨ {tx.amount?.toLocaleString("en-PK")}
                            </p>
                            <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${s.bg} ${s.color}`}>
                              <StatusIcon size={10} /> {tx.status}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}