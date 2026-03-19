import { useState, useMemo } from "react";
import { allStocks, MARKETS, type Market, type Stock } from "@/data/stocksData";
import { MiniChart } from "./MiniChart";

/* ── Buy Modal ─────────────────────────────────────────── */
function BuyModal({ stock, onClose }: { stock: Stock; onClose: () => void }) {
  const [mode, setMode] = useState<"amount" | "shares">("amount");
  const [amountInput, setAmountInput] = useState("500");
  const [sharesInput, setSharesInput] = useState("1");
  const [confirmed, setConfirmed] = useState(false);

  const quickAmounts = ["100", "500", "1000", "5000"];
  const quickShares = ["1", "5", "10", "25"];

  const totalCost =
    mode === "amount"
      ? parseFloat(amountInput) || 0
      : (parseFloat(sharesInput) || 0) * stock.price;

  const sharesCount =
    mode === "shares"
      ? parseFloat(sharesInput) || 0
      : totalCost / stock.price;

  if (confirmed) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-6">
        <div className="w-full max-w-[390px] bg-card rounded-3xl p-7 text-center animate-fade-up shadow-2xl">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display text-[24px] text-primary mb-2">Order placed!</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            You bought{" "}
            <strong>{sharesCount.toFixed(sharesCount < 1 ? 4 : 2)} shares</strong> of{" "}
            <strong>{stock.ticker}</strong> for{" "}
            <strong>
              {stock.currency}{totalCost.toLocaleString("en-IL", { minimumFractionDigits: 2 })}
            </strong>
            .
          </p>
          <div className="bg-background rounded-2xl px-5 py-4 mb-6 space-y-2 text-left">
            {[
              ["Asset", `${stock.name} (${stock.ticker})`],
              ["Market", stock.market],
              ["Price per share", `${stock.currency}${stock.price.toLocaleString()}`],
              ["Shares", sharesCount.toFixed(sharesCount < 1 ? 4 : 2)],
              ["Total cost", `${stock.currency}${totalCost.toLocaleString("en-IL", { minimumFractionDigits: 2 })}`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground">{val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl text-[15px] font-semibold text-primary-foreground bg-primary"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[390px] bg-card rounded-3xl p-6 animate-fade-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: stock.color }}
            >
              {stock.ticker.slice(0, 2)}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">{stock.name}</p>
              <p className="text-xs text-muted-foreground">
                {stock.ticker} · {stock.market}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground text-xl leading-none">×</button>
        </div>

        {/* Live price */}
        <div className="bg-background rounded-2xl px-5 py-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-[22px] font-display font-bold text-foreground">
              {stock.currency}{stock.price.toLocaleString()}
            </p>
            <p
              className="text-xs font-medium mt-0.5"
              style={{ color: stock.changePct >= 0 ? "hsl(var(--primary-mid))" : "#e05252" }}
            >
              {stock.changePct >= 0 ? "▲" : "▼"} {Math.abs(stock.changePct)}% today
            </p>
          </div>
          <MiniChart positive={stock.changePct >= 0} />
        </div>

        {/* Mode toggle */}
        <div className="flex bg-secondary rounded-xl p-1 mb-4">
          {(["amount", "shares"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-[10px] text-xs font-semibold capitalize transition-all duration-200"
              style={{
                background: mode === m ? "white" : "transparent",
                color: mode === m ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              By {m}
            </button>
          ))}
        </div>

        {/* Quick-select chips */}
        <div className="flex gap-2 mb-3">
          {(mode === "amount" ? quickAmounts : quickShares).map((v) => (
            <button
              key={v}
              onClick={() => mode === "amount" ? setAmountInput(v) : setSharesInput(v)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
              style={{
                background:
                  (mode === "amount" ? amountInput : sharesInput) === v
                    ? stock.color
                    : "hsl(var(--secondary))",
                color:
                  (mode === "amount" ? amountInput : sharesInput) === v
                    ? "white"
                    : "hsl(var(--muted-foreground))",
              }}
            >
              {mode === "amount" ? `${stock.currency}${parseInt(v).toLocaleString()}` : `${v} sh`}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {mode === "amount" ? stock.currency : "#"}
          </span>
          <input
            type="number"
            value={mode === "amount" ? amountInput : sharesInput}
            onChange={(e) =>
              mode === "amount"
                ? setAmountInput(e.target.value)
                : setSharesInput(e.target.value)
            }
            className="w-full bg-secondary rounded-xl pl-8 pr-4 py-3 text-sm font-semibold text-foreground outline-none focus:ring-2 ring-primary/30"
            placeholder={mode === "amount" ? "Enter amount" : "Enter shares"}
          />
        </div>

        {/* Summary */}
        <div className="bg-background rounded-xl px-4 py-3 mb-5 space-y-1.5">
          {[
            [
              "Estimated shares",
              `${sharesCount.toFixed(sharesCount < 1 ? 4 : 2)} sh`,
            ],
            [
              "Total cost",
              `${stock.currency}${totalCost.toLocaleString("en-IL", { minimumFractionDigits: 2 })}`,
            ],
            ["52-week range", `${stock.currency}${stock.low52.toLocaleString()} – ${stock.currency}${stock.high52.toLocaleString()}`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{val}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setConfirmed(true)}
          disabled={totalCost <= 0}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white transition-all duration-200 disabled:opacity-40"
          style={{ background: stock.color }}
        >
          Buy {stock.ticker} · {stock.currency}{totalCost.toLocaleString("en-IL", { minimumFractionDigits: 2 })}
        </button>
      </div>
    </div>
  );
}

/* ── Stock Row ─────────────────────────────────────────── */
function StockRow({ stock, onBuy }: { stock: Stock; onBuy: (s: Stock) => void }) {
  return (
    <div
      onClick={() => onBuy(stock)}
      className="bg-card rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-transform duration-200 hover:-translate-y-px shadow-sm"
    >
      <div className="flex items-center gap-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0"
          style={{ background: stock.color }}
        >
          {stock.ticker.slice(0, 3)}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">{stock.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {stock.ticker} · {stock.market}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <MiniChart positive={stock.changePct >= 0} />
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {stock.currency}{stock.price.toLocaleString()}
          </p>
          <p
            className="text-[11px] font-medium mt-0.5"
            style={{ color: stock.changePct >= 0 ? "hsl(var(--primary-mid))" : "#e05252" }}
          >
            {stock.changePct >= 0 ? "+" : ""}{stock.changePct}%
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export function StockSearch() {
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState<Market>("All");
  const [buyStock, setBuyStock] = useState<Stock | null>(null);
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allStocks.filter((s) => {
      const matchesMarket = market === "All" || s.market === market;
      const matchesQuery =
        !q ||
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q);
      return matchesMarket && matchesQuery;
    });
  }, [query, market]);

  const showResults = focused || query.length > 0 || market !== "All";

  return (
    <div className="animate-fade-up">
      {/* Search input */}
      <div className="relative mb-3">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search stocks, ETFs, markets…"
          className="w-full bg-card rounded-2xl pl-10 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            ×
          </button>
        )}
      </div>

      {/* Market filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {MARKETS.map((m) => (
          <button
            key={m}
            onClick={() => setMarket(m)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
            style={{
              background: market === m ? "hsl(var(--primary))" : "hsl(var(--secondary))",
              color: market === m ? "white" : "hsl(var(--muted-foreground))",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Results */}
      {showResults ? (
        <div className="space-y-2.5">
          {results.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No stocks found for "{query}"
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground font-medium px-1 mb-1">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((s) => (
                <StockRow key={s.ticker} stock={s} onBuy={setBuyStock} />
              ))}
            </>
          )}
        </div>
      ) : (
        /* Default: top movers */
        <div className="space-y-2.5">
          <p className="text-xs text-muted-foreground font-medium px-1">Top movers today</p>
          {allStocks
            .slice()
            .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
            .slice(0, 5)
            .map((s) => (
              <StockRow key={s.ticker} stock={s} onBuy={setBuyStock} />
            ))}
        </div>
      )}

      {/* Buy modal */}
      {buyStock && <BuyModal stock={buyStock} onClose={() => setBuyStock(null)} />}
    </div>
  );
}
