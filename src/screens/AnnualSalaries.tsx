import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, Clock, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { annualSalaries } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, ComposedChart } from 'recharts';

export default function AnnualSalaries() {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const chartData = annualSalaries.map(s => ({
    name: s.month.slice(0, 3),
    net: s.netSalary,
    bonus: s.bonus,
    deduction: s.deduction,
  }));

  const totalEarned = annualSalaries.reduce((a, b) => a + b.netSalary, 0);
  const totalBonus = annualSalaries.reduce((a, b) => a + b.bonus, 0);
  const totalDeduction = annualSalaries.reduce((a, b) => a + b.deduction, 0);

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <h1 className="text-2xl font-bold font-display">Annual Salaries</h1>
      <p className="text-xs text-muted-foreground">2026 Financial Overview</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-3 text-center">
          <DollarSign className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-sm font-bold font-display">${totalEarned.toLocaleString()}</p>
          <p className="text-[9px] text-muted-foreground">Total Earned</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-3 text-center">
          <TrendingUp className="w-4 h-4 text-success mx-auto mb-1" />
          <p className="text-sm font-bold font-display text-success">+${totalBonus.toLocaleString()}</p>
          <p className="text-[9px] text-muted-foreground">Total Bonus</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-3 text-center">
          <TrendingDown className="w-4 h-4 text-destructive mx-auto mb-1" />
          <p className="text-sm font-bold font-display text-destructive">-${totalDeduction.toLocaleString()}</p>
          <p className="text-[9px] text-muted-foreground">Total Deductions</p>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Performance Overview</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 89%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215 12% 50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 12% 50%)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(210 15% 89%)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'hsl(215 25% 15%)',
                }}
              />
              <Area type="monotone" dataKey="net" fill="hsl(207 75% 40% / 0.1)" stroke="hsl(207 75% 40%)" strokeWidth={2} />
              <Bar dataKey="bonus" fill="hsl(160 64% 43%)" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="deduction" fill="hsl(0 72% 50%)" radius={[4, 4, 0, 0]} barSize={8} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Monthly Breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Monthly Breakdown</h3>
        {annualSalaries.map((salary, i) => {
          const isExpanded = expandedMonth === i;
          return (
            <motion.div
              key={salary.month}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <button
                onClick={() => setExpandedMonth(isExpanded ? null : i)}
                className="w-full glass-card p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {salary.month.slice(0, 3)}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{salary.month}</p>
                    {salary.status === 'confirmed' ? (
                      <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-success">
                        <CheckCircle className="w-2.5 h-2.5" /> Confirmed
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
                        <Clock className="w-2.5 h-2.5" /> Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">Base: ${salary.basicSalary.toLocaleString()}</span>
                    {salary.bonus > 0 && (
                      <span className="text-[10px] text-success flex items-center gap-0.5">
                        <ArrowUpRight className="w-2.5 h-2.5" />+${salary.bonus}
                      </span>
                    )}
                    {salary.deduction > 0 && (
                      <span className="text-[10px] text-destructive flex items-center gap-0.5">
                        <ArrowDownRight className="w-2.5 h-2.5" />-${salary.deduction}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${salary.netSalary.toLocaleString()}</p>
                  {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground ml-auto" /> : <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && salary.details.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-1.5 border-l-2 border-border pl-3 pb-2">
                      {salary.details.map((detail, di) => (
                        <motion.div
                          key={di}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: di * 0.05 }}
                          className="glass-card p-2.5 flex items-start gap-2"
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            detail.type === 'bonus' ? 'bg-emerald-100' : 'bg-red-100'
                          }`}>
                            {detail.type === 'bonus' ? (
                              <ArrowUpRight className="w-3 h-3 text-success" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-destructive" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold">{detail.event}</p>
                              <p className={`text-xs font-bold ${detail.type === 'bonus' ? 'text-success' : 'text-destructive'}`}>
                                {detail.type === 'bonus' ? '+' : '-'}${detail.amount}
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{detail.date}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{detail.reason}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {isExpanded && salary.details.length === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 border-l-2 border-border pl-3 pb-2">
                      <p className="text-xs text-muted-foreground py-2">No events recorded this month.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
