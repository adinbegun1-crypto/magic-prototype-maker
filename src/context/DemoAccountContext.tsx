import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { initialDemoAccount } from "@/data/demoAccount";
import type { DemoAccount, LedgerCategory, LedgerEntry, ManagedFundPosition, SavingsGoalRecord, StockHolding } from "@/types/demoAccount";

type NewSavingsGoal = Omit<SavingsGoalRecord, "id" | "current">;

type BuyStockInput = Omit<StockHolding, "id" | "shares"> & { shares: number; totalCost: number };
type SellStockInput = { ticker: string; amount: number };
type InvestManagedInput = Omit<ManagedFundPosition, "id" | "invested"> & { amount: number };
type ContributeGoalInput = { goalId: string; amount: number };

type DemoAccountContextValue = {
  account: DemoAccount;
  portfolioBreakdown: Array<StockHolding & { value: number; change: number }>;
  stockPortfolioTotal: number;
  stockPortfolioChange: number;
  stockPortfolioChangePct: number;
  totalManagedValue: number;
  buyStock: (input: BuyStockInput) => { ok: true } | { ok: false; message: string };
  sellStock: (input: SellStockInput) => { ok: true } | { ok: false; message: string };
  investManagedFund: (input: InvestManagedInput) => { ok: true } | { ok: false; message: string };
  contributeToGoal: (input: ContributeGoalInput) => { ok: true } | { ok: false; message: string };
  addSavingsGoal: (input: NewSavingsGoal) => { ok: true } | { ok: false; message: string };
};

type Action =
  | { type: "BUY_STOCK"; payload: BuyStockInput }
  | { type: "SELL_STOCK"; payload: SellStockInput }
  | { type: "INVEST_MANAGED"; payload: InvestManagedInput }
  | { type: "CONTRIBUTE_GOAL"; payload: ContributeGoalInput }
  | { type: "ADD_GOAL"; payload: NewSavingsGoal };

const DemoAccountContext = createContext<DemoAccountContextValue | null>(null);

