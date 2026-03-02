import { motion } from 'framer-motion';
import { Share2, Calendar, Clock, Award, Zap, Target, TrendingUp } from 'lucide-react';
import { currentEmployee } from '@/data/mockData';
import { getLevelTitle, getRequiredXP, getShieldEmoji, getShieldColor } from '@/data/models';

export default function Profile() {
  const emp = currentEmployee;
  const xpForLevel = getRequiredXP(emp.level);
  const xpProgress = (emp.xp % xpForLevel) / xpForLevel;

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      {/* Profile Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-6 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-3 border-primary mx-auto flex items-center justify-center text-3xl font-bold mb-3">
            {emp.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold font-display">{emp.name}</h2>
          <p className="text-sm text-muted-foreground">{emp.department}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`text-lg ${getShieldColor(emp.shieldType)}`}>{getShieldEmoji(emp.shieldType)}</span>
            <span className="text-sm font-semibold capitalize">{emp.shieldType} Shield</span>
          </div>
        </div>

        {/* Level + XP inline */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level {emp.level} · {getLevelTitle(emp.level)}</span>
            <span className="text-primary font-bold">{emp.xp} XP</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(207 78% 40%), hsl(43 90% 55%))' }}
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-4 w-full py-2.5 rounded-xl bg-secondary text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" /> Share Profile
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Attendance Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Calendar, label: 'On-time Days', value: emp.stats.onTimeDays, color: 'text-primary' },
            { icon: Clock, label: 'Late Days', value: emp.stats.lateDays, color: 'text-destructive' },
            { icon: Award, label: 'Perfect Weeks', value: emp.stats.perfectWeeks, color: 'text-accent' },
            { icon: TrendingUp, label: 'Total Days', value: emp.stats.totalDays, color: 'text-primary' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card p-3"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold font-display">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Badges ({emp.badges.length})
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {emp.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}
              className="glass-card p-3 text-center aspect-square flex flex-col items-center justify-center"
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-[8px] text-muted-foreground mt-1 leading-tight">{badge.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" /> Performance
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">On-time Rate</span>
            <span className="text-xs font-bold text-green-400">
              {Math.round((emp.stats.onTimeDays / emp.stats.totalDays) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(emp.stats.onTimeDays / emp.stats.totalDays) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Current Streak</span>
            <span className="text-xs font-bold text-orange-400">🔥 {emp.streak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Points Balance</span>
            <span className="text-xs font-bold text-accent">💰 {emp.pointsBalance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
