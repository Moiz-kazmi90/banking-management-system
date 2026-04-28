import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Wallet, ArrowUpRight, ArrowDownLeft,
  Plus, RefreshCw, CreditCard, TrendingUp, Trash2
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- NAYA: DELETE FUNCTION ---
  const handleDeleteAccount = async (accId, balance) => {
    if (balance > 0) {
      return toast.error(`Pehle ₨ ${balance.toLocaleString()} transfer karein. Balance zero hona chahiye!`);
    }

    if (!window.confirm("Kya aap waqai ye account band karna chahte hain?")) return;

    try {
      await api.delete(`/accounts/${accId}`);
      toast.success("Account successfully closed.");
      fetchAccounts(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Closing failed");
    }
  };

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get("/accounts");
      // Sirf wo accounts dikhayein jo CLOSED nahi hain
      const activeOnes = (data.accounts || []).filter(a => a.status !== "CLOSED");
      setAccounts(activeOnes);

      const balanceMap = {};
      await Promise.all(
        activeOnes.map(async (acc) => {
          try {
            const res = await api.get(`/accounts/balance/${acc._id}`);
            balanceMap[acc._id] = res.data.balance;
          } catch { balanceMap[acc._id] = 0; }
        })
      );
      setBalances(balanceMap);
    } catch (err) {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchAccounts(); };
  const totalBalance = Object.values(balances).reduce((a, b) => a + b, 0);

  // --- NAYA: LIMIT LOGIC ---
  const canCreateAccount = accounts.length < 1;

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header aur Refresh */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy-800">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-gray-500 mt-1 text-sm">Financial overview</p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-navy-800 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-2">Total Portfolio Balance</p>
            <p className="font-display text-5xl font-bold text-white mb-1">
              ₨ {totalBalance.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/transfer" className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold px-5 py-2.5 rounded-xl text-sm">
                <ArrowUpRight size={16} /> Send Money
              </Link>
              
              {/* Account Create Limit Check */}
              {canCreateAccount ? (
                <Link to="/account" className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white border border-navy-600 px-5 py-2.5 rounded-xl text-sm">
                  <Plus size={16} /> New Account
                </Link>
              ) : (
                <button onClick={() => toast.error("Maximum 1 account allowed per user")} className="opacity-50 cursor-not-allowed flex items-center gap-2 bg-navy-700 text-white border border-navy-600 px-5 py-2.5 rounded-xl text-sm">
                  <Plus size={16} /> Limit Reached
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-navy-800">Your Accounts</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map((acc) => (
              <div key={acc._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gold-400 hover:shadow-md transition-all group relative">
                
                {/* DELETE BUTTON - Top Right */}
                <button 
                  onClick={() => handleDeleteAccount(acc._id, balances[acc._id] || 0)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                  title="Close Account"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-start mb-4">
                  <div className="w-11 h-11 bg-navy-50 rounded-xl flex items-center justify-center group-hover:bg-gold-500">
                    <Wallet size={20} className="text-navy-700" />
                  </div>
                </div>

                <p className="text-gray-400 text-xs mb-1">PKR Account</p>
                <p className="font-display text-2xl font-bold text-navy-800 mb-1">
                  ₨ {(balances[acc._id] || 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-gray-400 text-[10px] font-mono truncate mt-2">ID: {acc._id}</p>
                
                <div className="flex gap-2 mt-4">
                  <Link to={`/transfer?from=${acc._id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-navy-800 text-white text-xs font-semibold py-2 rounded-lg">
                    <ArrowUpRight size={13} /> Send
                  </Link>
                  <Link to="/transactions" className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg">
                    <TrendingUp size={13} /> History
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}