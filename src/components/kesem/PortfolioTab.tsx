import { useState } from "react";
import { toast } from "sonner";
import { useDemoPortfolio } from "@/context/DemoPortfolioContext";
import type { Holding } from "@/data/kesemData";
import { MiniChart } from "./MiniChart";
import { PortfolioBar } from "./PortfolioBar";

function HoldingSheet({ item, onClose }: { item: Holding; onClose: () => void }) {
  const { buyStock, sellHolding } = useDemoPortfolio();
  const [sellMode, setSellMode] = useState(false);
  const [sellAmt, setSellAmt] = useState("500");
  const [confirmedMessage, setConfirmedMessage] = useState<string | null>(null);

  const shares = item.units.toFixed(2);
  const pricePerShare = item.unitPrice.toFixed(2);

  function handleSell() {
    const result = sellHolding({
      ticker: item.ticker,
      amount: parseFloat(sellAmt),
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setConfirmedMessage(result.message);
  }

  function handleBuyMore() {
    const result = buyStock({
      ticker: item.ticker,
      name: item.name,
      color: item.color,
      amount: 500,
      pricePerUnit: item.unitPrice,
      change: item.change,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    onClose();
  }

  if (confirmedMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div className="w-full max-w-[390px] bg-card rounded-3xl p-6 animate-fade-up shadow-2xl text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-[22px] text-foreground mb-2">Sold!</h2>
          <p className="text-sm text-muted-foreground mb-6">{confirmedMessage}</p>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
            style={{ background: "hsl(var(--primary-mid))" }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-[390px] bg-card rounded-3xl p-6 animate-fade-up shadow-2xl">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: item.color + "22" }}>
              <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.ticker}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">×</button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {[
            ["Market Value", `₪${item.value.toLocaleString("en-IL", { maximumFractionDigits: 2 })}`],
            ["Change", `${item.change > 0 ? "+" : ""}${item.change}%`],
            ["Shares held", shares],
            ["Price / share", `${item.currency}${pricePerShare}`],
          ].map(([label, val]) => (
            <div key={label} className="bg-secondary rounded-xl px-4 py-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-bold" style={{ color: label === "Change" ? (item.change > 0 ? "hsl(var(--primary-mid))" : "#e05252") : "hsl(var(--foreground))" }}>{val}</p>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">30-day performance</p>
          <div className="h-16 w-full"><MiniChart positive={item.change > 0} width={320} height={60} /></div>
        </div>

        {!sellMode ? (
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setSellMode(true);
                setError(null);
              }}
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border-2 transition-colors"
              style={{ borderColor: "#e05252", color: "#e05252", background: "transparent" }}
            >
              Sell
            </button>
            <button
              onClick={handleBuyMore}
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
              style={{ background: "hsl(var(--primary-mid))" }}
            >
              Buy more
            </button>
          </div>
        ) : (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold text-muted-foreground mb-2">How much to sell?</p>
            <div className="flex gap-2 mb-3 flex-wrap">
              {quickValues.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSellAmt(String(amt));
                    setError(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors"
                  style={{
                    borderColor: sellAmt === String(amt) ? "#e05252" : "hsl(var(--border))",
                    background: sellAmt === String(amt) ? "#fff0f0" : "transparent",
                    color: sellAmt === String(amt) ? "#e05252" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {amt === Math.floor(maxValue) ? "All" : `₪${amt.toLocaleString()}`}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-secondary rounded-xl px-3">
                <span className="text-muted-foreground text-sm mr-1">₪</span>
                <input
                  type="number"
                  value={sellAmt}
                  onChange={(e) => {
                    setSellAmt(e.target.value);
                    setError(null);
                  }}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none py-2.5"
                />
              </div>
              <button
                onClick={handleSell}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#e05252" }}
              >
                Confirm sell
              </button>
            </div>
            {error && <p className="mt-2.5 text-xs font-medium text-red-500">{error}</p>}
            <button onClick={() => setSellMode(false)} className="text-xs text-muted-foreground mt-2.5 hover:text-foreground transition-colors">← Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PortfolioTab() {
  const { holdings, portfolio, buyStock } = useDemoPortfolio();
  const [selected, setSelected] = useState<Holding | null>(null);

  function handleQuickInvest() {
    const techHolding = holdings.find((holding) => holding.ticker === "TECH") ?? holdings[0];
    if (!techHolding) {
      toast.error("No holding available for a quick investment.");
      return;
    }

    const result = buyStock({
      ticker: techHolding.ticker,
      name: techHolding.name,
      color: techHolding.color,
      amount: 500,
      pricePerUnit: techHolding.unitPrice,
      change: techHolding.change,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  }

  return (
    <div className="animate-fade-up space-y-2.5">
      {holdings.map((item) => (
        <div
          key={item.ticker}
          onClick={() => setSelected(item)}
          className="bg-card rounded-2xl px-5 py-4 flex items-center justify-between transition-all duration-200 hover:-translate-y-px shadow-sm cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color + "18" }}>
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
              <p className="text-sm font-semibold text-foreground">₪{item.value.toLocaleString()}</p>
              <p
                className="text-xs mt-0.5 font-medium"
                style={{ color: item.change > 0 ? "hsl(var(--primary-mid))" : "#e05252" }}
              >
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </p>
            </div>
            <span className="text-muted-foreground/40 text-xs">›</span>
          </div>
        </div>
      ))}

      <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Allocation</p>
        <PortfolioBar items={portfolioBreakdown} />
        <div className="flex gap-3 mt-3 flex-wrap">
          {portfolioBreakdown.map((item) => (
            <div key={item.ticker} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-muted-foreground">{item.ticker}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleQuickInvest}
        className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white tracking-tight transition-all duration-200"
        style={{ background: "hsl(var(--primary))" }}
      >
        Quick Invest ₪500
      </button>

      {selected && <HoldingSheet item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
