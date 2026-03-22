import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockData } from "@/data/kesemData";

const supportSection = {
  title: "Support",
  items: [
    { icon: "💬", label: "Chat with us", sub: "Avg. reply in 2 min" },
    { icon: "📄", label: "Documents & Tax", sub: "Statements, reports" },
    { icon: "ℹ️", label: "About Kesem", sub: "Version 1.0.0" },
  ],
};

export function ProfileScreen() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const { kesemCash, portfolio } = mockData;
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="animate-fade-up space-y-5">
      <div className="bg-card rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold font-display flex-shrink-0">
          {currentUser?.initials ?? "K"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground">{currentUser?.name ?? "Kesem Member"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{currentUser?.email ?? "member@kesem.app"}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-primary-wash text-primary-mid text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {currentUser?.mode === "demo" ? "Demo Mode" : "Verified ✓"}
            </span>
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
          { label: "Member since", value: currentUser?.memberSince ?? "Recently" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-3 text-center shadow-sm">
            <p className="text-sm font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
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
          onClick={toggleNotifications}
          className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{
            background: profile.notificationsEnabled ? "hsl(var(--primary-mid))" : "hsl(var(--muted))",
          }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
            style={{ left: profile.notificationsEnabled ? "calc(100% - 22px)" : "2px" }}
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
                  <p className="text-xs text-muted-foreground">
                    {item.label === "Risk Profile" ? profile.riskProfile : item.sub}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs">›</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        className="w-full py-3.5 bg-card text-destructive border border-destructive/20 rounded-2xl text-sm font-semibold hover:bg-destructive/5 transition-colors duration-200 shadow-sm"
        onClick={handleLogout}
        type="button"
      >
        Log out
      </button>

      <div className="h-4" />
    </div>
  );
}
