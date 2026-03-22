export type CashAccount = {
  balance: number;
  accountNumber: string;
  interestRate: number;
  interestEarnedMonth: number;
  cardHolder: string;
  cardType: string;
  color1: string;
  color2: string;
};

export type AssetCurrency = "₪" | "$" | "£";

export type StockHolding = {
  id: string;
  ticker: string;
  name: string;
  market: string;
  currency: AssetCurrency;
  shares: number;
  price: number;
  changePct: number;
  color: string;
};

export type ManagedFundPosition = {
  id: string;
  fundName: string;
  fundNameHe: string;
  color: string;
  invested: number;
  expectedReturn: string;
  risk: number;
};

export type SavingsGoalRecord = {
  id: string;
  name: string;
  nameEn: string;
  target: number;
  current: number;
  emoji: string;
  months: number;
};

export type LedgerCategory =
  | "dividend"
  | "invest"
  | "savings"
  | "spend"
  | "salary"
  | "managed"
  | "trade";

export type LedgerEntry = {
  id: string;
  desc: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  category: LedgerCategory;
  createdAt: string;
};

export type DemoAccount = {
  cashAccount: CashAccount;
  stockHoldings: StockHolding[];
  managedPositions: ManagedFundPosition[];
  savingsGoals: SavingsGoalRecord[];
  ledger: LedgerEntry[];
};
