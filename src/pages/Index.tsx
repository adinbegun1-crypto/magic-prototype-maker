import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PortfolioBar } from "@/components/kesem/PortfolioBar";
import { PortfolioTab } from "@/components/kesem/PortfolioTab";
import { ManagedTab } from "@/components/kesem/ManagedTab";
import { SavingsTab } from "@/components/kesem/SavingsTab";
import { ActivityTab } from "@/components/kesem/ActivityTab";
import { AdviceTab } from "@/components/kesem/AdviceTab";
import { ProfileScreen } from "@/components/kesem/ProfileScreen";
import { KesemCashCard } from "@/components/kesem/KesemCashCard";
import { StockSearch } from "@/components/kesem/StockSearch";
import {
  getCurrentDemoUser,
  getUserInitials,
  listDemoUsers,
  resetDemoUser,
  signInDemoUser,
  signOutDemoUser,
  signUpDemoUser,
  updateDemoUser,
  type DemoUserRecord,
} from "@/lib/demoAccountStorage";

const TABS = ["Portfolio", "Managed", "Savings", "Activity", "Stocks"] as const;
type Tab = (typeof TABS)[number];

type Screen = "invest" | "cash" | "advice" | "profile";

type AuthMode = "sign-in" | "sign-up";

const BOTTOM_NAV: { icon: string; label: string; screen: Screen }[] = [
  { icon: "📈", label: "Invest", screen: "invest" },
  { icon: "💳", label: "Cash", screen: "cash" },
  { icon: "💬", label: "Advice", screen: "advice" },
  { icon: "👤", label: "Profile", screen: "profile" },
];

