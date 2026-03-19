export const mockData = {
  portfolio: {
    total: 48320.5,
    change: +1243.2,
    changePct: +2.64,
    breakdown: [
      { name: "Tel Aviv 125", ticker: "TA125", value: 18400, change: +1.8, color: "#2D6A4F" },
      { name: "S&P 500 ETF", ticker: "SPY",   value: 15200, change: +3.1, color: "#40916C" },
      { name: "Technology",  ticker: "TECH",  value: 9100,  change: +4.2, color: "#52B788" },
      { name: "Bonds",       ticker: "BOND",  value: 5620.5,change: -0.3, color: "#B7E4C7" },
    ],
  },
  savings: [
    { name: "דירה ראשונה", nameEn: "First Apartment", target: 200000, current: 62400,  emoji: "🏠", months: 18 },
    { name: "חופשה",       nameEn: "Vacation",         target: 15000,  current: 9800,   emoji: "✈️", months: 3 },
    { name: "חירום",       nameEn: "Emergency Fund",   target: 50000,  current: 50000,  emoji: "🛡️", months: 0 },
  ],
  transactions: [
    { desc: "Dividend — TA125", amount: +142.5, date: "Today",   type: "credit" as const },
    { desc: "Auto-invest",      amount: -500,   date: "Yesterday",type: "debit"  as const },
    { desc: "Savings transfer", amount: -1000,  date: "Mar 15",  type: "debit"  as const },
    { desc: "Dividend — SPY",   amount: +88.2,  date: "Mar 12",  type: "credit" as const },
  ],
};

export const managedFunds = [
  {
    name: "Conservative",
    nameHe: "שמרני",
    description: "Mostly bonds & stable assets. Low risk, steady growth.",
    expectedReturn: "4–6%",
    fee: "0.5%",
    risk: 1,
    color: "#74C69D",
    allocation: [
      { label: "Bonds",        pct: 70, color: "#2D6A4F" },
      { label: "Local Stocks", pct: 20, color: "#52B788" },
      { label: "Global ETFs",  pct: 10, color: "#B7E4C7" },
    ],
  },
  {
    name: "Balanced",
    nameHe: "מאוזן",
    description: "Mix of stocks and bonds. Medium risk, solid returns.",
    expectedReturn: "7–10%",
    fee: "0.5%",
    risk: 2,
    color: "#40916C",
    allocation: [
      { label: "Global ETFs",  pct: 45, color: "#2D6A4F" },
      { label: "Local Stocks", pct: 30, color: "#52B788" },
      { label: "Bonds",        pct: 25, color: "#B7E4C7" },
    ],
  },
  {
    name: "Growth",
    nameHe: "צמיחה",
    description: "Mostly stocks, some global exposure. Higher risk, higher upside.",
    expectedReturn: "10–15%",
    fee: "0.5%",
    risk: 3,
    color: "#1B4332",
    allocation: [
      { label: "Global ETFs",  pct: 55, color: "#2D6A4F" },
      { label: "Tech Stocks",  pct: 30, color: "#52B788" },
      { label: "Bonds",        pct: 15, color: "#B7E4C7" },
    ],
  },
];

export type Fund = (typeof managedFunds)[number];
export type Transaction = (typeof mockData.transactions)[number];
export type SavingsGoal = (typeof mockData.savings)[number];
export type PortfolioItem = (typeof mockData.portfolio.breakdown)[number];
