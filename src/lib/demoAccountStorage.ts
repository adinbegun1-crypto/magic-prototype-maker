export type DemoPortfolioItem = {
  name: string;
  ticker: string;
  value: number;
  change: number;
  color: string;
};

export type DemoPortfolio = {
  total: number;
  change: number;
  changePct: number;
  breakdown: DemoPortfolioItem[];
};

export type DemoSavingsGoal = {
  name: string;
  nameEn: string;
  target: number;
  current: number;
  emoji: string;
  months: number;
};

export type DemoTransaction = {
  desc: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  category: "dividend" | "invest" | "savings" | "spend" | "salary";
};

export type DemoKesemCash = {
  balance: number;
  accountNumber: string;
  interestRate: number;
  interestEarnedMonth: number;
  cardHolder: string;
  cardType: string;
  color1: string;
  color2: string;
};

export type DemoUserProfile = {
  id: string;
  fullName: string;
  email: string;
  memberSince: string;
  riskProfile: string;
  language: string;
  currency: string;
  linkedBankAccount: string;
  verified: boolean;
};

export type DemoUserRecord = {
  profile: DemoUserProfile;
  portfolio: DemoPortfolio;
  savings: DemoSavingsGoal[];
  transactions: DemoTransaction[];
  kesemCash: DemoKesemCash;
};

const USERS_KEY = "kesem.demo.users";
const CURRENT_USER_KEY = "kesem.demo.currentUser";

const starterPortfolioBreakdown: DemoPortfolioItem[] = [
  { name: "Tel Aviv 125", ticker: "TA125", value: 18400, change: 1.8, color: "#2D6A4F" },
  { name: "S&P 500 ETF", ticker: "SPY", value: 15200, change: 3.1, color: "#40916C" },
  { name: "Technology", ticker: "TECH", value: 9100, change: 4.2, color: "#52B788" },
  { name: "Bonds", ticker: "BOND", value: 5620.5, change: -0.3, color: "#B7E4C7" },
];

const starterSavings: DemoSavingsGoal[] = [
  { name: "דירה ראשונה", nameEn: "First Apartment", target: 200000, current: 62400, emoji: "🏠", months: 18 },
  { name: "חופשה", nameEn: "Vacation", target: 15000, current: 9800, emoji: "✈️", months: 3 },
  { name: "חירום", nameEn: "Emergency Fund", target: 50000, current: 50000, emoji: "🛡️", months: 0 },
];

const starterTransactions: DemoTransaction[] = [
  { desc: "Dividend — TA125", amount: 142.5, date: "Today", type: "credit", category: "dividend" },
  { desc: "Auto-invest", amount: -500, date: "Yesterday", type: "debit", category: "invest" },
  { desc: "Savings transfer", amount: -1000, date: "Mar 15", type: "debit", category: "savings" },
  { desc: "Dividend — SPY", amount: 88.2, date: "Mar 12", type: "credit", category: "dividend" },
  { desc: "Coffee — Aroma", amount: -18.5, date: "Mar 12", type: "debit", category: "spend" },
  { desc: "Salary deposit", amount: 12400, date: "Mar 10", type: "credit", category: "salary" },
  { desc: "Supermarket", amount: -320, date: "Mar 9", type: "debit", category: "spend" },
  { desc: "Netflix", amount: -49.9, date: "Mar 8", type: "debit", category: "spend" },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readUsers(): Record<string, DemoUserRecord> {
  if (!canUseStorage()) return {};

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, DemoUserRecord>;
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, DemoUserRecord>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function listDemoUsers() {
  return Object.values(readUsers()).sort((a, b) => a.profile.fullName.localeCompare(b.profile.fullName));
}

export function getCurrentDemoUserId() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

function setCurrentDemoUserId(userId: string | null) {
  if (!canUseStorage()) return;

  if (userId) {
    window.localStorage.setItem(CURRENT_USER_KEY, userId);
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentDemoUser() {
  const currentUserId = getCurrentDemoUserId();
  if (!currentUserId) return null;

  const users = readUsers();
  return users[currentUserId] ?? null;
}

function makeUserId(email: string) {
  return email.trim().toLowerCase();
}

function titleCaseName(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function makeAccountNumber(email: string) {
  const digits = email
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
    .toString()
    .padStart(4, "0")
    .slice(-4);

  return `**** ${digits}`;
}

function makeStarterUser(fullName: string, email: string): DemoUserRecord {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = titleCaseName(fullName || normalizedEmail.split("@")[0]);
  const cardHolder = normalizedName.toUpperCase();

  return {
    profile: {
      id: makeUserId(normalizedEmail),
      fullName: normalizedName,
      email: normalizedEmail,
      memberSince: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
      riskProfile: "Balanced",
      language: "English",
      currency: "₪ Israeli Shekel",
      linkedBankAccount: `Bank Hapoalim ••${makeAccountNumber(normalizedEmail).slice(-4)}`,
      verified: true,
    },
    portfolio: {
      total: 48320.5,
      change: 1243.2,
      changePct: 2.64,
      breakdown: starterPortfolioBreakdown.map((item) => ({ ...item })),
    },
    savings: starterSavings.map((goal) => ({ ...goal })),
    transactions: starterTransactions.map((transaction) => ({ ...transaction })),
    kesemCash: {
      balance: 8240,
      accountNumber: makeAccountNumber(normalizedEmail),
      interestRate: 4.8,
      interestEarnedMonth: 32.5,
      cardHolder,
      cardType: "Visa Debit",
      color1: "#1B4332",
      color2: "#2D6A4F",
    },
  };
}

export function signUpDemoUser(fullName: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("Email is required to create a demo account.");
  }

  const userId = makeUserId(normalizedEmail);
  const users = readUsers();
  if (users[userId]) {
    throw new Error("A demo account with this email already exists. Sign in instead.");
  }

  const user = makeStarterUser(fullName, normalizedEmail);
  users[userId] = user;
  writeUsers(users);
  setCurrentDemoUserId(userId);
  return user;
}

export function signInDemoUser(email: string) {
  const userId = makeUserId(email);
  const users = readUsers();
  const user = users[userId];

  if (!user) {
    throw new Error("We couldn't find that demo account. Create one first.");
  }

  setCurrentDemoUserId(userId);
  return user;
}

export function signOutDemoUser() {
  setCurrentDemoUserId(null);
}

export function resetDemoUser(userId: string) {
  const users = readUsers();
  const existingUser = users[userId];
  if (!existingUser) return null;

  const resetUser = makeStarterUser(existingUser.profile.fullName, existingUser.profile.email);
  resetUser.profile.memberSince = existingUser.profile.memberSince;
  users[userId] = resetUser;
  writeUsers(users);
  return resetUser;
}

export function updateDemoUser(userId: string, updater: (user: DemoUserRecord) => DemoUserRecord) {
  const users = readUsers();
  const existingUser = users[userId];
  if (!existingUser) return null;

  const updatedUser = updater(existingUser);
  users[userId] = updatedUser;
  writeUsers(users);
  return updatedUser;
}

export function getUserInitials(fullName: string) {
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "K";
}
