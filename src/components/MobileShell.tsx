import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, Trophy, Gift, User, Award, DollarSign, ClipboardList, Bell, FileText, Navigation } from 'lucide-react';
import Dashboard from '@/screens/Dashboard';
import GameMap from '@/screens/GameMap';
import Ranking from '@/screens/Ranking';
import EmployeeOfMonth from '@/screens/EmployeeOfMonth';
import Rewards from '@/screens/Rewards';
import Profile from '@/screens/Profile';
import AnnualSalaries from '@/screens/AnnualSalaries';
import Tasks from '@/screens/Tasks';
import Reminders from '@/screens/Reminders';
import Requests from '@/screens/Requests';
import Visits from '@/screens/Visits';

const tabs = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'map', icon: Map, label: 'Map' },
  { id: 'ranking', icon: Trophy, label: 'Rank' },
  { id: 'eom', icon: Award, label: 'Star' },
  { id: 'rewards', icon: Gift, label: 'Rewards' },
  { id: 'salaries', icon: DollarSign, label: 'Salary' },
  { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
  { id: 'requests', icon: FileText, label: 'Requests' },
  { id: 'reminders', icon: Bell, label: 'Remind' },
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

type TabId = typeof tabs[number]['id'];

export default function MobileShell() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'map': return <GameMap />;
      case 'ranking': return <Ranking />;
      case 'eom': return <EmployeeOfMonth />;
      case 'rewards': return <Rewards />;
      case 'salaries': return <AnnualSalaries />;
      case 'tasks': return <Tasks />;
      case 'requests': return <Requests />;
      case 'reminders': return <Reminders />;
      case 'profile': return <Profile />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px] bg-background overflow-hidden flex flex-col shadow-2xl border border-border/50 rounded-none sm:rounded-3xl">
        {/* Screen Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full overflow-y-auto no-scrollbar"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <nav className="flex-shrink-0 border-t border-border bg-card">
          <div className="flex items-center justify-around px-1 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className="flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-colors relative z-10 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-medium transition-colors relative z-10 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
