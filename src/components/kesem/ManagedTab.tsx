import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDemoPortfolio } from "@/context/DemoPortfolioContext";
import type { Fund } from "@/data/kesemData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function generateGrowthData(expectedLow: number, months = 12, startValue = 1000) {
  const data = [];
  let value = startValue;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < months; i++) {
    const monthlyReturn = expectedLow / 100 / 12;
    const noise = (Math.random() - 0.45) * (monthlyReturn * 1.8);
    value = value * (1 + monthlyReturn + noise);
    data.push({ month: monthNames[i], value: parseFloat(value.toFixed(0)) });
  }
  return data;
}

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

function GrowthTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-bold text-foreground">₪{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

function FundList({ onSelect }: { onSelect: (fund: Fund) => void }) {
  const { managedFunds, managedAllocations } = useDemoPortfolio();

  const totalManaged = managedAllocations.reduce(
    (sum, allocation) => sum + allocation.investedAmount,
    0
  );

  return (
    <>
      <div className="bg-card rounded-2xl p-4 shadow-sm mb-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
          Managed investing
        </p>
        <p className="text-lg font-semibold text-foreground">₪{totalManaged.toLocaleString("en-IL")}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Your managed-fund positions update instantly after every demo investment.
        </p>
      </div>

      <p className="text-sm font-semibold text-foreground mb-1">Managed Investing</p>
      <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
        We build and manage a diversified portfolio for you — tailored to your risk level.
        Deposit once and we handle everything. One flat 0.5% annual fee, no surprises.
      </p>

      <div className="space-y-3">
        {managedFunds.map((fund) => {
          const low = parseInt(fund.expectedReturn.split("–")[0]);
          const chartData = generateGrowthData(low);
          const currentAllocation = managedAllocations.find(
            (allocation) => allocation.fundId === fund.id
          );

          return (
            <div
              key={fund.id}
              onClick={() => onSelect(fund)}
              className="bg-card rounded-2xl p-5 cursor-pointer border-2 border-transparent hover:border-primary-mid transition-all duration-200 shadow-sm hover:shadow-md"
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
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Invested: ₪{currentAllocation?.investedAmount.toLocaleString("en-IL") ?? "0"}
                  </p>
                </div>
              </div>

              <div className="mb-3" style={{ height: 70 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${fund.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={fund.color} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={fund.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={fund.color}
                      strokeWidth={1.5}
                      fill={`url(#grad-${fund.name})`}
                      dot={false}
                    />
                    <XAxis dataKey="month" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip content={<GrowthTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <AllocationBar allocation={fund.allocation} />
              <div className="flex gap-3 mt-2.5 mb-3.5 flex-wrap">
                {fund.allocation.map((a) => (
                  <div key={a.label} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.color }} />
                    <span className="text-[10px] text-muted-foreground">
                      {a.label} {a.pct}%
                    </span>
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
          );
        })}
      </div>
    </>
  );
}

function FundDetail({ fund, onBack }: { fund: Fund; onBack: () => void }) {
  const { investInManagedFund, managedAllocations } = useDemoPortfolio();
  const [amount, setAmount] = useState("1000");
  const [confirmed, setConfirmed] = useState(false);

  const investedSoFar = managedAllocations.find((allocation) => allocation.fundId === fund.id)?.investedAmount ?? 0;
  const low = parseInt(fund.expectedReturn.split("–")[0]);
  const chartData = generateGrowthData(low, 12, parseInt(amount) || 1000);

  function handleInvest() {
    const result = investInManagedFund({
      fundId: fund.id,
      amount: parseInt(amount) || 0,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="animate-fade-up text-center py-8 px-4">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-[26px] text-primary mb-2">You're invested!</h2>
        <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
          ₪{parseInt(amount).toLocaleString()} is now in your <strong>{fund.name}</strong> managed fund.
          Your cash balance and activity feed were updated instantly.
        </p>

        <div className="space-y-2.5 mb-6 text-left">
          <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">
              Total in this fund
            </p>
            <p className="text-[22px] font-bold" style={{ color: fund.color }}>
              ₪{investedSoFar.toLocaleString("en-IL")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Your allocation is now tracked in shared demo state.</p>
          </div>
          <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">
              Annual management fee
            </p>
            <p className="text-[22px] font-bold" style={{ color: "hsl(var(--primary))" }}>
              ₪{(parseInt(amount) * 0.005).toFixed(0)} / year
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">That's it. No hidden charges.</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 text-white rounded-2xl text-sm font-semibold"
          style={{ background: "hsl(var(--primary-mid))" }}
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
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{fund.description}</p>
        <p className="text-xs text-muted-foreground mb-4">Already invested: ₪{investedSoFar.toLocaleString("en-IL")}</p>

        <div className="mb-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
            Projected growth on ₪{parseInt(amount).toLocaleString()} · 12 months
          </p>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-detail-${fund.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fund.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={fund.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={fund.color}
                  strokeWidth={2}
                  fill={`url(#grad-detail-${fund.name})`}
                  dot={false}
                />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip content={<GrowthTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-medium mb-2.5">How much would you like to invest?</p>
        <div className="flex gap-2 mb-5">
          {["500", "1000", "5000", "10000"].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
              style={{
                background: amount === amt ? fund.color : "hsl(var(--secondary))",
                color: amount === amt ? "white" : "hsl(var(--muted-foreground))",
              }}
            >
              ₪{parseInt(amt).toLocaleString()}
            </button>
          ))}
        </div>

        <div className="bg-background rounded-xl p-4 mb-5 space-y-2.5">
          {([
            ["Expected annual return", fund.expectedReturn, fund.color],
            ["Annual fee (0.5%)", `₪${(parseInt(amount) * 0.005).toFixed(0)}`, "hsl(var(--foreground))"],
            ["Strategy", fund.allocation.map((a) => a.label).join(" · "), "hsl(var(--muted-foreground))"],
          ] as [string, string, string][]).map(([label, val, color]) => (
            <div key={label} className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold" style={{ color }}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Risk level</span>
            <RiskDots risk={fund.risk} color={fund.color} />
          </div>
        </div>

        <button
          onClick={handleInvest}
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
  const { managedAllocations } = useDemoPortfolio();

  const activeManagedCount = useMemo(
    () => managedAllocations.filter((allocation) => allocation.investedAmount > 0).length,
    [managedAllocations]
  );

  return (
    <div className="animate-fade-up">
      {activeManagedCount > 0 && !selectedFund && (
        <p className="text-xs text-muted-foreground mb-3 px-1">
          {activeManagedCount} managed fund{activeManagedCount === 1 ? "" : "s"} currently funded.
        </p>
      )}
      {selectedFund ? <FundDetail fund={selectedFund} onBack={() => setSelectedFund(null)} /> : <FundList onSelect={setSelectedFund} />}
    </div>
  );
}
