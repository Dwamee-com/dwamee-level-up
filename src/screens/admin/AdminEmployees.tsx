import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { allEmployees } from '@/data/mockData';
import { getLevelTitle, getShieldEmoji, getRequiredXP } from '@/data/models';

export default function AdminEmployees() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const departments = ['All', ...new Set(allEmployees.map(e => e.department))];

  const filtered = allEmployees
    .filter(e => deptFilter === 'All' || e.department === deptFilter)
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display">Employees</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                deptFilter === d ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp, i) => {
          const xpForLevel = getRequiredXP(emp.level);
          const progress = ((emp.xp % xpForLevel) / xpForLevel) * 100;

          return (
            <motion.div
              key={emp.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-lg font-bold">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.department}</p>
                </div>
                <span className="text-xl">{getShieldEmoji(emp.shieldType)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-secondary rounded-lg py-2">
                  <p className="text-sm font-bold text-primary">{emp.level}</p>
                  <p className="text-[9px] text-muted-foreground">Level</p>
                </div>
                <div className="bg-secondary rounded-lg py-2">
                  <p className="text-sm font-bold">{emp.xp}</p>
                  <p className="text-[9px] text-muted-foreground">XP</p>
                </div>
                <div className="bg-secondary rounded-lg py-2">
                  <p className="text-sm font-bold">🔥 {emp.streak}</p>
                  <p className="text-[9px] text-muted-foreground">Streak</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>{getLevelTitle(emp.level)}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>✅ {emp.stats.onTimeDays} on-time</span>
                <span>❌ {emp.stats.lateDays} late</span>
                <span>⭐ {emp.stats.perfectWeeks} perfect wks</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
