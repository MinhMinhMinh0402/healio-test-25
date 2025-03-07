import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import AIDiagnosis from "@/pages/ai-diagnosis";
import HealthRecords from "@/pages/health-records";
import Appointments from "@/pages/appointments";
import Profile from "@/pages/profile";

// Get base path from the environment
const getBasePath = () => {
  return window.location.pathname.includes('/healio-test-25') 
    ? '/healio-test-25'
    : '';
};

// Create a custom hook for base path routing
const useBasePath = (path: string) => `${getBasePath()}${path}`;

function AppRouter() {
  return (
    <Switch>
      <Route path={useBasePath("/auth")} component={AuthPage} />
      <ProtectedRoute path={useBasePath("/")} component={Dashboard} />
      <ProtectedRoute path={useBasePath("/ai-diagnosis")} component={AIDiagnosis} />
      <ProtectedRoute path={useBasePath("/health-records")} component={HealthRecords} />
      <ProtectedRoute path={useBasePath("/appointments")} component={Appointments} />
      <ProtectedRoute path={useBasePath("/profile")} component={Profile} />
      <Route path={useBasePath("*")} component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = getBasePath();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router base={basePath}>
          <AppRouter />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;