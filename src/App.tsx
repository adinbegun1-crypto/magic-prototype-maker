import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ProtectedRoute() {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-3xl bg-card px-8 py-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Restoring your Kesem session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function AuthRedirect({ children }: { children: ReactElement }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-3xl bg-card px-8 py-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Loading authentication…</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
            <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
