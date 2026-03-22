import { useDemoPortfolio } from "@/context/DemoPortfolioContext";

export function ActivityTab() {
  const { activity } = useDemoPortfolio();

  return (
    <div className="animate-fade-up">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
        {activity.map((tx, i) => (
          <div
            key={tx.id}
            className="px-5 py-4 flex justify-between items-center"
            style={{
              borderBottom: i < activity.length - 1 ? "1px solid #F4F4F0" : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold"
                style={{
                  background: tx.type === "credit" ? "#D8F3DC" : "#FFF0F0",
                  color: tx.type === "credit" ? "#2D6A4F" : "#e05252",
                }}
              >
                {tx.type === "credit" ? "↓" : "↑"}
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">{tx.desc}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{tx.date}</p>
              </div>
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: tx.type === "credit" ? "#2D6A4F" : "#1a1a1a" }}
            >
              {tx.amount > 0 ? "+" : ""}₪{Math.abs(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
