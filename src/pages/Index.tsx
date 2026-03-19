import { useState } from "react";
import { mockData } from "@/data/kesemData";
import { PortfolioBar } from "@/components/kesem/PortfolioBar";
import { PortfolioTab } from "@/components/kesem/PortfolioTab";
import { ManagedTab } from "@/components/kesem/ManagedTab";
import { SavingsTab } from "@/components/kesem/SavingsTab";
import { ActivityTab } from "@/components/kesem/ActivityTab";

const TABS = ["Portfolio", "Managed", "Savings", "Activity"] as const;
type Tab = (typeof TABS)[number];

const BOTTOM_NAV = [
  { icon: "📈", label: "Invest" },
  { icon: "🎯", label: "Goals" },
  { icon: "💬", label: "Advice" },
  { icon: "👤", label: "Profile" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("Portfolio");
  const { portfolio } = mockData;

  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-[390px]">

        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[13px] text-muted-foreground tracking-widest uppercase mb-0.5">
              Good morning
            </p>
            <h1 className="font-display text-[22px] text-foreground">Adin 👋</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-mid text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className="relative rounded-3xl p-7 mb-6 text-white overflow-hidden bg-primary">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.04]" />
          <div className="absolute -bottom-16 -left-5 w-52 h-52 rounded-full bg-white/[0.03]" />

          <p className="text-[12px] opacity-60 tracking-widest uppercase mb-1.5 relative z-10">
            Total Portfolio
          </p>
          <p className="font-display text-[38px] tracking-tight mb-2 relative z-10">
            ₪{portfolio.total.toLocaleString("en-IL", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 relative z-10">
            <span className="bg-white/10 text-primary-pale text-xs font-semibold px-3 py-1 rounded-full">
              +₪{portfolio.change.toLocaleString()} ({portfolio.changePct}%)
            </span>
            <span className="text-xs opacity-50">this month</span>
          </div>

          <div className="mt-6 relative z-10">
            <PortfolioBar items={portfolio.breakdown} />
          </div>
          <div className="flex gap-3 mt-3 relative z-10">
            {portfolio.breakdown.map((item) => (
              <div key={item.ticker} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="text-[10px] opacity-60">{item.ticker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-[10px] text-xs font-medium transition-all duration-200"
              style={{
                color: activeTab === tab ? "#1B4332" : "#888",
                background: activeTab === tab ? "white" : "transparent",
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "Portfolio" && <PortfolioTab />}
        {activeTab === "Managed"   && <ManagedTab />}
        {activeTab === "Savings"   && <SavingsTab />}
        {activeTab === "Activity"  && <ActivityTab />}

        {/* ── Bottom Nav ── */}
        <div className="flex justify-around bg-card rounded-3xl py-3.5 mt-6 shadow-[0_-2px_20px_rgba(0,0,0,0.05)]">
          {BOTTOM_NAV.map(({ icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1 transition-opacity duration-200"
              style={{
                color: label === "Invest" ? "#2D6A4F" : "#bbb",
                fontWeight: label === "Invest" ? 600 : 400,
              }}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
