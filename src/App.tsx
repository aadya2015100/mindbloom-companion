import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import FocusMode from "./pages/FocusMode";
import TaskBreakdown from "./pages/TaskBreakdown";
import RoutineBuilder from "./pages/RoutineBuilder";
import BreathingExercise from "./pages/BreathingExercise";
import CommunicationTemplates from "./pages/CommunicationTemplates";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/tasks" element={<TaskBreakdown />} />
            <Route path="/routine" element={<RoutineBuilder />} />
            <Route path="/breathe" element={<BreathingExercise />} />
            <Route path="/communicate" element={<CommunicationTemplates />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
