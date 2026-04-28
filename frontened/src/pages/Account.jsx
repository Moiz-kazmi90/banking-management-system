import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Plus, Wallet, Copy, RefreshCw, CheckCircle, Trash2, AlertCircle } from "lucide-react";

export default function Account() {
  const [accounts, setAccounts]     = useState([]);
  const [balances, setBalances]     = useState({});
  const [loading, setLoading]       = useState(true);
  const [creating, setCreating]     = useState(false);
  const [copied, setCopied]         = useState(null);

  // 1. Fetch Accounts with Status Filter
  const fetchAccounts = async () => {
    try {
      const { data } = await api.get("/accounts");
      // Sirf wo accounts dikhao jo CLOSED nahi hain
      const activeAccounts = (data.accounts || []).filter(acc => acc.status !== "CLOSED");
      setAccounts(activeAccounts);

      const balanceMap = {};
      await Promise.all(
        activeAccounts.map(async (acc) => {
          try {
            const res = await api.get(`/accounts/balance/${acc._id}`);
            balanceMap[acc._id] = res.data.balance;
          } catch {
            balanceMap[acc._id] = 0;
          }
        })
      );
      setBalances(balanceMap);
    } catch {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  // 2. Create Account with Limit Check
  const handleCreateAccount = async () => {
    if (accounts.length >= 1) {
      return toast.error("Bhai, aap sirf 1 active account rakh sakte hain.");
    }

    try {
      setCreating(true);
      await api.post("/accounts");
      toast.success("Account created successfully!");
      fetchAccounts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setCreating(false);
    }
  };

  // 3. Delete (Close) Account Logic
  const handleCloseAccount = async (id, balance) => {
    if (balance > 0) {
      return toast.error("Account band karne ke liye balance 0 hona chahiye.");
    }

    if (!window.confirm("Are you sure you want to close this account?")) return;

    try {
      await api.delete(`/accounts/${id}`);
      toast.success("Account closed!");
      fetchAccounts(); // Refresh list to hide closed account
    } catch (err) {
      toast.error(err.response?.data?.message || "Close failed");
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    toast.success("ID Copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">My Accounts</h1>
            <p className="text-gray-500 text-sm">Manage your active banking profiles</p>
          </div>
          {accounts.length < 1 && (
            <button
              onClick={handleCreateAccount}
              disabled={creating}
              className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              {creating ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
              Create Account
            </button>
          )}
        </div>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-navy-800">No Active Accounts Found</h3>
            <p className="text-gray-400 text-sm mt-2 mb-8">Open an account to start your journey with NovBank.</p>
            <button onClick={handleCreateAccount} className="bg-navy-800 text-white px-8 py-3 rounded-xl font-bold">
              Open Account Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {accounts.map((acc, idx) => (
              <div key={acc._id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  
                  {/* Info Column */}
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Wallet size={30} className="text-gold-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-navy-800">Standard Account</h4>
                        <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-md uppercase">
                          {acc.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-xs font-mono text-gray-500">{acc._id}</span>
                        <button onClick={() => copyToClipboard(acc._id)} className="text-gray-400 hover:text-navy-800">
                          {copied === acc._id ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Balance & Actions Column */}
                  <div className="text-left md:text-right border-t md:border-t-0 pt-6 md:pt-0 border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Available Balance</p>
                    <h2 className="text-4xl font-bold text-navy-800">
                      ₨ {(balances[acc._id] || 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                    </h2>
                    
                    <div className="flex items-center md:justify-end gap-5 mt-4">
                      <button 
                        onClick={() => handleCloseAccount(acc._id, balances[acc._id] || 0)}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} /> Close Account
                      </button>
                      <button 
                        onClick={fetchAccounts}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-navy-800 transition-colors"
                      >
                        <RefreshCw size={15} /> Sync Balance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Warning */}
        {accounts.length >= 1 && (
          <div className="mt-10 bg-navy-800 rounded-2xl p-6 text-white flex items-start gap-4">
            <div className="bg-navy-700 p-3 rounded-xl">
              <AlertCircle size={24} className="text-gold-400" />
            </div>
            <div>
              <h5 className="font-bold text-gold-400">Account Policy</h5>
              <p className="text-xs text-navy-200 leading-relaxed mt-1">
                Aap ke liye ek hi active account kafi hai. Naya account bananay ke liye pehle mojooda account ko "Close" karna hoga. Yaad rahay ke band karnay se pehle balance zero hona lazmi hai.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}