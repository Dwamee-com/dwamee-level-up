import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp, DollarSign, Zap, Award, Flame, Target } from 'lucide-react';
import { allEmployees, annualSalaries, monthlyWinners } from '@/data/mockData';
import { getLevelTitle, getShieldEmoji } from '@/data/models';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function AdminOverview() {
  const totalEmployees = allEmployees.length;
  const avgLevel = Math.round(allEmployees.reduce((a, b) => a + b.level, 0) / totalEmployees);
  const avgXP = Math.round(allEmployees.reduce((a, b) => a + b.xp, 0) / totalEmployees);
  const topPerformer = [...allEmployees].sort((a, b) => b.xp - a.xp)[0];
  const totalSalaries = annualSalaries.reduce((a, b) => a + b.netSalary, 0);

  const deptData = ['Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Sales'].map(dept => {
    const emps = allEmployees.filter(e => e.department === dept);
    return { name: dept, count: emps.length, avgLevel: emps.length ? Math.round(emps.reduce((a, b) => a + b.level, 0) / emps.length) : 0 };
  });

  const shieldDistribution = [
    { name: 'None', value: allEmployees.filter(e => e.shieldType === 'none').length, color: 'hsl(215 15% 55%)' },
    { name: 'Silver', value: allEmployees.filter(e => e.shieldType === 'silver').length, color: 'hsl(210 10% 70%)' },
    { name: 'Gold', value: allEmployees.filter(e => e.shieldType === 'gold').length, color: 'hsl(43 90% 55%)' },
    { name: 'Platinum', value: allEmployees.filter(e => e.shieldType === 'platinum').length, color: 'hsl(260 40% 65%)' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Manager Dashboard</h1>
        <p className="text-sm text-muted-foreground">Company-wide overview of employee performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Employees', value: totalEmployees, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: TrendingUp, label: 'Avg Level', value: avgLevel, color: 'text-accent', bg: 'bg-accent/10' },
          { icon: Zap, label: 'Avg XP', value: avgXP.toLocaleString(), color: 'text-primary', bg: 'bg-primary/10' },
          { icon: DollarSign, label: 'Total Salaries (YTD)', value: `$${totalSalaries.toLocaleString()}`, color: 'text-green-400', bg: 'bg-green-400/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold font-display">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Department Performance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 18%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215 15% 55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215 15% 55%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(215 28% 10%)', border: '1px solid hsl(215 20% 18%)', borderRadius: '12px', fontSize: '12px', color: 'hsl(210 40% 96%)' }} />
                <Bar dataKey="avgLevel" name="Avg Level" fill="hsl(207 78% 40%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Shield Distribution */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Shield Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={shieldDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} strokeWidth={2} stroke="hsl(215 28% 10%)">
                  {shieldDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(215 28% 10%)', border: '1px solid hsl(215 20% 18%)', borderRadius: '12px', fontSize: '12px', color: 'hsl(210 40% 96%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {shieldDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performers + Employee of Month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Top Performers</h3>
          <div className="space-y-3">
            {[...allEmployees].sort((a, b) => b.xp - a.xp).slice(0, 5).map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-colors">
                <span className="w-6 text-center font-bold text-sm text-muted-foreground">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{emp.name}</p>
                  <p className="text-[10px] text-muted-foreground">{emp.department} · {getLevelTitle(emp.level)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{getShieldEmoji(emp.shieldType)} Lv {emp.level}</p>
                  <p className="text-[10px] text-muted-foreground">{emp.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Winners */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Employee of the Month History</h3>
          <div className="space-y-3">
            {monthlyWinners.map((w, i) => (
              <div key={`${w.month}-${w.year}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm font-bold text-accent">
                  {w.employee.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{w.employee.name}</p>
                  <p className="text-[10px] text-muted-foreground">{w.month} {w.year}</p>
                </div>
                <p className="text-sm font-bold text-accent">${w.prize}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* All Employees Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">All Employees</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-xs text-muted-foreground font-semibold">Employee</th>
                <th className="text-left py-3 px-2 text-xs text-muted-foreground font-semibold">Department</th>
                <th className="text-center py-3 px-2 text-xs text-muted-foreground font-semibold">Level</th>
                <th className="text-center py-3 px-2 text-xs text-muted-foreground font-semibold">XP</th>
                <th className="text-center py-3 px-2 text-xs text-muted-foreground font-semibold">Shield</th>
                <th className="text-center py-3 px-2 text-xs text-muted-foreground font-semibold">Streak</th>
                <th className="text-center py-3 px-2 text-xs text-muted-foreground font-semibold">On-time %</th>
              </tr>
            </thead>
            <tbody>
              {[...allEmployees].sort((a, b) => b.level - a.level).map(emp => (
                <tr key={emp.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="font-medium">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{emp.department}</td>
                  <td className="py-3 px-2 text-center font-bold text-primary">{emp.level}</td>
                  <td className="py-3 px-2 text-center">{emp.xp.toLocaleString()}</td>
                  <td className="py-3 px-2 text-center text-lg">{getShieldEmoji(emp.shieldType)}</td>
                  <td className="py-3 px-2 text-center">🔥 {emp.streak}</td>
                  <td className="py-3 px-2 text-center font-medium">{Math.round((emp.stats.onTimeDays / emp.stats.totalDays) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
