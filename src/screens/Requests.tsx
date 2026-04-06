import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, LogOut, LogIn, DollarSign, Palmtree, CheckCircle, XCircle, AlertCircle, Calendar, Paperclip, ChevronDown, ChevronUp, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  allRequests, getRequestStats, getRequestsByType,
  AnyRequest, LeaveEarlyRequest, ComeLateRequest, VacationRequest, FinancialAdvanceRequest,
  RequestType, RequestStatus, Approver
} from '@/data/requestsData';

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  accepted: { label: 'Accepted', color: 'text-success', bg: 'bg-emerald-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-destructive', bg: 'bg-red-100', icon: XCircle },
};

const typeConfig: Record<RequestType, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  leave_early: { label: 'Leave Early', icon: LogOut, color: 'text-amber-600', bg: 'bg-amber-50' },
  come_late: { label: 'Come Late', icon: LogIn, color: 'text-primary', bg: 'bg-blue-50' },
  financial_advance: { label: 'Financial Advance', icon: DollarSign, color: 'text-success', bg: 'bg-emerald-50' },
  vacation: { label: 'Vacations', icon: Palmtree, color: 'text-purple-600', bg: 'bg-purple-50' },
};

const pieColors = ['hsl(43 90% 55%)', 'hsl(207 75% 40%)', 'hsl(160 64% 43%)', 'hsl(270 50% 55%)'];

type ViewState = 'overview' | RequestType;

