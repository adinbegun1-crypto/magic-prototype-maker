import { mockData } from "@/data/kesemData";

export function SavingsTab() {
  const { savings } = mockData;

  return (
    <div className="animate-fade-up space-y-2.5">
      {savings.map((goal) => {
        const pct = Math.min((goal.current / goal.target) * 100, 100);
        const done = pct >= 100;

        return (
          <div
            key={goal.nameEn}
            className="bg-card rounded-2xl p-5 shadow-sm transition-transform duration-200 hover:-translate-y-px"
          >
            <div className="flex justify-between items-start mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[22px]">{goal.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{goal.nameEn}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-serif">{goal.name}</p>
                </div>
              </div>
              {done ? (
                <span className="bg-primary-wash text-primary-mid text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  Complete ✓
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">{goal.months}mo left</span>
              )}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>₪{goal.current.toLocaleString()}</span>
              <span>₪{goal.target.toLocaleString()}</span>
            </div>

            <div className="bg-secondary rounded-lg h-1.5 overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700 ease-in-out"
                style={{
                  width: `${pct}%`,
                  background: done ? "#52B788" : "#2D6A4F",
                }}
              />
            </div>

            <p className="text-xs text-primary-mid font-semibold mt-2">
              {pct.toFixed(0)}% saved
            </p>
          </div>
        );
      })}

      <button className="w-full py-3.5 bg-transparent text-primary-mid border-2 border-primary-mid rounded-2xl text-sm font-semibold hover:bg-primary-wash transition-colors duration-200">
        + New Savings Goal
      </button>
    </div>
  );
}
