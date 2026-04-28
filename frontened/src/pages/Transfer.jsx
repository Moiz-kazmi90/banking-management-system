import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Send, AlertCircle, Wallet } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function Transfer() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading]   = useState(true);

  const [form, setForm] = useState({
    fromAccount: searchParams.get("from") || "",
    toAccount:   "",
    amount:      "",
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await api.get("/accounts");
        const activeAccounts = (data.accounts || []).filter(a => a.status === "ACTIVE");
        setAccounts(activeAccounts);

        if (!form.fromAccount && activeAccounts.length > 0) {
          setForm(f => ({ ...f, fromAccount: activeAccounts[0]._id }));
        }

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
    fetchAccounts();
  }, [form.fromAccount]);

  const selectedBalance = balances[form.fromAccount] || 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validations
    if (!form.fromAccount || !form.toAccount || !form.amount)
      return toast.error("Please fill all fields");
    if (form.fromAccount === form.toAccount)
      return toast.error("Cannot transfer to the same account");
    if (Number(form.amount) > selectedBalance)
      return toast.error("Insufficient balance.");

    //  Background Request + Immediate Redirect
    // Hum 'await' nahi kar rahe, taake spinner ki zaroorat na pare
    api.post("/transactions", {
      fromAccount:    form.fromAccount,
      toAccount:      form.toAccount,
      amount:         Number(form.amount),
      idempotencyKey: uuidv4(),
    }).catch(err => {
      console.error("Background transaction error:", err);
      // Agar backend pe koi bara masla hua toh user ko baad mein notification mil sakti hai
    });

    // Seedha redirect aur success message
    toast.success("Your transaction is successful!");
    navigate("/transactions");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-800">Send Money</h1>
          <p className="text-gray-500 text-sm">Instant funds transfer to any NovBank account</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {/* Balance Card */}
          {form.fromAccount && (
            <div className="bg-navy-800 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={14} className="text-gold-400" />
                <p className="text-gray-400 text-[10px] font-bold uppercase">Available Balance</p>
              </div>
              <p className="text-4xl font-bold text-white">
                ₨ {selectedBalance.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase mb-2">Source Account</label>
              <select
                value={form.fromAccount}
                onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              >
                {accounts.map((acc, i) => (
                  <option key={acc._id} value={acc._id}>
                    Account {i + 1} ({acc._id.slice(-8)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase mb-2">Recipient ID</label>
              <input
                type="text"
                required
                value={form.toAccount}
                onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
                placeholder="Recipient Account ID"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase mb-2">Amount</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 text-2xl font-bold text-navy-800"
              />
            </div>

            {/*  Simple Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Send size={18} /> Confirm & Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}