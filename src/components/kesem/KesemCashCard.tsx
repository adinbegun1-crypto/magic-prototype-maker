import { useState } from "react";
import type { Transaction } from "@/data/kesemData";
import type { DemoKesemCash } from "@/lib/demoAccountStorage";

export function KesemCashCard({
  kesemCash,
  transactions,
}: {
  kesemCash: DemoKesemCash;
  transactions: Transaction[];
}) {
  const [flipped, setFlipped] = useState(false);

  const spendTxs = transactions.filter((t) => t.category === "spend" || t.category === "salary");

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
              background: `linear-gradient(135deg, ${kesemCash.color1} 0%, ${kesemCash.color2} 100%)`,
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-4 w-40 h-40 rounded-full bg-white/[0.03]" />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Kesem Cash</p>
                <p className="text-white font-display text-2xl mt-0.5">
                  ₪{kesemCash.balance.toLocaleString("en-IL", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px] uppercase tracking-wide">Interest</p>
                <p className="text-primary-pale font-bold text-base">{kesemCash.interestRate}% p.a.</p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-white/40 text-xs tracking-[0.2em] mb-1">{kesemCash.accountNumber}</p>
              <div className="flex justify-between items-end">
                <p className="text-white/70 text-xs font-medium">{kesemCash.cardHolder}</p>
                <p className="text-white/50 text-[10px]">{kesemCash.cardType}</p>
              </div>
            </div>

            <p className="absolute bottom-3 right-4 text-white/20 text-[10px]">tap to flip</p>
          </div>

          <div
            className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-center"
            style={{
              background: `linear-gradient(135deg, ${kesemCash.color2} 0%, ${kesemCash.color1} 100%)`,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
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
        <p className="text-primary-mid font-bold text-base">+₪{kesemCash.interestEarnedMonth}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: "↑", label: "Send" },
          { icon: "↓", label: "Receive" },
          { icon: "⇄", label: "Transfer" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="bg-card rounded-2xl py-3.5 flex flex-col items-center gap-1.5 shadow-sm hover:bg-secondary transition-colors duration-150"
          >
            <span className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary-mid font-bold text-sm">
              {icon}
            </span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
        <p className="px-5 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Recent Transactions
        </p>
        {spendTxs.map((tx, i) => (
          <div
            key={`${tx.desc}-${tx.date}-${i}`}
            className="px-5 py-3.5 flex justify-between items-center"
            style={{ borderTop: "1px solid hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">
                {tx.category === "salary" ? "💼" : tx.category === "spend" ? "🛒" : "💳"}
              </span>
              <div>
                <p className="text-[13px] font-medium text-foreground">{tx.desc}</p>
                <p className="text-[11px] text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: tx.type === "credit" ? "hsl(var(--primary-mid))" : "hsl(var(--foreground))" }}
            >
              {tx.amount > 0 ? "+" : ""}₪{Math.abs(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
