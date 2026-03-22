import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthMode = "registered" | "demo";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  memberSince: string;
  mode: AuthMode;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  name: string;
}

interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (payload: SignInPayload) => { ok: true } | { ok: false; error: string };
  signUp: (payload: SignUpPayload) => { ok: true } | { ok: false; error: string };
  signInAsDemo: () => void;
  signOut: () => void;
  requestPasswordReset: (email: string) => { ok: true; message: string } | { ok: false; error: string };
}

const STORAGE_KEYS = {
  users: "kesem-auth-users",
  session: "kesem-auth-session",
};

const seedUsers = (): StoredUser[] => [
  {
    id: "seed-adin",
    name: "Adin Cohen",
    email: "adin@email.com",
    password: "demo123",
    initials: "AC",
    memberSince: "Jan 2023",
    mode: "registered",
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

const deriveInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sanitizeUser = ({ password: _password, ...user }: StoredUser): AuthUser => user;

function readStoredUsers(): StoredUser[] {
  if (!isBrowser) {
    return seedUsers();
  }

  const rawUsers = window.localStorage.getItem(STORAGE_KEYS.users);

  if (!rawUsers) {
    const users = seedUsers();
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    return users;
  }

  try {
    const parsed = JSON.parse(rawUsers) as StoredUser[];
    return parsed.length > 0 ? parsed : seedUsers();
  } catch {
    const users = seedUsers();
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    return users;
  }
}

function persistUsers(users: StoredUser[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function persistSession(user: AuthUser | null) {
  if (!isBrowser) return;

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}

function readStoredSession(): AuthUser | null {
  if (!isBrowser) return null;

  const rawSession = window.localStorage.getItem(STORAGE_KEYS.session);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthUser;
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUsers = readStoredUsers();
    const storedSession = readStoredSession();

    setUsers(storedUsers);

    if (storedSession?.mode === "registered") {
      const matchedUser = storedUsers.find((user) => user.id === storedSession.id);
      setCurrentUser(matchedUser ? sanitizeUser(matchedUser) : null);
    } else {
      setCurrentUser(storedSession);
    }

    setIsReady(true);
  }, []);

  const commitUserSession = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
    persistSession(user);
  }, []);

  const signIn = useCallback(
    ({ email, password }: SignInPayload) => {
      const normalizedEmail = normalizeEmail(email);
      const matchedUser = users.find((user) => user.email === normalizedEmail);

      if (!matchedUser) {
        return { ok: false as const, error: "We couldn't find an account with that email." };
      }

      if (matchedUser.password !== password) {
        return { ok: false as const, error: "That password doesn't match our demo account." };
      }

      commitUserSession(sanitizeUser(matchedUser));
      return { ok: true as const };
    },
    [commitUserSession, users],
  );

  const signUp = useCallback(
    ({ name, email, password }: SignUpPayload) => {
      const normalizedEmail = normalizeEmail(email);

      if (users.some((user) => user.email === normalizedEmail)) {
        return { ok: false as const, error: "An account with that email already exists." };
      }

      const nextUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        initials: deriveInitials(name),
        memberSince: new Intl.DateTimeFormat("en-US", {
          month: "short",
          year: "numeric",
        }).format(new Date()),
        mode: "registered",
      };

      const nextUsers = [...users, nextUser];
      setUsers(nextUsers);
      persistUsers(nextUsers);
      commitUserSession(sanitizeUser(nextUser));

      return { ok: true as const };
    },
    [commitUserSession, users],
  );

  const signInAsDemo = useCallback(() => {
    const demoUser: AuthUser = {
      id: "demo-user",
      name: "Demo Investor",
      email: "demo@kesem.app",
      initials: "DI",
      memberSince: "Today",
      mode: "demo",
    };

    commitUserSession(demoUser);
  }, [commitUserSession]);

  const signOut = useCallback(() => {
    commitUserSession(null);
  }, [commitUserSession]);

  const requestPasswordReset = useCallback(
    (email: string) => {
      const normalizedEmail = normalizeEmail(email);
      const matchedUser = users.find((user) => user.email === normalizedEmail);

      if (!matchedUser) {
        return { ok: false as const, error: "We couldn't find a demo account with that email." };
      }

      return {
        ok: true as const,
        message: `Password reset is disabled in demo mode. Try signing in with ${matchedUser.email} / ${matchedUser.password}.`,
      };
    },
    [users],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isReady,
      signIn,
      signUp,
      signInAsDemo,
      signOut,
      requestPasswordReset,
    }),
    [currentUser, isReady, requestPasswordReset, signIn, signInAsDemo, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
