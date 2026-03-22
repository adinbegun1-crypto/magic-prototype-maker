import { allStocks } from "@/data/stocksData";
import type { DemoAccount } from "@/types/demoAccount";

const stockByTicker = Object.fromEntries(allStocks.map((stock) => [stock.ticker, stock]));

const initialStockHoldings: DemoAccount["stockHoldings"] = [
  {
    id: "holding-ta125",
    ticker: "TA125",
    name: "Tel Aviv 125",
    market: stockByTicker.TA125.market,
    currency: stockByTicker.TA125.currency,
    shares: 18400 / stockByTicker.TA125.price,
    price: stockByTicker.TA125.price,
    changePct: 1.8,
    color: "#2D6A4F",
  },
  {
    id: "holding-spy",
    ticker: "SPY",
    name: "S&P 500 ETF",
    market: stockByTicker.SPY.market,
    currency: stockByTicker.SPY.currency,
    shares: 15200 / stockByTicker.SPY.price,
    price: stockByTicker.SPY.price,
    changePct: 3.1,
    color: "#40916C",
  },
  {
    id: "holding-tech",
    ticker: "TECH",
    name: "Technology",
    market: "Theme",
    currency: "₪",
    shares: 9100 / 120,
    price: 120,
    changePct: 4.2,
    color: "#52B788",
  },
  {
    id: "holding-bond",
    ticker: "BOND",
    name: "Bonds",
    market: "Theme",
    currency: "₪",
    shares: 5620.5 / 100,
    price: 100,
    changePct: -0.3,
    color: "#B7E4C7",
  },
];

export const initialDemoAccount: DemoAccount = {
  cashAccount: {
    balance: 8240,
    accountNumber: "**** 4821",
    interestRate: 4.8,
    interestEarnedMonth: 32.5,
    cardHolder: "ADIN COHEN",
    cardType: "Visa Debit",
    color1: "#1B4332",
    color2: "#2D6A4F",
  },
  stockHoldings: initialStockHoldings,
  managedPositions: [],
  savingsGoals: [
    { id: "goal-apartment", name: "דירה ראשונה", nameEn: "First Apartment", target: 200000, current: 62400, emoji: "🏠", months: 18 },
    { id: "goal-vacation", name: "חופשה", nameEn: "Vacation", target: 15000, current: 9800, emoji: "✈️", months: 3 },
    { id: "goal-emergency", name: "חירום", nameEn: "Emergency Fund", target: 50000, current: 50000, emoji: "🛡️", months: 0 },
  ],
  ledger: [
    { id: "tx-1", desc: "Dividend — TA125", amount: 142.5, date: "Today", type: "credit", category: "dividend", createdAt: "2026-03-22T09:30:00.000Z" },
    { id: "tx-2", desc: "Auto-invest", amount: -500, date: "Yesterday", type: "debit", category: "invest", createdAt: "2026-03-21T09:30:00.000Z" },
    { id: "tx-3", desc: "Savings transfer", amount: -1000, date: "Mar 15", type: "debit", category: "savings", createdAt: "2026-03-15T09:30:00.000Z" },
    { id: "tx-4", desc: "Dividend — SPY", amount: 88.2, date: "Mar 12", type: "credit", category: "dividend", createdAt: "2026-03-12T09:30:00.000Z" },
    { id: "tx-5", desc: "Coffee — Aroma", amount: -18.5, date: "Mar 12", type: "debit", category: "spend", createdAt: "2026-03-12T08:30:00.000Z" },
    { id: "tx-6", desc: "Salary deposit", amount: 12400, date: "Mar 10", type: "credit", category: "salary", createdAt: "2026-03-10T09:30:00.000Z" },
    { id: "tx-7", desc: "Supermarket", amount: -320, date: "Mar 9", type: "debit", category: "spend", createdAt: "2026-03-09T09:30:00.000Z" },
    { id: "tx-8", desc: "Netflix", amount: -49.9, date: "Mar 8", type: "debit", category: "spend", createdAt: "2026-03-08T09:30:00.000Z" },
  ],
};
