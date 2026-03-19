import { useState } from "react";
import { adviceTips } from "@/data/kesemData";

const CATEGORIES = ["All", "Portfolio", "Savings", "Cash", "Tax", "Market"] as const;

const urgencyStyle: Record<string, { bg: string; dot: string }> = {
  medium: { bg: "bg-amber-50 border border-amber-200", dot: "bg-amber-400" },
  low:    { bg: "bg-primary-wash/60 border border-primary-wash", dot: "bg-primary-light" },
  info:   { bg: "bg-secondary border border-border", dot: "bg-muted-foreground/40" },
};

export function AdviceTab() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [dismissed, setDismissed] = useState<number[]>([]);

  const filtered = adviceTips.filter(
    (t) => !dismissed.includes(t.id) && (activeCategory === "All" || t.category === activeCategory)
  );

  return (
    <div className="animate-fade-up space-y-3">
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex-shrink-0"
            style={{
              background: activeCategory === cat ? "hsl(var(--primary-mid))" : "hsl(var(--secondary))",
              color: activeCategory === cat ? "white" : "hsl(var(--muted-foreground))",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AI insight banner */}
      <div className="rounded-2xl p-4 bg-primary text-white overflow-hidden relative">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1 relative z-10">Kesem AI</p>
        <p className="text-sm font-semibold relative z-10">Your portfolio is performing well 🎉</p>
        <p className="text-xs opacity-70 mt-1 relative z-10">
          Based on your risk profile, you're on track for a <span className="font-semibold opacity-100">+11.2%</span> return this year.
        </p>
      </div>

      {/* Tips */}
      {filtered.length === 0 && (
        <div className="bg-card rounded-2xl p-6 text-center shadow-sm">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-sm font-semibold text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">No new insights in this category.</p>
        </div>
      )}

      {filtered.map((tip) => {
        const style = urgencyStyle[tip.urgency];
        return (
          <div
            key={tip.id}
            className={`rounded-2xl p-4 shadow-sm ${style.bg} transition-all duration-200`}
          >
            <div className="flex items-start gap-3">
              <span className="text-[24px] mt-0.5">{tip.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {tip.category}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                </div>
                <p className="text-sm font-semibold text-foreground leading-snug">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.body}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button className="text-xs font-semibold text-primary-mid hover:underline">
                    {tip.action} →
                  </button>
                  <button
                    onClick={() => setDismissed((d) => [...d, tip.id])}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Weekly summary */}
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">This Week</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Portfolio gain", value: "+₪1,243", color: "text-primary-mid" },
            { label: "Interest earned", value: "+₪8.12", color: "text-primary-mid" },
            { label: "Fees paid", value: "₪2.40", color: "text-muted-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary rounded-xl p-3 text-center">
              <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
