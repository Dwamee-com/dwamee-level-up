import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, CheckCircle, Clock, AlertTriangle, Paperclip, MessageSquare, ChevronDown, ChevronUp, FileText, Image, Send, XCircle } from 'lucide-react';
import { dailyTasks, DailyTask } from '@/data/mockData';

const statusConfig = {
  not_started: { label: 'Not Started', color: 'text-muted-foreground', bg: 'bg-muted', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-primary', bg: 'bg-primary/10', icon: Play },
  paused: { label: 'Paused', color: 'text-amber-600', bg: 'bg-amber-100', icon: Pause },
  completed: { label: 'Completed', color: 'text-success', bg: 'bg-emerald-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-destructive', bg: 'bg-red-100', icon: XCircle },
};

const priorityConfig = {
  low: { label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted' },
  medium: { label: 'Medium', color: 'text-primary', bg: 'bg-primary/10' },
  high: { label: 'High', color: 'text-amber-600', bg: 'bg-amber-100' },
  urgent: { label: 'Urgent', color: 'text-destructive', bg: 'bg-red-100' },
};

const fileIcon = (type: string) => {
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(type)) return <Image className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(dailyTasks);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | DailyTask['status']>('all');

  const updateTaskStatus = (taskId: string, newStatus: DailyTask['status']) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : t.completedAt } : t
    ));
  };

  const addComment = (taskId: string) => {
    const text = newComment[taskId]?.trim();
    if (!text) return;
    setTasks(prev => prev.map(t =>
      t.id === taskId ? {
        ...t,
        comments: [...t.comments, {
          id: `c-${Date.now()}`,
          userId: 'e1',
          userName: 'Ahmed Al-Rashid',
          text,
          timestamp: new Date().toISOString(),
        }]
      } : t
    ));
    setNewComment(prev => ({ ...prev, [taskId]: '' }));
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPct = (completedCount / tasks.length) * 100;

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Tasks</h1>
          <p className="text-xs text-muted-foreground">March 4, 2026 · {completedCount}/{tasks.length} completed</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{Math.round(progressPct)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'not_started', 'in_progress', 'paused', 'completed', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            {f === 'all' ? 'All' : statusConfig[f].label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task, i) => {
          const isExpanded = expandedTask === task.id;
          const status = statusConfig[task.status];
          const priority = priorityConfig[task.priority];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={task.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                className="w-full glass-card p-3 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${status.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${priority.bg} ${priority.color}`}>
                        {priority.label}
                      </span>
                      {task.dueTime && (
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {task.dueTime}
                        </span>
                      )}
                      {task.attachments.length > 0 && (
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <Paperclip className="w-2.5 h-2.5" /> {task.attachments.length}
                        </span>
                      )}
                      {task.comments.length > 0 && (
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <MessageSquare className="w-2.5 h-2.5" /> {task.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card mt-1 p-4 space-y-4">
                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>

                      {/* Status Actions */}
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Actions</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {task.status !== 'in_progress' && task.status !== 'completed' && (
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateTaskStatus(task.id, 'in_progress')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold">
                              <Play className="w-3 h-3" /> Start
                            </motion.button>
                          )}
                          {task.status === 'in_progress' && (
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateTaskStatus(task.id, 'paused')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-600 text-[10px] font-semibold">
                              <Pause className="w-3 h-3" /> Pause
                            </motion.button>
                          )}
                          {task.status !== 'completed' && task.status !== 'cancelled' && (
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-success text-[10px] font-semibold">
                              <CheckCircle className="w-3 h-3" /> Complete
                            </motion.button>
                          )}
                          {task.status !== 'completed' && task.status !== 'cancelled' && (
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateTaskStatus(task.id, 'cancelled')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-destructive text-[10px] font-semibold">
                              <Square className="w-3 h-3" /> Cancel
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Attachments */}
                      {task.attachments.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Attachments</p>
                          <div className="space-y-1">
                            {task.attachments.map(att => (
                              <div key={att.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-secondary">
                                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                                  {fileIcon(att.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-medium truncate">{att.name}</p>
                                  <p className="text-[9px] text-muted-foreground">{att.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                          Comments ({task.comments.length})
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                          {task.comments.map(comment => (
                            <div key={comment.id} className={`flex gap-2 ${comment.userId === 'e1' ? 'flex-row-reverse' : ''}`}>
                              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                                {comment.userName.charAt(0)}
                              </div>
                              <div className={`flex-1 max-w-[80%] ${comment.userId === 'e1' ? 'text-right' : ''}`}>
                                <div className={`inline-block px-3 py-2 rounded-xl text-[11px] ${
                                  comment.userId === 'e1' ? 'bg-primary/10' : 'bg-secondary'
                                }`}>
                                  <p className="font-semibold text-[9px] mb-0.5">{comment.userName}</p>
                                  <p>{comment.text}</p>
                                </div>
                                <p className="text-[8px] text-muted-foreground mt-0.5">
                                  {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={newComment[task.id] || ''}
                            onChange={e => setNewComment(prev => ({ ...prev, [task.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addComment(task.id)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-[11px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addComment(task.id)}
                            className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"
                          >
                            <Send className="w-3.5 h-3.5 text-primary-foreground" />
                          </motion.button>
                        </div>
                      </div>
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
