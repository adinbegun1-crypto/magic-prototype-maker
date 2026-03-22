import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  demoPortfolioSeed,
  managedFunds,
  type ActivityItem,
  type DemoPortfolioSeed,
  type DemoProfile,
  type Holding,
  type ManagedFundAllocation,
  type ManagedFundDefinition,
  type SavingsGoal,
} from "@/data/kesemData";

type BuyStockInput = {
  ticker: string;
  name: string;
  color: string;
  amount: number;
  pricePerUnit: number;
  change?: number;
};

type SellHoldingInput = {
  ticker: string;
  amount: number;
};

type ManagedFundInvestmentInput = {
  fundId: string;
  amount: number;
};

type SavingsTransferInput = {
  goalId: string;
  amount: number;
};

type CashTransferInput = {
  amount: number;
  counterparty?: string;
};

type AddSavingsGoalInput = Omit<SavingsGoal, "id"> & { id?: string };

type ActionResult = {
  success: boolean;
  message: string;
  amount?: number;
};

type PortfolioSummary = {
  total: number;
  change: number;
  changePct: number;
  breakdown: Holding[];
};

type ManagedAllocationSummary = ManagedFundAllocation & {
  fund: ManagedFundDefinition;
};

type DemoPortfolioContextValue = {
  cashAccount: DemoPortfolioSeed["kesemCash"];
  holdings: Holding[];
  savingsGoals: SavingsGoal[];
  activity: ActivityItem[];
  managedAllocations: ManagedAllocationSummary[];
  managedFunds: ManagedFundDefinition[];
  profile: DemoProfile;
  portfolio: PortfolioSummary;
  buyStock: (input: BuyStockInput) => ActionResult;
  sellHolding: (input: SellHoldingInput) => ActionResult;
  investInManagedFund: (input: ManagedFundInvestmentInput) => ActionResult;
  transferToSavingsGoal: (input: SavingsTransferInput) => ActionResult;
  sendCash: (input: CashTransferInput) => ActionResult;
  receiveCash: (input: CashTransferInput) => ActionResult;
  addSavingsGoal: (goal: AddSavingsGoalInput) => ActionResult;
  toggleNotifications: () => void;
  resetDemoPortfolio: () => void;
};

const STORAGE_KEY = "kesem-demo-portfolio";
const MANAGED_FUND_MAP = new Map(managedFunds.map((fund) => [fund.id, fund]));

const DemoPortfolioContext = createContext<DemoPortfolioContextValue | null>(null);

function cloneSeedState(): DemoPortfolioSeed {
  return JSON.parse(JSON.stringify(demoPortfolioSeed)) as DemoPortfolioSeed;
}

