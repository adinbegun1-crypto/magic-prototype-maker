import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { currentUser, isAuthenticated, signIn, signInAsDemo, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("adin@email.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const destination = useMemo(
    () => (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/",
    [location.state],
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [destination, isAuthenticated, navigate]);

  if (currentUser) {
    return <Navigate to={destination} replace />;
  }

  const validate = () => {
    let isValid = true;
    setError("");
    setResetMessage("");

    if (!emailPattern.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim().length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const result = signIn({ email, password });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(destination, { replace: true });
  };

  const handleDemoLogin = () => {
    signInAsDemo();
    navigate(destination, { replace: true });
  };

  const handleForgotPassword = () => {
    setError("");

    if (!emailPattern.test(email.trim())) {
      setEmailError("Enter your account email to view demo reset instructions.");
      setResetMessage("");
      return;
    }

    const result = requestPasswordReset(email);
    if (!result.ok) {
      setResetMessage("");
      setError(result.error);
      return;
    }

    setEmailError("");
    setResetMessage(result.message);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl border-border/60 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
            K
          </div>
          <CardTitle className="font-display text-3xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to continue to your Kesem dashboard. Use <span className="font-medium">adin@email.com</span> / <span className="font-medium">demo123</span> or try demo mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="login-email">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(emailError)}
              />
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-foreground" htmlFor="login-password">
                  Password
                </label>
                <button
                  className="text-xs font-medium text-primary-mid underline-offset-4 hover:underline"
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                aria-invalid={Boolean(passwordError)}
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>

            {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            {resetMessage && <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">{resetMessage}</p>}

            <Button className="w-full rounded-2xl" size="lg" type="submit">
              Sign in
            </Button>
          </form>

          <Button className="w-full rounded-2xl" size="lg" type="button" variant="secondary" onClick={handleDemoLogin}>
            Continue in demo mode
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-primary-mid underline-offset-4 hover:underline" to="/signup">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
