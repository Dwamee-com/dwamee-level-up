import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileShell from "@/components/MobileShell";
import AdminLayout from "@/layouts/AdminLayout";
import AdminOverview from "@/screens/admin/AdminOverview";
import AdminEmployees from "@/screens/admin/AdminEmployees";
import GameMap from "@/screens/GameMap";
import Ranking from "@/screens/Ranking";
import EmployeeOfMonth from "@/screens/EmployeeOfMonth";
import Rewards from "@/screens/Rewards";
import AnnualSalaries from "@/screens/AnnualSalaries";
import Tasks from "@/screens/Tasks";
import Reminders from "@/screens/Reminders";
import Requests from "@/screens/Requests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Mobile App */}
          <Route path="/" element={<MobileShell />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="map" element={<div className="max-w-[500px] mx-auto h-[80vh]"><GameMap /></div>} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="eom" element={<EmployeeOfMonth />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="salaries" element={<AnnualSalaries />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="requests" element={<Requests />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="employees" element={<AdminEmployees />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