function formatRelativeDate(date = new Date()) {
  const today = new Date();
  const target = new Date(date);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function createActivity(
  desc: string,
  amount: number,
  category: ActivityItem["category"],
  type: ActivityItem["type"]
): ActivityItem {
  return {
    id: `${category}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    desc,
    amount,
    date: formatRelativeDate(),
    type,
    category,
  };
}

function ensureNumber(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

function computePortfolioSummary(
  holdings: Holding[],
  managedAllocations: ManagedFundAllocation[]
): PortfolioSummary {
  const holdingsTotal = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const managedTotal = managedAllocations.reduce(
    (sum, allocation) => sum + allocation.investedAmount,
    0
  );
  const total = ensureNumber(holdingsTotal + managedTotal);
  const change = ensureNumber(
    holdings.reduce((sum, holding) => sum + holding.value * (holding.change / 100), 0)
  );

  return {
    total,
    change,
    changePct: total > 0 ? ensureNumber((change / total) * 100) : 0,
    breakdown: holdings,
  };
}

function readInitialState(): DemoPortfolioSeed {
  if (typeof window === "undefined") return cloneSeedState();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return cloneSeedState();

  try {
    return {
      ...cloneSeedState(),
      ...JSON.parse(stored),
    } as DemoPortfolioSeed;
  } catch {
    return cloneSeedState();
  }
}

export function DemoPortfolioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoPortfolioSeed>(readInitialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const buyStock = useCallback((input: BuyStockInput): ActionResult => {
    const amount = ensureNumber(input.amount);
    if (amount <= 0) {
      return { success: false, message: "Enter a valid amount to buy." };
    }

    let result: ActionResult = { success: false, message: "Unable to place order." };

    setState((current) => {
      if (current.kesemCash.balance < amount) {
        result = { success: false, message: "Not enough cash available." };
        return current;
      }

      const existing = current.holdings.find((holding) => holding.ticker === input.ticker);
      const addedUnits = amount / input.pricePerUnit;
      const nextHoldings = existing
        ? current.holdings.map((holding) =>
            holding.ticker === input.ticker
              ? {
                  ...holding,
                  value: ensureNumber(holding.value + amount),
                  units: ensureNumber(holding.units + addedUnits),
                  unitPrice: input.pricePerUnit,
                  change: input.change ?? holding.change,
                }
              : holding
          )
        : [
            {
              ticker: input.ticker,
              name: input.name,
              value: amount,
              change: input.change ?? 0,
              color: input.color,
              unitPrice: input.pricePerUnit,
              units: ensureNumber(addedUnits),
            },
            ...current.holdings,
          ];

      result = {
        success: true,
        message: `Bought ${input.ticker} for ₪${amount.toLocaleString("en-IL", {
          minimumFractionDigits: 2,
        })}.`,
        amount,
      };

      return {
        ...current,
        holdings: nextHoldings,
        kesemCash: {
          ...current.kesemCash,
          balance: ensureNumber(current.kesemCash.balance - amount),
        },
        activity: [
          createActivity(`Bought ${input.ticker}`, -amount, "trade", "debit"),
          ...current.activity,
        ],
      };
    });

    return result;
  }, []);

  const sellHolding = useCallback((input: SellHoldingInput): ActionResult => {
    const requestedAmount = ensureNumber(input.amount);
    if (requestedAmount <= 0) {
      return { success: false, message: "Enter a valid amount to sell." };
    }

    let result: ActionResult = { success: false, message: "Holding not found." };

    setState((current) => {
      const holding = current.holdings.find((item) => item.ticker === input.ticker);
      if (!holding) {
        result = { success: false, message: "Holding not found." };
        return current;
      }

      const amount = Math.min(requestedAmount, holding.value);
      const unitsSold = holding.unitPrice > 0 ? amount / holding.unitPrice : 0;
      const nextHoldings = current.holdings
        .map((item) =>
          item.ticker === input.ticker
            ? {
                ...item,
                value: ensureNumber(item.value - amount),
                units: ensureNumber(Math.max(item.units - unitsSold, 0)),
              }
            : item
        )
        .filter((item) => item.value > 0.01);

      result = {
        success: true,
        message: `Sold ${input.ticker} for ₪${amount.toLocaleString("en-IL", {
          minimumFractionDigits: 2,
        })}.`,
        amount,
      };

      return {
        ...current,
        holdings: nextHoldings,
        kesemCash: {
          ...current.kesemCash,
          balance: ensureNumber(current.kesemCash.balance + amount),
        },
        activity: [
          createActivity(`Sold ${input.ticker}`, amount, "trade", "credit"),
          ...current.activity,
        ],
      };
    });

    return result;
  }, []);

  const investInManagedFund = useCallback(
    (input: ManagedFundInvestmentInput): ActionResult => {
      const amount = ensureNumber(input.amount);
      if (amount <= 0) {
        return { success: false, message: "Enter a valid amount to invest." };
      }

      let result: ActionResult = { success: false, message: "Fund not found." };

      setState((current) => {
        const fund = MANAGED_FUND_MAP.get(input.fundId);
        if (!fund) {
          result = { success: false, message: "Fund not found." };
          return current;
        }

        if (current.kesemCash.balance < amount) {
          result = { success: false, message: "Not enough cash available." };
          return current;
        }

        const nextAllocations = current.managedAllocations.map((allocation) =>
          allocation.fundId === input.fundId
            ? {
                ...allocation,
                investedAmount: ensureNumber(allocation.investedAmount + amount),
              }
            : allocation
        );

        result = {
          success: true,
          message: `Invested ₪${amount.toLocaleString("en-IL")} in ${fund.name}.`,
          amount,
        };

        return {
          ...current,
          managedAllocations: nextAllocations,
          kesemCash: {
            ...current.kesemCash,
            balance: ensureNumber(current.kesemCash.balance - amount),
          },
          activity: [
            createActivity(`Managed fund — ${fund.name}`, -amount, "managed", "debit"),
            ...current.activity,
          ],
        };
      });

      return result;
    },
    []
  );

  const transferToSavingsGoal = useCallback((input: SavingsTransferInput): ActionResult => {
    const requestedAmount = ensureNumber(input.amount);
    if (requestedAmount <= 0) {
      return { success: false, message: "Enter a valid savings amount." };
    }

    let result: ActionResult = { success: false, message: "Savings goal not found." };

    setState((current) => {
      const goal = current.savingsGoals.find((item) => item.id === input.goalId);
      if (!goal) {
        result = { success: false, message: "Savings goal not found." };
        return current;
      }

      if (current.kesemCash.balance <= 0) {
        result = { success: false, message: "Not enough cash available." };
        return current;
      }

      const remaining = Math.max(goal.target - goal.current, 0);
      const amount = Math.min(requestedAmount, remaining, current.kesemCash.balance);
      if (amount <= 0) {
        result = { success: false, message: `${goal.nameEn} is already fully funded.` };
        return current;
      }

      const nextGoals = current.savingsGoals.map((item) =>
        item.id === input.goalId
          ? {
              ...item,
              current: ensureNumber(Math.min(item.current + amount, item.target)),
            }
          : item
      );

      result = {
        success: true,
        message: `Moved ₪${amount.toLocaleString("en-IL")} to ${goal.nameEn}.`,
        amount,
      };

      return {
        ...current,
        savingsGoals: nextGoals,
        kesemCash: {
          ...current.kesemCash,
          balance: ensureNumber(current.kesemCash.balance - amount),
        },
        activity: [
          createActivity(`Savings transfer — ${goal.nameEn}`, -amount, "savings", "debit"),
          ...current.activity,
        ],
      };
    });

    return result;
  }, []);

  const sendCash = useCallback((input: CashTransferInput): ActionResult => {
    const requestedAmount = ensureNumber(input.amount);
    if (requestedAmount <= 0) {
      return { success: false, message: "Enter a valid amount to send." };
    }

    let result: ActionResult = { success: false, message: "Unable to send cash." };

    setState((current) => {
      if (current.kesemCash.balance <= 0) {
        result = { success: false, message: "Not enough cash available." };
        return current;
      }

      const amount = Math.min(requestedAmount, current.kesemCash.balance);
      const recipient = input.counterparty ?? "your contact";
      result = {
        success: true,
        message: `Sent ₪${amount.toLocaleString("en-IL")} to ${recipient}.`,
        amount,
      };

      return {
        ...current,
        kesemCash: {
          ...current.kesemCash,
          balance: ensureNumber(current.kesemCash.balance - amount),
        },
        activity: [
          createActivity(`Sent cash — ${recipient}`, -amount, "transfer", "debit"),
          ...current.activity,
        ],
      };
    });

    return result;
  }, []);

  const receiveCash = useCallback((input: CashTransferInput): ActionResult => {
    const amount = ensureNumber(input.amount);
    if (amount <= 0) {
      return { success: false, message: "Enter a valid amount to receive." };
    }

    const sender = input.counterparty ?? "your contact";
    setState((current) => ({
      ...current,
      kesemCash: {
        ...current.kesemCash,
        balance: ensureNumber(current.kesemCash.balance + amount),
      },
      activity: [
        createActivity(`Received cash — ${sender}`, amount, "transfer", "credit"),
        ...current.activity,
      ],
    }));

    return {
      success: true,
      message: `Received ₪${amount.toLocaleString("en-IL")} from ${sender}.`,
      amount,
    };
  }, []);

  const addSavingsGoal = useCallback((goal: AddSavingsGoalInput): ActionResult => {
    const target = ensureNumber(goal.target);
    if (!goal.nameEn || target <= 0) {
      return { success: false, message: "Add a name and target for the new goal." };
    }

    const nextGoal: SavingsGoal = {
      ...goal,
      id: goal.id ?? `goal-${Date.now()}`,
      target,
      current: ensureNumber(goal.current),
      months: goal.months || 12,
    };

    setState((current) => ({
      ...current,
      savingsGoals: [...current.savingsGoals, nextGoal],
      activity: [
        createActivity(`Created goal — ${nextGoal.nameEn}`, 0, "savings", "credit"),
        ...current.activity,
      ],
    }));

    return {
      success: true,
      message: `Created a new goal for ${nextGoal.nameEn}.`,
    };
  }, []);

  const toggleNotifications = useCallback(() => {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        notificationsEnabled: !current.profile.notificationsEnabled,
      },
    }));
  }, []);

  const resetDemoPortfolio = useCallback(() => {
    setState(cloneSeedState());
  }, []);

  const portfolio = useMemo(
    () => computePortfolioSummary(state.holdings, state.managedAllocations),
    [state.holdings, state.managedAllocations]
  );

  const managedAllocationSummary = useMemo(
    () =>
      state.managedAllocations.map((allocation) => ({
        ...allocation,
        fund: MANAGED_FUND_MAP.get(allocation.fundId)!,
      })),
    [state.managedAllocations]
  );

  const value = useMemo<DemoPortfolioContextValue>(
    () => ({
      cashAccount: state.kesemCash,
      holdings: state.holdings,
      savingsGoals: state.savingsGoals,
      activity: state.activity,
      managedAllocations: managedAllocationSummary,
      managedFunds,
      profile: state.profile,
      portfolio,
      buyStock,
      sellHolding,
      investInManagedFund,
      transferToSavingsGoal,
      sendCash,
      receiveCash,
      addSavingsGoal,
      toggleNotifications,
      resetDemoPortfolio,
    }),
    [
      addSavingsGoal,
      buyStock,
      investInManagedFund,
      managedAllocationSummary,
      portfolio,
      receiveCash,
      sellHolding,
      sendCash,
      state.activity,
      state.holdings,
      state.kesemCash,
      state.profile,
      state.savingsGoals,
      toggleNotifications,
      transferToSavingsGoal,
      resetDemoPortfolio,
    ]
  );

  return (
    <DemoPortfolioContext.Provider value={value}>
      {children}
    </DemoPortfolioContext.Provider>
  );
}

export function useDemoPortfolio() {
  const context = useContext(DemoPortfolioContext);
  if (!context) {
    throw new Error("useDemoPortfolio must be used within DemoPortfolioProvider");
  }

  return context;
}
