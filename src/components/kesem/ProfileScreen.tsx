import { useState } from "react";
import type { DemoKesemCash, DemoPortfolio, DemoUserProfile } from "@/lib/demoAccountStorage";

const supportSection = {
  title: "Support",
  items: [
    { icon: "💬", label: "Chat with us", sub: "Avg. reply in 2 min" },
    { icon: "📄", label: "Documents & Tax", sub: "Statements, reports" },
    { icon: "ℹ️", label: "About Kesem", sub: "Version 1.0.0" },
  ],
};

export function ProfileScreen({
  profile,
  portfolio,
  kesemCash,
  initials,
  onLogout,
  onResetAccount,
}: {
  profile: DemoUserProfile;
  portfolio: DemoPortfolio;
  kesemCash: DemoKesemCash;
  initials: string;
  onLogout: () => void;
  onResetAccount: () => void;
}) {
  const [notificationsOn, setNotificationsOn] = useState(true);

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: "🪪", label: "Personal Details", sub: `${profile.fullName} · ${profile.email}` },
        { icon: "🔔", label: "Notifications", sub: "Push, email, SMS" },
        { icon: "🔒", label: "Security", sub: "PIN, biometrics, 2FA" },
        { icon: "🏦", label: "Linked Bank Account", sub: profile.linkedBankAccount },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: "🌍", label: "Language", sub: profile.language },
        { icon: "💱", label: "Currency", sub: profile.currency },
        { icon: "📊", label: "Risk Profile", sub: profile.riskProfile },
      ],
    },
    supportSection,
  ];

  return (
    <div className="animate-fade-up space-y-5">
      <div className="bg-card rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold font-display flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground">{profile.fullName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {profile.verified && (
              <span className="bg-primary-wash text-primary-mid text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                Verified ✓
              </span>
            )}
            <span className="bg-secondary text-muted-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {profile.riskProfile} investor
            </span>
          </div>
        </div>
        <button className="text-xs text-primary-mid font-semibold border border-primary-mid/30 px-3 py-1.5 rounded-xl hover:bg-primary-wash transition-colors">
          Edit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Portfolio", value: `₪${(portfolio.total / 1000).toFixed(1)}K` },
          { label: "Cash balance", value: `₪${(kesemCash.balance / 1000).toFixed(1)}K` },
          { label: "Member since", value: profile.memberSince },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-3 text-center shadow-sm">
            <p className="text-sm font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">🔔</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">Alerts, updates, tips</p>
          </div>
        </div>
        <button
          onClick={() => setNotificationsOn((value) => !value)}
          className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{ background: notificationsOn ? "hsl(var(--primary-mid))" : "hsl(var(--muted))" }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
            style={{ left: notificationsOn ? "calc(100% - 22px)" : "2px" }}
          />
        </button>
      </div>

      {menuSections.map((section) => (
        <div key={section.title}>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
            {section.title}
          </p>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left hover:bg-secondary/50 transition-colors duration-150"
                style={{ borderBottom: i < section.items.length - 1 ? "1px solid hsl(var(--border))" : "none" }}
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <span className="text-muted-foreground text-xs">›</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Demo account
        </p>
        <div className="bg-card rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Reset fake-money portfolio</p>
            <p className="text-xs text-muted-foreground mt-1">
              Restore the original demo balances, holdings, savings goals, and activity for this signed-in account.
            </p>
          </div>
          <button
            onClick={onResetAccount}
            className="w-full py-3 bg-primary-wash text-primary-mid border border-primary-mid/20 rounded-2xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Reset demo account
          </button>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full py-3.5 bg-card text-destructive border border-destructive/20 rounded-2xl text-sm font-semibold hover:bg-destructive/5 transition-colors duration-200 shadow-sm"
      >
        Log out
      </button>

      <div className="h-4" />
    </div>
  );
}
