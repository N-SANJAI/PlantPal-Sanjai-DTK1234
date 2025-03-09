import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";

// Pages
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Scan from "@/pages/Scan";
import Social from "@/pages/Social";
import Profile from "@/pages/Profile";
import Analysis from "@/pages/Analysis";
import CareRecommendations from "@/pages/CareRecommendations";
import Achievements from "@/pages/Achievements";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/scan" component={Scan} />
      <Route path="/social" component={Social} />
      <Route path="/profile" component={Profile} />
      <Route path="/analysis/:plantId" component={Analysis} />
      <Route path="/care/:plantId" component={CareRecommendations} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/notifications" component={Notifications} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
