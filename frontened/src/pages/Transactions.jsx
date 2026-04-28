import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export default function Transactions() {
  const [accounts, setAccounts]         = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: accData } = await api.get("/accounts");
        // Sirf ACTIVE accounts ko filter buttons ke liye rakhein
        const activeAccounts = (accData.accounts || []).filter(acc => acc.status !== "CLOSED");
        setAccounts(activeAccounts);

        const allTxMap = new Map(); // Duplicate transactions hatane ke liye Map use kiya

        // Sabhi accounts (chahe closed hon ya active) ki history fetch karein 
        // taake purani history nazar aaye
        await Promise.all(
          (accData.accounts || []).map(async (acc) => {
            try {
              const res = await api.get(`/transactions/${acc._id}`);
              const txList = res.data.transactions || res.data || [];
              
              txList.forEach(tx => {
                // Agar transaction pehle se Map mein nahi hai, toh add karein
                if (!allTxMap.has(tx._id)) {
                  allTxMap.set(tx._id, { ...tx, _viewedFrom: acc._id });
                }
              });
            } catch (err) {
              console.error("Error fetching tx for:", acc._id);
            }
          })
        );

        // Map ko array mein convert karke sort karein
        const sortedTx = Array.from(allTxMap.values()).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setTransactions(sortedTx);
      } catch {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filtered = selectedAccount === "all"
    ? transactions
    : transactions.filter(tx =>
        tx.fromAccount === selectedAccount || tx.toAccount === selectedAccount
      );

  const statusConfig = {
    COMPLETED: { icon: CheckCircle2, color: "text-green-600",  bg: "bg-green-100", label: "Completed" },
    PENDING:   { icon: Clock,        color: "text-amber-600",  bg: "bg-amber-100", label: "Pending" },
    FAILED:    { icon: XCircle,      color: "text-red-600",    bg: "bg-red-100",   label: "Failed" },
    REVERSED:  { icon: RotateCcw,    color: "text-gray-600",   bg: "bg-gray-100",  label: "Reversed" },
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy-800">Transaction History</h1>
          <p className="text-gray-500 mt-1 text-sm">Review your past financial activity</p>
        </div>

        {/*  Filter Buttons (Sirf Active accounts ke buttons dikhayega) */}
        {accounts.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedAccount("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedAccount === "all"
                  ? "bg-navy-800 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
            >
              All History
            </button>
            {accounts.map((acc, i) => (
              <button
                key={acc._id}
                onClick={() => setSelectedAccount(acc._id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedAccount === acc._id
                    ? "bg-navy-800 text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"
                }`}
              >
                {/* Agar account ek hi hai toh "Main Account" likh dein warna Account index */}
                {accounts.length === 1 ? "My Account" : `Account ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Transactions List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Clock size={32} />
            </div>
            <h3 className="font-bold text-navy-800 text-lg">No Records Found</h3>
            <p className="text-gray-400 text-sm mt-1">Jab aap koi transaction karenge, wo yahan show hogi.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {filtered.map((tx, idx) => {
              // Ledger logic to check if current user is the sender
              const isDebit = accounts.some(a => a._id === tx.fromAccount);
              const status = statusConfig[tx.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <div key={tx._id}
                  className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-all ${
                    idx !== filtered.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      isDebit ? "bg-red-50" : "bg-green-50"
                    }`}>
                      {isDebit
                        ? <ArrowUpRight size={22} className="text-red-600" />
                        : <ArrowDownLeft size={22} className="text-green-600" />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-navy-800">
                        {isDebit ? "Money Sent" : "Money Received"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase mt-0.5">
                        {isDebit ? `To: ${tx.toAccount?.slice(-12)}` : `From: ${tx.fromAccount?.slice(-12)}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] text-gray-400 font-bold uppercase">
                           {new Date(tx.createdAt).toLocaleDateString("en-PK")}
                         </span>
                         <span className="w-1 h-1 bg-gray-200 rounded-full" />
                         <span className="text-[10px] text-gray-400 font-bold">
                           {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-display text-xl font-black ${
                      isDebit ? "text-red-600" : "text-green-600"
                    }`}>
                      {isDebit ? "−" : "+"} ₨ {tx.amount?.toLocaleString("en-PK")}
                    </p>
                    <div className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full mt-1.5 ${status.bg} ${status.color}`}>
                      <StatusIcon size={10} />
                      {status.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}