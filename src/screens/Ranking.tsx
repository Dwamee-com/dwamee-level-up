import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { allEmployees, currentEmployee } from '@/data/mockData';
import { getLevelTitle, getShieldEmoji } from '@/data/models';

const rankTabs = ['Monthly', 'Level', 'Team'] as const;
const departments = ['All', 'Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Sales'];

export default function Ranking() {
  const [tab, setTab] = useState<typeof rankTabs[number]>('Monthly');
  const [dept, setDept] = useState('All');

  const sorted = useMemo(() => {
    let list = [...allEmployees];
    if (dept !== 'All') list = list.filter(e => e.department === dept);
    switch (tab) {
      case 'Monthly': return list.sort((a, b) => b.xp - a.xp);
      case 'Level': return list.sort((a, b) => b.level - a.level);
      case 'Team': return list.sort((a, b) => b.streak - a.streak);
    }
  }, [tab, dept]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <h1 className="text-2xl font-bold font-display">Rankings</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {rankTabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Department Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {departments.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              dept === d ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {sorted.length >= 3 && (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
          {[1, 0, 2].map(idx => {
            const emp = sorted[idx];
            const isFirst = idx === 0;
            return (
              <motion.div
                key={emp.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.15 }}
                className={`flex flex-col items-center ${isFirst ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
              >
                <span className="text-2xl mb-1">{medals[idx]}</span>
                <div className={`${isFirst ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-primary/10 border-2 ${isFirst ? 'border-accent glow-gold' : 'border-primary/30'} flex items-center justify-center text-lg font-bold`}>
                  {emp.name.charAt(0)}
                </div>
                <p className="text-xs font-semibold mt-2 text-center truncate max-w-[80px]">{emp.name.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground">Lv {emp.level}</p>
                <div className={`mt-1 ${isFirst ? 'h-20' : idx === 1 ? 'h-14' : 'h-10'} w-16 rounded-t-lg bg-primary/5 border border-primary/15 flex items-center justify-center`}>
                  <span className="text-xs font-bold text-primary">{emp.xp} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {sorted.map((emp, i) => {
          const isMe = emp.id === currentEmployee.id;
          return (
            <motion.div
              key={emp.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`glass-card p-3 flex items-center gap-3 ${isMe ? 'border-primary/40 glow-primary' : ''}`}
            >
              <span className="w-6 text-center font-bold text-sm text-muted-foreground">
                {i < 3 ? medals[i] : `${i + 1}`}
              </span>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold">
                {emp.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isMe ? 'text-primary' : ''}`}>
                  {emp.name} {isMe && '(You)'}
                </p>
                <p className="text-[10px] text-muted-foreground">{getLevelTitle(emp.level)} · {emp.department}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{getShieldEmoji(emp.shieldType)} Lv {emp.level}</p>
                <p className="text-[10px] text-muted-foreground">{emp.xp} XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
