interface MiniChartProps {
  positive: boolean;
}

export function MiniChart({ positive }: MiniChartProps) {
  const points = positive
    ? "0,40 10,35 20,38 30,28 40,30 50,20 60,22 70,12 80,15 90,8 100,5"
    : "0,10 10,15 20,12 30,22 40,20 50,30 60,28 70,38 80,35 90,42 100,45";

  const color = positive ? "#2D6A4F" : "#e05252";
  const gradientId = `gradient-${positive ? "pos" : "neg"}`;

  return (
    <svg width="100" height="50" viewBox="0 0 100 50" className="block">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,40 ${points} 100,50 0,50`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
