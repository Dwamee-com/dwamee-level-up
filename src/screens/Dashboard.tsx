import { motion } from 'framer-motion';
import { Flame, MapPin, Trophy, Gift, User, ChevronRight, Zap, Shield } from 'lucide-react';
import { currentEmployee, allEmployees } from '@/data/mockData';
import { getLevelTitle, getRequiredXP, getShieldEmoji, getShieldColor } from '@/data/models';

interface DashboardProps {
  onNavigate: (tab: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const emp = currentEmployee;
  const xpForLevel = getRequiredXP(emp.level);
  const xpProgress = (emp.xp % xpForLevel) / xpForLevel;
  const currentXPInLevel = emp.xp % xpForLevel;
  const title = getLevelTitle(emp.level);

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back</p>
          <h1 className="text-2xl font-bold font-display">{emp.name}</h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-lg font-bold text-primary">
          {emp.name.charAt(0)}
        </div>
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-5 glow-primary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-gradient-primary font-display">{emp.level}</span>
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">Level</p>
            <h2 className="text-xl font-bold font-display">{title}</h2>
          </div>
          <div className="text-right">
            <span className={`text-2xl ${getShieldColor(emp.shieldType)}`}>
              {getShieldEmoji(emp.shieldType)}
            </span>
            <p className="text-xs text-muted-foreground capitalize mt-1">{emp.shieldType} Shield</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-accent" />{currentXPInLevel} XP</span>
            <span>{xpForLevel} XP</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full relative"
              style={{
                background: 'linear-gradient(90deg, hsl(207 75% 40%), hsl(207 75% 55%), hsl(43 90% 55%))',
              }}
            >
              <div className="absolute inset-0 shimmer rounded-full" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-3 text-center"
        >
          <div className="flex justify-center mb-1">
            <Flame className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-xl font-bold font-display">{emp.streak}</p>
          <p className="text-[10px] text-muted-foreground">Day Streak</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-3 text-center"
        >
          <div className="flex justify-center mb-1">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
          <p className="text-xl font-bold font-display">#{emp.rank}</p>
          <p className="text-[10px] text-muted-foreground">Rank</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-3 text-center"
        >
          <div className="flex justify-center mb-1">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xl font-bold font-display">{emp.xp}</p>
          <p className="text-[10px] text-muted-foreground">Total XP</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
        {[
          { icon: MapPin, label: 'View Game Map', desc: 'Explore levels 1-100', tab: 'map', color: 'text-primary' },
          { icon: Trophy, label: 'Rankings', desc: 'See where you stand', tab: 'ranking', color: 'text-accent' },
          { icon: Gift, label: 'Rewards Store', desc: `${emp.pointsBalance} points available`, tab: 'rewards', color: 'text-success' },
          { icon: Shield, label: 'Profile & Badges', desc: `${emp.badges.length} badges earned`, tab: 'profile', color: 'text-platinum' },
        ].map((item, i) => (
          <motion.button
            key={item.tab}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => onNavigate(item.tab)}
            className="w-full glass-card p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* Recent Badges */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Badges</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {emp.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
              className="glass-card p-3 flex-shrink-0 w-20 text-center"
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-[9px] text-muted-foreground mt-1 truncate">{badge.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
