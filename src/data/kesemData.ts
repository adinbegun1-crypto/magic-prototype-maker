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
    { desc: "Dividend — TA125", amount: +142.5, date: "Today",     type: "credit" as const, category: "dividend" },
    { desc: "Auto-invest",      amount: -500,   date: "Yesterday", type: "debit"  as const, category: "invest" },
    { desc: "Savings transfer", amount: -1000,  date: "Mar 15",    type: "debit"  as const, category: "savings" },
    { desc: "Dividend — SPY",   amount: +88.2,  date: "Mar 12",    type: "credit" as const, category: "dividend" },
    { desc: "Coffee — Aroma",   amount: -18.5,  date: "Mar 12",    type: "debit"  as const, category: "spend" },
    { desc: "Salary deposit",   amount: +12400, date: "Mar 10",    type: "credit" as const, category: "salary" },
    { desc: "Supermarket",      amount: -320,   date: "Mar 9",     type: "debit"  as const, category: "spend" },
    { desc: "Netflix",          amount: -49.9,  date: "Mar 8",     type: "debit"  as const, category: "spend" },
  ],
  kesemCash: {
    balance: 8240.0,
    accountNumber: "**** 4821",
    interestRate: 4.8,
    interestEarnedMonth: 32.5,
    cardHolder: "ADIN COHEN",
    cardType: "Visa Debit",
    color1: "#1B4332",
    color2: "#2D6A4F",
  },
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

export const adviceTips = [
  {
    id: 1,
    category: "Portfolio",
    icon: "📊",
    title: "Rebalance your portfolio",
    body: "Your Tech allocation has grown to 19% — above your target. Consider moving ₪800 into Bonds to stay balanced.",
    action: "Review allocation",
    urgency: "medium" as const,
  },
  {
    id: 2,
    category: "Savings",
    icon: "🏠",
    title: "You're 31% to your apartment goal",
    body: "At your current savings rate you'll reach ₪200K in 18 months. Adding ₪500/mo would shave 4 months off.",
    action: "Boost savings",
    urgency: "low" as const,
  },
  {
    id: 3,
    category: "Cash",
    icon: "💰",
    title: "Your cash balance is earning 4.8%",
    body: "Nice! Your Kesem Cash account earned ₪32.50 in interest this month — outpacing most bank accounts.",
    action: "See details",
    urgency: "info" as const,
  },
  {
    id: 4,
    category: "Tax",
    icon: "📋",
    title: "Q1 dividend report ready",
    body: "You earned ₪230.70 in dividends this quarter. Download your tax summary to share with your accountant.",
    action: "Download report",
    urgency: "low" as const,
  },
  {
    id: 5,
    category: "Market",
    icon: "🌍",
    title: "S&P 500 up 3.1% this week",
    body: "Global tech stocks rallied on strong earnings. Your SPY holding gained ₪471 in the last 7 days.",
    action: "See performance",
    urgency: "info" as const,
  },
];

export type Fund = (typeof managedFunds)[number];
export type Transaction = (typeof mockData.transactions)[number];
export type SavingsGoal = (typeof mockData.savings)[number];
export type PortfolioItem = (typeof mockData.portfolio.breakdown)[number];
