import type {
  DemoPortfolioItem,
  DemoSavingsGoal,
  DemoTransaction,
} from "@/lib/demoAccountStorage";

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
      { label: "Bonds", pct: 70, color: "#2D6A4F" },
      { label: "Local Stocks", pct: 20, color: "#52B788" },
      { label: "Global ETFs", pct: 10, color: "#B7E4C7" },
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
      { label: "Global ETFs", pct: 45, color: "#2D6A4F" },
      { label: "Local Stocks", pct: 30, color: "#52B788" },
      { label: "Bonds", pct: 25, color: "#B7E4C7" },
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
      { label: "Global ETFs", pct: 55, color: "#2D6A4F" },
      { label: "Tech Stocks", pct: 30, color: "#52B788" },
      { label: "Bonds", pct: 15, color: "#B7E4C7" },
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
export type Transaction = DemoTransaction;
export type SavingsGoal = DemoSavingsGoal;
export type PortfolioItem = DemoPortfolioItem;