const money = new Intl.NumberFormat("en-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function todayLabel(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const diff = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  if (diff === 0) return "Today";
  if (diff === dayMs) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function createLedgerEntry(desc: string, amount: number, category: LedgerCategory): LedgerEntry {
  const createdAt = new Date().toISOString();
  return {
    id: `${category}-${createdAt}`,
    desc,
    amount,
    date: todayLabel(createdAt),
    type: amount >= 0 ? "credit" : "debit",
    category,
    createdAt,
  };
}

function reducer(state: DemoAccount, action: Action): DemoAccount {
  switch (action.type) {
    case "BUY_STOCK": {
      const { ticker, shares, totalCost, ...rest } = action.payload;
      const existing = state.stockHoldings.find((holding) => holding.ticker === ticker);
      const stockHoldings = existing
        ? state.stockHoldings.map((holding) =>
            holding.ticker === ticker
              ? {
                  ...holding,
                  shares: holding.shares + shares,
                  price: rest.price,
                  changePct: rest.changePct,
                  color: rest.color,
                  market: rest.market,
                  currency: rest.currency,
                  name: rest.name,
                }
              : holding,
          )
        : [...state.stockHoldings, { id: `holding-${ticker.toLowerCase()}`, ticker, shares, ...rest }];

      return {
        ...state,
        cashAccount: {
          ...state.cashAccount,
          balance: state.cashAccount.balance - totalCost,
        },
        stockHoldings,
        ledger: [createLedgerEntry(`Bought ${ticker}`, -totalCost, "trade"), ...state.ledger],
      };
    }
    case "SELL_STOCK": {
      const { ticker, amount } = action.payload;
      const stockHoldings = state.stockHoldings
        .map((holding) => {
          if (holding.ticker !== ticker) return holding;
          const value = holding.shares * holding.price;
          const ratio = Math.max(0, (value - amount) / value);
          return { ...holding, shares: holding.shares * ratio };
        })
        .filter((holding) => holding.shares > 0.0001);

      return {
        ...state,
        cashAccount: {
          ...state.cashAccount,
          balance: state.cashAccount.balance + amount,
        },
        stockHoldings,
        ledger: [createLedgerEntry(`Sold ${ticker}`, amount, "trade"), ...state.ledger],
      };
    }
    case "INVEST_MANAGED": {
      const { fundName, amount, ...rest } = action.payload;
      const existing = state.managedPositions.find((position) => position.fundName === fundName);
      const managedPositions = existing
        ? state.managedPositions.map((position) =>
            position.fundName === fundName
              ? { ...position, invested: position.invested + amount, ...rest }
              : position,
          )
        : [...state.managedPositions, { id: `managed-${fundName.toLowerCase()}`, fundName, invested: amount, ...rest }];

      return {
        ...state,
        cashAccount: {
          ...state.cashAccount,
          balance: state.cashAccount.balance - amount,
        },
        managedPositions,
        ledger: [createLedgerEntry(`Managed fund — ${fundName}`, -amount, "managed"), ...state.ledger],
      };
    }
    case "CONTRIBUTE_GOAL": {
      const { goalId, amount } = action.payload;
      const goal = state.savingsGoals.find((item) => item.id === goalId);
      if (!goal) return state;
      const nextCurrent = Math.min(goal.current + amount, goal.target);
      const actualAmount = nextCurrent - goal.current;

      return {
        ...state,
        cashAccount: {
          ...state.cashAccount,
          balance: state.cashAccount.balance - actualAmount,
        },
        savingsGoals: state.savingsGoals.map((item) =>
          item.id === goalId ? { ...item, current: nextCurrent } : item,
        ),
        ledger: [createLedgerEntry(`Savings goal — ${goal.nameEn}`, -actualAmount, "savings"), ...state.ledger],
      };
    }
    case "ADD_GOAL":
      return {
        ...state,
        savingsGoals: [
          ...state.savingsGoals,
          {
            id: `goal-${action.payload.nameEn.toLowerCase().replace(/\s+/g, "-")}`,
            current: 0,
            ...action.payload,
          },
        ],
      };
    default:
      return state;
  }
}

function invalidAmountMessage(amount: number) {
  return Number.isFinite(amount) && amount > 0 ? null : "Enter a valid amount greater than 0.";
}

export function DemoAccountProvider({ children }: { children: ReactNode }) {
  const [account, dispatch] = useReducer(reducer, initialDemoAccount);

  const value = useMemo<DemoAccountContextValue>(() => {
    const portfolioBreakdown = account.stockHoldings.map((holding) => ({
      ...holding,
      value: holding.shares * holding.price,
      change: holding.changePct,
    }));
    const stockPortfolioTotal = portfolioBreakdown.reduce((sum, item) => sum + item.value, 0);
    const stockPortfolioChange = portfolioBreakdown.reduce(
      (sum, item) => sum + item.value * (item.change / 100),
      0,
    );
    const stockPortfolioChangePct = stockPortfolioTotal > 0 ? (stockPortfolioChange / stockPortfolioTotal) * 100 : 0;
    const totalManagedValue = account.managedPositions.reduce((sum, item) => sum + item.invested, 0);

    return {
      account,
      portfolioBreakdown,
      stockPortfolioTotal,
      stockPortfolioChange,
      stockPortfolioChangePct,
      totalManagedValue,
      buyStock: (input) => {
        const invalidAmount = invalidAmountMessage(input.totalCost) ?? invalidAmountMessage(input.shares);
        if (invalidAmount) return { ok: false, message: invalidAmount };
        if (input.totalCost > account.cashAccount.balance) {
          return { ok: false, message: `Not enough cash. Available demo balance: ₪${money.format(account.cashAccount.balance)}.` };
        }
        dispatch({ type: "BUY_STOCK", payload: input });
        return { ok: true };
      },
      sellStock: ({ ticker, amount }) => {
        const invalidAmount = invalidAmountMessage(amount);
        if (invalidAmount) return { ok: false, message: invalidAmount };
        const holding = portfolioBreakdown.find((item) => item.ticker === ticker);
        if (!holding) return { ok: false, message: "This holding is no longer available to sell." };
        if (amount > holding.value) {
          return { ok: false, message: `You only have ₪${money.format(holding.value)} available to sell.` };
        }
        dispatch({ type: "SELL_STOCK", payload: { ticker, amount } });
        return { ok: true };
      },
      investManagedFund: (input) => {
        const invalidAmount = invalidAmountMessage(input.amount);
        if (invalidAmount) return { ok: false, message: invalidAmount };
        if (input.amount > account.cashAccount.balance) {
          return { ok: false, message: `Not enough cash. Available demo balance: ₪${money.format(account.cashAccount.balance)}.` };
        }
        dispatch({ type: "INVEST_MANAGED", payload: input });
        return { ok: true };
      },
      contributeToGoal: ({ goalId, amount }) => {
        const invalidAmount = invalidAmountMessage(amount);
        if (invalidAmount) return { ok: false, message: invalidAmount };
        const goal = account.savingsGoals.find((item) => item.id === goalId);
        if (!goal) return { ok: false, message: "That savings goal was not found." };
        if (goal.current >= goal.target) {
          return { ok: false, message: "This savings goal is already complete." };
        }
        const actualAmount = Math.min(amount, goal.target - goal.current);
        if (actualAmount > account.cashAccount.balance) {
          return { ok: false, message: `Not enough cash. Available demo balance: ₪${money.format(account.cashAccount.balance)}.` };
        }
        dispatch({ type: "CONTRIBUTE_GOAL", payload: { goalId, amount } });
        return { ok: true };
      },
      addSavingsGoal: (input) => {
        if (!input.nameEn.trim()) return { ok: false, message: "Enter a goal name before creating it." };
        const invalidTarget = invalidAmountMessage(input.target);
        if (invalidTarget) return { ok: false, message: "Enter a valid target amount greater than 0." };
        if (!Number.isFinite(input.months) || input.months <= 0) return { ok: false, message: "Enter a valid number of months greater than 0." };
        dispatch({ type: "ADD_GOAL", payload: input });
        return { ok: true };
      },
    };
  }, [account]);

  return <DemoAccountContext.Provider value={value}>{children}</DemoAccountContext.Provider>;
}

export function useDemoAccount() {
  const context = useContext(DemoAccountContext);
  if (!context) {
    throw new Error("useDemoAccount must be used within a DemoAccountProvider");
  }
  return context;
}
