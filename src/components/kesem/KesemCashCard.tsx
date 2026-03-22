import { useState } from "react";
import { toast } from "sonner";
import { useDemoPortfolio } from "@/context/DemoPortfolioContext";

export function KesemCashCard() {
  const {
    cashAccount,
    activity,
    savingsGoals,
    sendCash,
    receiveCash,
    transferToSavingsGoal,
  } = useDemoPortfolio();
  const [flipped, setFlipped] = useState(false);

  const spendTxs = activity.filter((t) =>
    ["spend", "salary", "transfer", "savings"].includes(t.category)
  );

  const firstActiveGoal = savingsGoals.find((goal) => goal.current < goal.target) ?? savingsGoals[0];

  function handleSend() {
    const result = sendCash({ amount: 150, counterparty: "Maya" });
    result.success ? toast.success(result.message) : toast.error(result.message);
  }

  function handleReceive() {
    const result = receiveCash({ amount: 300, counterparty: "Noam" });
    result.success ? toast.success(result.message) : toast.error(result.message);
  }

  function handleTransfer() {
    if (!firstActiveGoal) {
      toast.error("Add a savings goal to transfer money into one.");
      return;
    }

    const result = transferToSavingsGoal({
      goalId: firstActiveGoal.id,
      amount: 250,
    });

    result.success ? toast.success(result.message) : toast.error(result.message);
  }

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-3xl overflow-hidden cursor-pointer select-none"
        style={{ height: 192, perspective: 1000 }}
        onClick={() => setFlipped((v) => !v)}
      >
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-between"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-mid)) 100%)`,
              backfaceVisibility: "hidden",
            }}
          >
import { useDemoAccount } from "@/context/DemoAccountContext";

export function KesemCashCard() {
  const { account } = useDemoAccount();
  const { cashAccount, ledger } = account;
  const [flipped, setFlipped] = useState(false);

  const spendTxs = ledger.filter((t) => ["spend", "salary", "savings", "managed", "trade"].includes(t.category)).slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="relative rounded-3xl overflow-hidden cursor-pointer select-none" style={{ height: 192, perspective: 1000 }} onClick={() => setFlipped((v) => !v)}>
        <div className="absolute inset-0 transition-all duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-between" style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-mid)) 100%)`, backfaceVisibility: "hidden" }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-4 w-40 h-40 rounded-full bg-white/[0.03]" />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Kesem Cash</p>
                <p className="text-white font-display text-2xl mt-0.5">
                  ₪{cashAccount.balance.toLocaleString("en-IL", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-white font-display text-2xl mt-0.5">₪{cashAccount.balance.toLocaleString("en-IL", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px] uppercase tracking-wide">Interest</p>
                <p className="text-primary-pale font-bold text-base">{cashAccount.interestRate}% p.a.</p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-white/40 text-xs tracking-[0.2em] mb-1">{cashAccount.accountNumber}</p>
              <div className="flex justify-between items-end">
                <p className="text-white/70 text-xs font-medium">{cashAccount.cardHolder}</p>
                <p className="text-white/50 text-[10px]">{cashAccount.cardType}</p>
              </div>
            </div>

            <p className="absolute bottom-3 right-4 text-white/20 text-[10px]">tap to flip</p>
          </div>

          <div
            className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary-mid)) 0%, hsl(var(--primary)) 100%)`,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
          <div className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-center" style={{ background: `linear-gradient(135deg, hsl(var(--primary-mid)) 0%, hsl(var(--primary)) 100%)`, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div className="w-full h-9 bg-white/10 rounded mb-6" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">CVV</p>
                <p className="text-white font-mono text-lg tracking-widest">• • •</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Expires</p>
                <p className="text-white font-mono text-sm">09 / 28</p>
              </div>
            </div>
            <p className="text-white/20 text-[10px] mt-4 text-center">tap to flip back</p>
          </div>
        </div>
      </div>

      <div className="bg-primary-wash rounded-2xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">💸</span>
          <div>
            <p className="text-xs font-semibold text-primary-mid">Interest earned this month</p>
            <p className="text-[11px] text-muted-foreground">Accrued daily, paid monthly</p>
          </div>
        </div>
        <p className="text-primary-mid font-bold text-base">+₪{cashAccount.interestEarnedMonth}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: "↑", label: "Send", onClick: handleSend },
          { icon: "↓", label: "Receive", onClick: handleReceive },
          { icon: "⇄", label: "Transfer", onClick: handleTransfer },
        ].map(({ icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="bg-card rounded-2xl py-3.5 flex flex-col items-center gap-1.5 shadow-sm hover:bg-secondary transition-colors duration-150"
          >
            <span className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary-mid font-bold text-sm">
              {icon}
            </span>
        {[{ icon: "↑", label: "Send" }, { icon: "↓", label: "Receive" }, { icon: "⇄", label: "Transfer" }].map(({ icon, label }) => (
          <button key={label} className="bg-card rounded-2xl py-3.5 flex flex-col items-center gap-1.5 shadow-sm hover:bg-secondary transition-colors duration-150">
            <span className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary-mid font-bold text-sm">{icon}</span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
        <p className="px-5 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Recent Transactions
        </p>
        {spendTxs.map((tx) => (
          <div
            key={tx.id}
            className="px-5 py-3.5 flex justify-between items-center"
            style={{ borderTop: "1px solid hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">
                {tx.category === "salary"
                  ? "💼"
                  : tx.category === "savings"
                    ? "🎯"
                    : tx.category === "transfer"
                      ? tx.type === "credit"
                        ? "💸"
                        : "📤"
                      : "🛒"}
              </span>
        <p className="px-5 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Transactions</p>
        {spendTxs.map((tx) => (
          <div key={tx.id} className="px-5 py-3.5 flex justify-between items-center" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-3">
              <span className="text-base">{tx.category === "salary" ? "💼" : tx.category === "savings" ? "🎯" : tx.category === "managed" ? "🧠" : tx.category === "trade" ? (tx.type === "credit" ? "📈" : "🛒") : "🛒"}</span>
              <div>
                <p className="text-[13px] font-medium text-foreground">{tx.desc}</p>
                <p className="text-[11px] text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <p className="text-sm font-semibold" style={{ color: tx.type === "credit" ? "hsl(var(--primary-mid))" : "hsl(var(--foreground))" }}>{tx.amount > 0 ? "+" : ""}₪{Math.abs(tx.amount).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
