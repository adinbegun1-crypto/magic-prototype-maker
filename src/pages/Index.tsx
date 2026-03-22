import { useState } from "react";
import { PortfolioBar } from "@/components/kesem/PortfolioBar";
import { PortfolioTab } from "@/components/kesem/PortfolioTab";
import { ManagedTab } from "@/components/kesem/ManagedTab";
import { SavingsTab } from "@/components/kesem/SavingsTab";
import { ActivityTab } from "@/components/kesem/ActivityTab";
import { AdviceTab } from "@/components/kesem/AdviceTab";
import { ProfileScreen } from "@/components/kesem/ProfileScreen";
import { KesemCashCard } from "@/components/kesem/KesemCashCard";
import { StockSearch } from "@/components/kesem/StockSearch";
import { useAuth } from "@/context/AuthContext";
import { mockData } from "@/data/kesemData";

const TABS = ["Portfolio", "Managed", "Savings", "Activity", "Stocks"] as const;
type Tab = (typeof TABS)[number];

type Screen = "invest" | "cash" | "advice" | "profile";

const BOTTOM_NAV: { icon: string; label: string; screen: Screen }[] = [
  { icon: "📈", label: "Invest", screen: "invest" },
  { icon: "💳", label: "Cash", screen: "cash" },
  { icon: "💬", label: "Advice", screen: "advice" },
  { icon: "👤", label: "Profile", screen: "profile" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("Portfolio");
  const [activeScreen, setActiveScreen] = useState<Screen>("invest");
  const { portfolio, kesemCash } = mockData;
  const { currentUser } = useAuth();

  const firstName = currentUser?.name.split(" ")[0] ?? "Investor";
  const fullName = currentUser?.name ?? "Kesem Member";
  const initials = currentUser?.initials ?? "K";
  const showInvest = activeScreen === "invest";

  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-[390px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[13px] text-muted-foreground tracking-widest uppercase mb-0.5">
              {activeScreen === "invest"
                ? "Good morning"
                : activeScreen === "cash"
                  ? "Kesem Cash"
                  : activeScreen === "advice"
                    ? "Your Insights"
                    : "Your Account"}
            </p>
            <h1 className="font-display text-[22px] text-foreground">
              {activeScreen === "invest"
                ? `${firstName} 👋`
                : activeScreen === "cash"
                  ? `₪${kesemCash.balance.toLocaleString("en-IL", { minimumFractionDigits: 2 })}`
                  : activeScreen === "advice"
                    ? "What's new 🔍"
                    : fullName}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-mid text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
        </div>

        {showInvest && (
          <>
            <div className="relative rounded-3xl p-7 mb-6 text-white overflow-hidden bg-primary">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.04]" />
              <div className="absolute -bottom-16 -left-5 w-52 h-52 rounded-full bg-white/[0.03]" />

              <p className="text-[12px] opacity-60 tracking-widest uppercase mb-1.5 relative z-10">Total Portfolio</p>
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

            <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-2 rounded-[10px] text-xs font-medium transition-all duration-200"
                  style={{
                    color: activeTab === tab ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    background: activeTab === tab ? "white" : "transparent",
                    boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Portfolio" && <PortfolioTab />}
            {activeTab === "Managed" && <ManagedTab />}
            {activeTab === "Savings" && <SavingsTab />}
            {activeTab === "Activity" && <ActivityTab />}
            {activeTab === "Stocks" && <StockSearch />}
          </>
        )}

        {activeScreen === "cash" && <KesemCashCard />}
        {activeScreen === "advice" && <AdviceTab />}
        {activeScreen === "profile" && <ProfileScreen />}

        <div className="flex justify-around bg-card rounded-3xl py-3.5 mt-6 shadow-[0_-2px_20px_rgba(0,0,0,0.05)]">
          {BOTTOM_NAV.map(({ icon, label, screen }) => {
            const active = activeScreen === screen;
            return (
              <button
                key={label}
                onClick={() => setActiveScreen(screen)}
                className="flex flex-col items-center gap-1 transition-all duration-200"
                style={{
                  color: active ? "hsl(var(--primary-mid))" : "hsl(var(--muted-foreground))",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[10px]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
