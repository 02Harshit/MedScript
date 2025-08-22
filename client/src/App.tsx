import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import PatientManagement from "@/pages/patient-management";
import PrescriptionCreation from "@/pages/prescription-creation";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/components/dashboard-layout";
import { useQuery } from "@tanstack/react-query";

function AuthenticatedRoutes() {
  const { data: currentDoctor, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-gray">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  if (!currentDoctor) {
    return (
      <Switch>
        <Route path="/register" component={Register} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <DashboardLayout doctor={(currentDoctor as any).doctor}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/patients" component={PatientManagement} />
        <Route path="/prescriptions/new" component={PrescriptionCreation} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthenticatedRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
