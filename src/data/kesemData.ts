export type ActivityCategory =
  | "dividend"
  | "invest"
  | "managed"
  | "savings"
  | "salary"
  | "spend"
  | "transfer"
  | "trade";

export type ActivityItem = {
  id: string;
  desc: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  category: ActivityCategory;
};

export type Holding = {
  ticker: string;
  name: string;
  value: number;
  change: number;
  color: string;
  units: number;
  unitPrice: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  nameEn: string;
  target: number;
  current: number;
  emoji: string;
  months: number;
};

export type ManagedFundDefinition = {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  expectedReturn: string;
  fee: string;
  risk: number;
  color: string;
  allocation: {
    label: string;
    pct: number;
    color: string;
  }[];
};

export type ManagedFundAllocation = {
  fundId: string;
  investedAmount: number;
};

export type DemoProfile = {
  firstName: string;
  fullName: string;
  email: string;
  initials: string;
  memberSince: string;
  riskProfile: string;
  notificationsEnabled: boolean;
  verified: boolean;
};

export type KesemCashAccount = {
  balance: number;
  accountNumber: string;
  interestRate: number;
  interestEarnedMonth: number;
  cardHolder: string;
  cardType: string;
  color1: string;
  color2: string;
};

export type DemoPortfolioSeed = {
  holdings: Holding[];
  savingsGoals: SavingsGoal[];
  activity: ActivityItem[];
  kesemCash: KesemCashAccount;
  managedAllocations: ManagedFundAllocation[];
  profile: DemoProfile;
};

export const managedFunds: ManagedFundDefinition[] = [
  {
    id: "conservative",
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
    id: "balanced",
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
    id: "growth",
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

export const demoPortfolioSeed: DemoPortfolioSeed = {
  holdings: [
    {
      name: "Tel Aviv 125",
      ticker: "TA125",
      value: 18400,
      change: 1.8,
      color: "#2D6A4F",
      unitPrice: 120,
      units: 18400 / 120,
    },
    {
      name: "S&P 500 ETF",
      ticker: "SPY",
      value: 15200,
      change: 3.1,
      color: "#40916C",
      unitPrice: 120,
      units: 15200 / 120,
    },
    {
      name: "Technology",
      ticker: "TECH",
      value: 9100,
      change: 4.2,
      color: "#52B788",
      unitPrice: 120,
      units: 9100 / 120,
    },
    {
      name: "Bonds",
      ticker: "BOND",
      value: 5620.5,
      change: -0.3,
      color: "#B7E4C7",
      unitPrice: 120,
      units: 5620.5 / 120,
    },
  ],
  savingsGoals: [
    {
      id: "goal-apartment",
      name: "דירה ראשונה",
      nameEn: "First Apartment",
      target: 200000,
      current: 62400,
      emoji: "🏠",
      months: 18,
    },
    {
      id: "goal-vacation",
      name: "חופשה",
      nameEn: "Vacation",
      target: 15000,
      current: 9800,
      emoji: "✈️",
      months: 3,
    },
    {
      id: "goal-emergency",
      name: "חירום",
      nameEn: "Emergency Fund",
      target: 50000,
      current: 50000,
      emoji: "🛡️",
      months: 0,
    },
  ],
  activity: [
    {
      id: "tx-dividend-ta125",
      desc: "Dividend — TA125",
      amount: 142.5,
      date: "Today",
      type: "credit",
      category: "dividend",
    },
    {
      id: "tx-auto-invest",
      desc: "Auto-invest",
      amount: -500,
      date: "Yesterday",
      type: "debit",
      category: "invest",
    },
    {
      id: "tx-savings-transfer",
      desc: "Savings transfer",
      amount: -1000,
      date: "Mar 15",
      type: "debit",
      category: "savings",
    },
    {
      id: "tx-dividend-spy",
      desc: "Dividend — SPY",
      amount: 88.2,
      date: "Mar 12",
      type: "credit",
      category: "dividend",
    },
    {
      id: "tx-coffee",
      desc: "Coffee — Aroma",
      amount: -18.5,
      date: "Mar 12",
      type: "debit",
      category: "spend",
    },
    {
      id: "tx-salary",
      desc: "Salary deposit",
      amount: 12400,
      date: "Mar 10",
      type: "credit",
      category: "salary",
    },
    {
      id: "tx-supermarket",
      desc: "Supermarket",
      amount: -320,
      date: "Mar 9",
      type: "debit",
      category: "spend",
    },
    {
      id: "tx-netflix",
      desc: "Netflix",
      amount: -49.9,
      date: "Mar 8",
      type: "debit",
      category: "spend",
    },
  ],
  kesemCash: {
    balance: 8240,
    accountNumber: "**** 4821",
    interestRate: 4.8,
    interestEarnedMonth: 32.5,
    cardHolder: "ADIN COHEN",
    cardType: "Visa Debit",
    color1: "#1B4332",
    color2: "#2D6A4F",
  },
  managedAllocations: managedFunds.map((fund) => ({
    fundId: fund.id,
    investedAmount: 0,
  })),
  profile: {
    firstName: "Adin",
    fullName: "Adin Cohen",
    email: "adin@email.com",
    initials: "A",
    memberSince: "Jan 2023",
    riskProfile: "Balanced",
    notificationsEnabled: true,
    verified: true,
  },
};

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
