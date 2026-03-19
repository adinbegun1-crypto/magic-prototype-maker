import { useState } from "react";
import { managedFunds, type Fund } from "@/data/kesemData";

function AllocationBar({ allocation }: { allocation: Fund["allocation"] }) {
  return (
    <div className="flex rounded-md overflow-hidden h-1.5 gap-0.5">
      {allocation.map((a) => (
        <div key={a.label} style={{ flex: a.pct, background: a.color }} />
      ))}
    </div>
  );
}

function RiskDots({ risk, color }: { risk: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="w-5 h-1.5 rounded-full transition-colors"
          style={{ background: n <= risk ? color : "#EEE" }}
        />
      ))}
    </div>
  );
}

function FundList({ onSelect }: { onSelect: (fund: Fund) => void }) {
  return (
    <>
      <p className="text-sm font-semibold text-foreground mb-1">Managed Investing</p>
      <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
        We build and manage a diversified portfolio for you — tailored to your risk level.
        Deposit once and we handle everything. One flat 0.5% annual fee, no surprises.
      </p>

      <div className="space-y-3">
        {managedFunds.map((fund) => (
          <div
            key={fund.name}
            onClick={() => onSelect(fund)}
            className="bg-card rounded-2xl p-5 cursor-pointer border-2 border-transparent
                       hover:border-primary-mid transition-all duration-200 shadow-sm
                       hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3.5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: fund.color }} />
                  <span className="text-[15px] font-semibold text-foreground">{fund.name}</span>
                  <span className="text-xs text-muted-foreground font-serif">{fund.nameHe}</span>
                </div>
                <p className="text-xs text-muted-foreground max-w-[210px] leading-relaxed">
                  {fund.description}
                </p>
              </div>
              <div className="text-right ml-2 shrink-0">
                <p className="text-[15px] font-bold" style={{ color: fund.color }}>
                  {fund.expectedReturn}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">est. / yr</p>
              </div>
            </div>

            <AllocationBar allocation={fund.allocation} />
            <div className="flex gap-3 mt-2.5 mb-3.5">
              {fund.allocation.map((a) => (
                <div key={a.label} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.color }} />
                  <span className="text-[10px] text-muted-foreground">{a.label} {a.pct}%</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Risk</span>
                <RiskDots risk={fund.risk} color={fund.color} />
              </div>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: fund.color, background: fund.color + "18" }}
              >
                Invest →
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FundDetail({
  fund,
  onBack,
}: {
  fund: Fund;
  onBack: () => void;
}) {
  const [amount, setAmount] = useState("1000");
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="animate-fade-up text-center py-8 px-4">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-[26px] text-primary mb-2">You're invested!</h2>
        <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
          ₪{parseInt(amount).toLocaleString()} is now in your{" "}
          <strong>{fund.name}</strong> managed fund. We'll take it from here.
        </p>

        <div className="space-y-2.5 mb-6 text-left">
          <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">
              Annual management fee
            </p>
            <p className="text-[22px] font-bold text-primary">
              ₪{(parseInt(amount) * 0.005).toFixed(0)} / year
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">That's it. No hidden charges.</p>
          </div>
          <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">
              Expected return (est.)
            </p>
            <p className="text-[22px] font-bold text-primary-mid">{fund.expectedReturn} / yr</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Based on historical performance. Not a guarantee.
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 bg-primary-mid text-white rounded-2xl text-sm font-semibold"
        >
          View All Funds
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground mb-4 block hover:text-foreground transition-colors"
      >
        ← Back to funds
      </button>

      <div className="bg-card rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: fund.color }} />
          <h3 className="text-[17px] font-semibold text-foreground">{fund.name} Fund</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{fund.description}</p>

        <p className="text-xs text-muted-foreground font-medium mb-2.5">
          How much would you like to invest?
        </p>
        <div className="flex gap-2 mb-5">
          {["500", "1000", "5000", "10000"].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
              style={{
                background: amount === amt ? fund.color : "#F4F4F0",
                color: amount === amt ? "white" : "#666",
              }}
            >
              ₪{parseInt(amt).toLocaleString()}
            </button>
          ))}
        </div>

        <div className="bg-background rounded-xl p-4 mb-5 space-y-2.5">
          {([
            ["Expected annual return", fund.expectedReturn, fund.color],
            ["Annual fee (0.5%)", `₪${(parseInt(amount) * 0.005).toFixed(0)}`, "#1a1a1a"],
            ["Strategy", fund.allocation.map((a) => a.label).join(" · "), "#888"],
          ] as [string, string, string][]).map(([label, val, color]) => (
            <div key={label} className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold" style={{ color }}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Risk level</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-4.5 h-1.5 rounded-full"
                  style={{ background: n <= fund.risk ? fund.color : "#DDD" }}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setConfirmed(true)}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white transition-all duration-200"
          style={{ background: fund.color }}
        >
          Invest ₪{parseInt(amount).toLocaleString()} in {fund.name}
        </button>
      </div>
    </div>
  );
}

export function ManagedTab() {
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  return (
    <div className="animate-fade-up">
      {selectedFund ? (
        <FundDetail fund={selectedFund} onBack={() => setSelectedFund(null)} />
      ) : (
        <FundList onSelect={setSelectedFund} />
      )}
    </div>
  );
}