function AuthCard({
  users,
  onSignedIn,
}: {
  users: DemoUserRecord[];
  onSignedIn: (user: DemoUserRecord) => void;
}) {
  const [mode, setMode] = useState<AuthMode>(users.length > 0 ? "sign-in" : "sign-up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(users[0]?.profile.email ?? "");

  function handleSubmit() {
    try {
      const nextUser =
        mode === "sign-up"
          ? signUpDemoUser(fullName, email)
          : signInDemoUser(email);

      onSignedIn(nextUser);
      toast.success(
        mode === "sign-up"
          ? `Demo account ready for ${nextUser.profile.fullName}`
          : `Welcome back, ${nextUser.profile.fullName}`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-[390px] space-y-4">
        <div className="rounded-[32px] bg-primary text-white p-7 shadow-sm overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-5 w-52 h-52 rounded-full bg-white/[0.03]" />
          <p className="text-[12px] uppercase tracking-[0.3em] text-white/60 mb-2 relative z-10">Kesem demo</p>
          <h1 className="font-display text-[30px] leading-tight relative z-10">
            Make every sign-in feel like a separate investor.
          </h1>
          <p className="text-sm text-white/70 mt-3 relative z-10">
            Create a demo identity with its own portfolio, or sign back into an existing saved account.
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex gap-1 bg-secondary rounded-xl p-1">
            {[
              { key: "sign-in", label: "Sign in" },
              { key: "sign-up", label: "Sign up" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setMode(option.key as AuthMode)}
                className="flex-1 py-2 rounded-[10px] text-xs font-medium transition-all duration-200"
                style={{
                  color: mode === option.key ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  background: mode === option.key ? "white" : "transparent",
                  boxShadow: mode === option.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {mode === "sign-up" && (
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Adin Cohen"
                className="mt-1.5 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-primary-mid/40"
              />
            </label>
          )}

          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="adin@email.com"
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-primary-mid/40"
            />
          </label>

          {users.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Saved demo accounts</p>
              <div className="flex flex-wrap gap-2">
                {users.map((user) => (
                  <button
                    key={user.profile.id}
                    onClick={() => setEmail(user.profile.email)}
                    className="rounded-full bg-primary-wash px-3 py-1.5 text-xs font-medium text-primary-mid hover:opacity-80"
                  >
                    {user.profile.fullName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
            style={{ background: "hsl(var(--primary))" }}
          >
            {mode === "sign-up" ? "Create demo account" : "Continue to portfolio"}
          </button>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Demo accounts stay in this browser&apos;s local storage until you explicitly reset one.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("Portfolio");
  const [activeScreen, setActiveScreen] = useState<Screen>("invest");
  const [currentUser, setCurrentUser] = useState<DemoUserRecord | null>(() => getCurrentDemoUser());
  const [savedUsers, setSavedUsers] = useState<DemoUserRecord[]>(() => listDemoUsers());

  const initials = useMemo(
    () => getUserInitials(currentUser?.profile.fullName ?? ""),
    [currentUser?.profile.fullName]
  );

  if (!currentUser) {
    return (
      <AuthCard
        users={savedUsers}
        onSignedIn={(user) => {
          setCurrentUser(user);
          setSavedUsers(listDemoUsers());
        }}
      />
    );
  }

  const { portfolio, kesemCash, transactions, savings, profile } = currentUser;
  const firstName = profile.fullName.split(" ")[0];
  const showInvest = activeScreen === "invest";

  function updateCurrentUser(updater: (user: DemoUserRecord) => DemoUserRecord) {
    const updatedUser = updateDemoUser(profile.id, updater);
    if (!updatedUser) return;

    setCurrentUser(updatedUser);
    setSavedUsers(listDemoUsers());
  }

  function handleResetAccount() {
    const resetUser = resetDemoUser(profile.id);
    if (!resetUser) return;

    setCurrentUser(resetUser);
    setSavedUsers(listDemoUsers());
    setActiveScreen("invest");
    setActiveTab("Portfolio");
    toast.success(`Reset ${resetUser.profile.fullName}'s demo account.`);
  }

  function handleLogout() {
    signOutDemoUser();
    setCurrentUser(null);
    setSavedUsers(listDemoUsers());
    setActiveScreen("invest");
    setActiveTab("Portfolio");
    toast.success("Signed out. Your demo account is still saved on this browser.");
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-[390px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[13px] text-muted-foreground tracking-widest uppercase mb-0.5">
              {activeScreen === "invest"
                ? "Good morning"
                : activeScreen === "cash"
                  ? "Kesem Cash"
                  : activeScreen === "advice"
                    ? "Your Insights"
                    : "Your Account"}
            </p>
            <h1 className="font-display text-[22px] text-foreground">
              {activeScreen === "invest"
                ? `${firstName} 👋`
                : activeScreen === "cash"
                  ? `₪${kesemCash.balance.toLocaleString("en-IL", { minimumFractionDigits: 2 })}`
                  : activeScreen === "advice"
                    ? "What's new 🔍"
                    : profile.fullName}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-mid text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
        </div>

        {showInvest && (
          <>
            <div className="relative rounded-3xl p-7 mb-6 text-white overflow-hidden bg-primary">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.04]" />
              <div className="absolute -bottom-16 -left-5 w-52 h-52 rounded-full bg-white/[0.03]" />

              <p className="text-[12px] opacity-60 tracking-widest uppercase mb-1.5 relative z-10">
                {firstName}&apos;s Portfolio
              </p>
              <p className="font-display text-[38px] tracking-tight mb-2 relative z-10">
                ₪{portfolio.total.toLocaleString("en-IL", { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2 relative z-10">
                <span className="bg-white/10 text-primary-pale text-xs font-semibold px-3 py-1 rounded-full">
                  +₪{portfolio.change.toLocaleString()} ({portfolio.changePct}%)
                </span>
                <span className="text-xs opacity-50">this month</span>
              </div>

              <div className="mt-6 relative z-10">
                <PortfolioBar items={portfolio.breakdown} />
              </div>
              <div className="flex gap-3 mt-3 relative z-10">
                {portfolio.breakdown.map((item) => (
                  <div key={item.ticker} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[10px] opacity-60">{item.ticker}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-2 rounded-[10px] text-xs font-medium transition-all duration-200"
                  style={{
                    color: activeTab === tab ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    background: activeTab === tab ? "white" : "transparent",
                    boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Portfolio" && <PortfolioTab portfolio={portfolio} />}
            {activeTab === "Managed" && <ManagedTab />}
            {activeTab === "Savings" && (
              <SavingsTab
                savings={savings}
                kesemCash={kesemCash}
                onSavingsChange={(nextSavings) =>
                  updateCurrentUser((user) => ({
                    ...user,
                    savings: nextSavings,
                  }))
                }
              />
            )}
            {activeTab === "Activity" && <ActivityTab transactions={transactions} />}
            {activeTab === "Stocks" && <StockSearch />}
          </>
        )}

        {activeScreen === "cash" && (
          <KesemCashCard kesemCash={kesemCash} transactions={transactions} />
        )}

        {activeScreen === "advice" && <AdviceTab />}

        {activeScreen === "profile" && (
          <ProfileScreen
            profile={profile}
            portfolio={portfolio}
            kesemCash={kesemCash}
            initials={initials}
            onLogout={handleLogout}
            onResetAccount={handleResetAccount}
          />
        )}

        <div className="flex justify-around bg-card rounded-3xl py-3.5 mt-6 shadow-[0_-2px_20px_rgba(0,0,0,0.05)]">
          {BOTTOM_NAV.map(({ icon, label, screen }) => {
            const active = activeScreen === screen;
            return (
              <button
                key={label}
                onClick={() => setActiveScreen(screen)}
                className="flex flex-col items-center gap-1 transition-all duration-200"
                style={{
                  color: active ? "hsl(var(--primary-mid))" : "hsl(var(--muted-foreground))",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[10px]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
