import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { currentUser, isAuthenticated, signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    let isValid = true;
    setError("");

    if (name.trim().length < 2) {
      setNameError("Enter your full name.");
      isValid = false;
    } else {
      setNameError("");
    }

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

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords must match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const result = signUp({ name, email, password });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl border-border/60 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
            ✨
          </div>
          <CardTitle className="font-display text-3xl">Create your account</CardTitle>
          <CardDescription>Set up a local demo account to unlock the Kesem dashboard after refresh.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="signup-name">
                Full name
              </label>
              <Input
                id="signup-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jamie Investor"
                aria-invalid={Boolean(nameError)}
              />
              {nameError && <p className="text-sm text-destructive">{nameError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="signup-email">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(emailError)}
              />
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="signup-password">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                aria-invalid={Boolean(passwordError)}
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="signup-confirm-password">
                Confirm password
              </label>
              <Input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                aria-invalid={Boolean(confirmPasswordError)}
              />
              {confirmPasswordError && <p className="text-sm text-destructive">{confirmPasswordError}</p>}
            </div>

            {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <Button className="w-full rounded-2xl" size="lg" type="submit">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary-mid underline-offset-4 hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
