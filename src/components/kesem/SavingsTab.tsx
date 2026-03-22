import { useState } from "react";
import { useDemoAccount } from "@/context/DemoAccountContext";
import type { SavingsGoalRecord } from "@/types/demoAccount";

function InterestBanner() {
  const { account } = useDemoAccount();
  const { interestRate, interestEarnedMonth, balance } = account.cashAccount;
  return (
    <div className="rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between" style={{ background: "hsl(var(--primary))" }}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-0.5">Kesem Cash · Interest</p>
        <p className="text-white font-display text-[22px] tracking-tight">{interestRate}% <span className="text-sm font-sans font-normal opacity-70">p.a.</span></p>
        <p className="text-white/60 text-xs mt-0.5">Earned this month: <span className="text-white font-semibold">₪{interestEarnedMonth}</span></p>
      </div>
      <div className="text-right">
        <p className="text-[11px] text-white/60 mb-0.5">Account balance</p>
        <p className="text-white font-semibold text-[17px]">₪{balance.toLocaleString("en-IL", { minimumFractionDigits: 2 })}</p>
        <p className="text-[10px] text-white/40 mt-0.5">Earns daily, paid monthly</p>
      </div>
    </div>
  );
}

const EMOJIS = ["🏠", "✈️", "🛡️", "🚗", "📚", "💍", "🎓", "🌴", "💻", "👶"];

function GoalCard({ goal }: { goal: SavingsGoalRecord }) {
  const { contributeToGoal } = useDemoAccount();
  const [expanded, setExpanded] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const done = pct >= 100;
  const remaining = Math.max(goal.target - goal.current, 0);

  function handleContribute() {
    const result = contributeToGoal({ goalId: goal.id, amount: parseFloat(inputVal) });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setInputVal("");
    setExpanded(false);
  }

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm transition-all duration-200">
      <div className="flex justify-between items-start mb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-[22px]">{goal.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-foreground">{goal.nameEn}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-serif">{goal.name}</p>
          </div>
        </div>
        {done ? <span className="bg-primary-wash text-primary-mid text-[11px] font-semibold px-2.5 py-1 rounded-full">Complete ✓</span> : <span className="text-xs text-muted-foreground">{goal.months}mo left</span>}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mb-2"><span>₪{goal.current.toLocaleString()}</span><span>₪{goal.target.toLocaleString()}</span></div>

      <div className="bg-secondary rounded-lg h-2.5 overflow-hidden"><div className="h-full rounded-lg transition-all duration-700 ease-in-out" style={{ width: `${pct}%`, background: done ? "hsl(var(--primary-light))" : "hsl(var(--primary-mid))" }} /></div>

      <div className="flex items-center justify-between mt-2.5">
        <p className="text-xs font-semibold text-primary-mid">{pct.toFixed(0)}% saved</p>
        {!done && <button onClick={() => { setExpanded((v) => !v); setError(null); }} className="text-xs font-semibold text-primary-mid bg-primary-wash px-3 py-1 rounded-full hover:opacity-80 transition-opacity">{expanded ? "Cancel" : "+ Add funds"}</button>}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-up">
          <p className="text-xs text-muted-foreground mb-2">Still need <span className="font-semibold text-foreground">₪{remaining.toLocaleString()}</span> to reach goal</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            {[100, 500, 1000].map((amt) => (
              <button key={amt} onClick={() => { setInputVal(String(amt)); setError(null); }} className="px-3 py-1 rounded-xl text-xs font-semibold border transition-colors duration-150" style={{ borderColor: inputVal === String(amt) ? "hsl(var(--primary-mid))" : "hsl(var(--border))", background: inputVal === String(amt) ? "hsl(var(--primary-wash))" : "transparent", color: inputVal === String(amt) ? "hsl(var(--primary-mid))" : "hsl(var(--muted-foreground))" }}>₪{amt}</button>
            ))}
            <button onClick={() => { setInputVal(String(remaining)); setError(null); }} className="px-3 py-1 rounded-xl text-xs font-semibold border border-dashed border-primary-mid/40 text-primary-mid/70 hover:bg-primary-wash/50 transition-colors">Full amount</button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-secondary rounded-xl px-3"><span className="text-muted-foreground text-sm mr-1.5">₪</span><input type="number" value={inputVal} onChange={(e) => { setInputVal(e.target.value); setError(null); }} placeholder="Custom amount" className="flex-1 bg-transparent text-sm text-foreground outline-none py-2.5 placeholder:text-muted-foreground/50" /></div>
            <button onClick={handleContribute} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150" style={{ background: "hsl(var(--primary-mid))" }}>Save</button>
          </div>
          {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}

function NewGoalModal({ onClose }: { onClose: () => void }) {
  const { addSavingsGoal } = useDemoAccount();
  const [nameEn, setNameEn] = useState("");
  const [target, setTarget] = useState("");
  const [months, setMonths] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    const result = addSavingsGoal({
      name: nameEn,
      nameEn,
      target: parseFloat(target),
      emoji,
      months: parseInt(months) || 12,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.35)" }}>
      <div className="w-full max-w-[390px] bg-card rounded-3xl p-6 animate-fade-up shadow-2xl">
        <div className="flex justify-between items-center mb-5"><p className="text-base font-bold text-foreground">New Savings Goal</p><button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm hover:bg-muted transition-colors">×</button></div>

        <div className="flex gap-2 flex-wrap mb-4">{EMOJIS.map((e) => <button key={e} onClick={() => setEmoji(e)} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-100" style={{ background: emoji === e ? "hsl(var(--primary-wash))" : "hsl(var(--secondary))", border: emoji === e ? "2px solid hsl(var(--primary-mid))" : "2px solid transparent" }}>{e}</button>)}</div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Goal name</label>
            <input value={nameEn} onChange={(e) => { setNameEn(e.target.value); setError(null); }} placeholder="e.g. Down payment" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary-mid/30 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Target (₪)</label>
              <input type="number" value={target} onChange={(e) => { setTarget(e.target.value); setError(null); }} placeholder="50,000" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary-mid/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Months to goal</label>
              <input type="number" value={months} onChange={(e) => { setMonths(e.target.value); setError(null); }} placeholder="12" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary-mid/30 transition-colors" />
            </div>
          </div>
        </div>
        {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

        <button onClick={handleAdd} className="w-full mt-5 py-3.5 rounded-2xl text-[15px] font-semibold text-white transition-all disabled:opacity-40" style={{ background: "hsl(var(--primary-mid))" }}>Create Goal</button>
      </div>
    </div>
  );
}

export function SavingsTab() {
  const { account } = useDemoAccount();
  const [showModal, setShowModal] = useState(false);

  const goals = account.savingsGoals;
  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallPct = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <div className="animate-fade-up space-y-2.5">
      <InterestBanner />

      <div className="bg-card rounded-2xl px-5 py-4 shadow-sm">
        <div className="flex justify-between items-center mb-3"><p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Savings Goals</p><p className="text-xs text-muted-foreground">{goals.length} goals</p></div>
        <p className="font-display text-[28px] text-foreground tracking-tight">₪{totalSaved.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-0.5">of ₪{totalTarget.toLocaleString()} goal</p>
        <div className="bg-secondary rounded-full h-2 overflow-hidden mt-3"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${overallPct}%`, background: "hsl(var(--primary-mid))" }} /></div>
      </div>

      {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}

      <button onClick={() => setShowModal(true)} className="w-full py-3.5 bg-transparent text-primary-mid border-2 border-primary-mid rounded-2xl text-sm font-semibold hover:bg-primary-wash transition-colors duration-200">+ New Savings Goal</button>

      {showModal && <NewGoalModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
