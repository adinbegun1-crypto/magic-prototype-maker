import type { PortfolioItem } from "@/data/kesemData";

interface PortfolioBarProps {
  items: PortfolioItem[];
}

export function PortfolioBar({ items }: PortfolioBarProps) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <div className="flex rounded-lg overflow-hidden h-2 gap-0.5">
      {items.map((item) => (
        <div
          key={item.ticker}
          className="transition-all duration-700 ease-in-out"
          style={{ flex: item.value / total, background: item.color }}
        />
      ))}
    </div>
  );
}