function ApproverBar({ approvers }: { approvers: Approver[] }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Approval Chain</p>
      <div className="flex items-center gap-1">
        {approvers.map((a, i) => {
          const s = statusConfig[a.status];
          const Icon = s.icon;
          return (
            <div key={a.id} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${s.bg}`}>
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold leading-tight">{a.name}</p>
                  <p className="text-[8px] text-muted-foreground">{a.role}</p>
                </div>
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              {i < approvers.length - 1 && (
                <div className="w-4 h-0.5 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const s = statusConfig[status];
  const Icon = s.icon;
  return (
    <span className={`flex items-center gap-0.5 text-[9px] px-2 py-0.5 rounded-full font-semibold ${s.bg} ${s.color}`}>
      <Icon className="w-2.5 h-2.5" /> {s.label}
    </span>
  );
}

export default function Requests() {
  const [view, setView] = useState<ViewState>('overview');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = getRequestStats();

  const pieData = [
    { name: 'Leave Early', value: stats.leaveEarly },
    { name: 'Come Late', value: stats.comeLate },
    { name: 'Financial', value: stats.financial },
    { name: 'Vacation', value: stats.vacation },
  ];

  if (view !== 'overview') {
    const requests = getRequestsByType(view);
    const config = typeConfig[view];
    const Icon = config.icon;

    return (
      <div className="px-4 pt-12 pb-6 space-y-5">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setView('overview'); setExpandedId(null); }} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold font-display">{config.label}</h1>
            <p className="text-xs text-muted-foreground">{requests.length} requests</p>
          </div>
        </div>

        <div className="space-y-2">
          {requests.map((req, i) => {
            const isExpanded = expandedId === req.id;
            return (
              <motion.div
                key={req.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  className="w-full glass-card p-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {view === 'vacation' && (
                        <p className="text-sm font-semibold">{(req as VacationRequest).days} days — {(req as VacationRequest).vacationType}</p>
                      )}
                      {view === 'leave_early' && (
                        <p className="text-sm font-semibold">{(req as LeaveEarlyRequest).date} · Leave at {(req as LeaveEarlyRequest).leaveTime}</p>
                      )}
                      {view === 'come_late' && (
                        <p className="text-sm font-semibold">{(req as ComeLateRequest).date} · Arrive at {(req as ComeLateRequest).arrivalTime}</p>
                      )}
                      {view === 'financial_advance' && (
                        <p className="text-sm font-semibold">${(req as FinancialAdvanceRequest).amount} — {(req as FinancialAdvanceRequest).reason}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <RequestStatusBadge status={req.status} />
                        <span className="text-[10px] text-muted-foreground">{req.createdAt}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-card mt-1 p-4 space-y-4">
                        {/* Type-specific details */}
                        {view === 'vacation' && (() => {
                          const v = req as VacationRequest;
                          return (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-secondary rounded-xl p-2.5">
                                  <p className="text-[9px] text-muted-foreground uppercase">Type</p>
                                  <p className="text-xs font-semibold capitalize">{v.vacationType}</p>
                                </div>
                                <div className="bg-secondary rounded-xl p-2.5">
                                  <p className="text-[9px] text-muted-foreground uppercase">Days</p>
                                  <p className="text-xs font-semibold">{v.days} days</p>
                                </div>
                                <div className="bg-secondary rounded-xl p-2.5">
                                  <p className="text-[9px] text-muted-foreground uppercase">From</p>
                                  <p className="text-xs font-semibold">{v.startDate}</p>
                                </div>
                                <div className="bg-secondary rounded-xl p-2.5">
                                  <p className="text-[9px] text-muted-foreground uppercase">To</p>
                                  <p className="text-xs font-semibold">{v.endDate}</p>
                                </div>
                              </div>
                              
                              {/* Calendar selected dates */}
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Selected Dates</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {v.selectedDates.map(d => (
                                    <span key={d} className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-1">
                                      <Calendar className="w-2.5 h-2.5" /> {d}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold ${v.deductFromBalance ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-success'}`}>
                                  {v.deductFromBalance ? '💰 Deducts from balance' : '✅ No deduction'}
                                </span>
                              </div>

                              {v.attachment && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary">
                                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-xs">{v.attachment}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {(view === 'leave_early' || view === 'come_late') && (() => {
                          const r = req as LeaveEarlyRequest | ComeLateRequest;
                          const note = 'note' in r ? r.note : undefined;
                          return (
                            <div className="space-y-2">
                              <div className="bg-secondary rounded-xl p-3">
                                <p className="text-[9px] text-muted-foreground uppercase">Date</p>
                                <p className="text-sm font-semibold">{r.date}</p>
                              </div>
                              <div className="bg-secondary rounded-xl p-3">
                                <p className="text-[9px] text-muted-foreground uppercase">{view === 'leave_early' ? 'Leave Time' : 'Arrival Time'}</p>
                                <p className="text-sm font-semibold">{view === 'leave_early' ? (r as LeaveEarlyRequest).leaveTime : (r as ComeLateRequest).arrivalTime}</p>
                              </div>
                              {note && (
                                <div className="bg-secondary rounded-xl p-3">
                                  <p className="text-[9px] text-muted-foreground uppercase">Note</p>
                                  <p className="text-xs">{note}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {view === 'financial_advance' && (() => {
                          const f = req as FinancialAdvanceRequest;
                          return (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-secondary rounded-xl p-3">
                                  <p className="text-[9px] text-muted-foreground uppercase">Amount</p>
                                  <p className="text-sm font-bold text-success">${f.amount}</p>
                                </div>
                                <div className="bg-secondary rounded-xl p-3">
                                  <p className="text-[9px] text-muted-foreground uppercase">Repayment</p>
                                  <p className="text-sm font-semibold">{f.repaymentMonths} months</p>
                                </div>
                              </div>
                              <div className="bg-secondary rounded-xl p-3">
                                <p className="text-[9px] text-muted-foreground uppercase">Reason</p>
                                <p className="text-xs">{f.reason}</p>
                              </div>
                            </div>
                          );
                        })()}

                        <ApproverBar approvers={req.approvers} />
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

  // Overview
  const cards: { type: RequestType; count: number }[] = [
    { type: 'leave_early', count: stats.leaveEarly },
    { type: 'come_late', count: stats.comeLate },
    { type: 'financial_advance', count: stats.financial },
    { type: 'vacation', count: stats.vacation },
  ];

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <h1 className="text-2xl font-bold font-display">Requests</h1>
      <p className="text-xs text-muted-foreground">{stats.total} total requests</p>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const config = typeConfig[card.type];
          const Icon = config.icon;
          return (
            <motion.button
              key={card.type}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView(card.type)}
              className={`glass-card p-4 text-left`}
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <p className="text-2xl font-bold font-display">{card.count}</p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Distribution</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={35}
                strokeWidth={2}
                stroke="hsl(0 0% 100%)"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(210 15% 89%)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'hsl(215 25% 15%)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: pieColors[i] }} />
              <span className="text-muted-foreground">{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Requests */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent</h3>
        {allRequests.slice(0, 5).map((req, i) => {
          const config = typeConfig[req.type];
          const Icon = config.icon;
          return (
            <motion.button
              key={req.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              onClick={() => { setView(req.type); setExpandedId(req.id); }}
              className="w-full glass-card p-3 flex items-center gap-3 text-left"
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{config.label}</p>
                <p className="text-[10px] text-muted-foreground">{req.createdAt}</p>
              </div>
              <RequestStatusBadge status={req.status} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
