import { mockData } from "@/data/kesemData";
import { MiniChart } from "./MiniChart";
import { PortfolioBar } from "./PortfolioBar";
import { useState } from "react";

export function PortfolioTab() {
  const { portfolio } = mockData;
  const [invested, setInvested] = useState(false);

  return (
    <div className="animate-fade-up space-y-2.5">
      {portfolio.breakdown.map((item) => (
        <div
          key={item.ticker}
          className="bg-card rounded-2xl px-5 py-4 flex items-center justify-between transition-transform duration-200 hover:-translate-y-px shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: item.color + "18" }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.ticker}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MiniChart positive={item.change > 0} />
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                ₪{item.value.toLocaleString()}
              </p>
              <p
                className="text-xs mt-0.5 font-medium"
                style={{ color: item.change > 0 ? "#2D6A4F" : "#e05252" }}
              >
                {item.change > 0 ? "+" : ""}{item.change}%
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Allocation bar summary */}
      <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
          Allocation
        </p>
        <PortfolioBar items={portfolio.breakdown} />
        <div className="flex gap-3 mt-3 flex-wrap">
          {portfolio.breakdown.map((item) => (
            <div key={item.ticker} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-muted-foreground">{item.ticker}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setInvested((v) => !v)}
        className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white tracking-tight transition-all duration-200"
        style={{
          background: invested ? "#52B788" : "#2D6A4F",
        }}
      >
        {invested ? "✓ Investment Added!" : "Quick Invest ₪500"}
      </button>
    </div>
  );
}
