import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Plus, Check, Clock, Calendar, ChevronDown, ChevronUp, Trash2, Bell, BellOff, Volume2 } from 'lucide-react';

interface Reminder {
  id: string;
  text: string;
  date: string;
  time: string;
  done: boolean;
  createdAt: string;
}

const initialReminders: Reminder[] = [
  { id: 'r1', text: 'Submit quarterly report to HR', date: '2026-03-04', time: '09:00', done: true, createdAt: '2026-03-01T08:00:00' },
  { id: 'r2', text: 'Team standup meeting', date: '2026-03-04', time: '10:00', done: true, createdAt: '2026-03-03T17:00:00' },
  { id: 'r3', text: 'Review sprint backlog for next week', date: '2026-03-08', time: '14:00', done: false, createdAt: '2026-03-05T10:00:00' },
  { id: 'r4', text: 'Doctor appointment — leave early approved', date: '2026-03-10', time: '15:30', done: false, createdAt: '2026-03-06T09:00:00' },
  { id: 'r5', text: 'Prepare presentation for client demo', date: '2026-03-12', time: '11:00', done: false, createdAt: '2026-03-07T14:00:00' },
  { id: 'r6', text: 'Complete online training module', date: '2026-03-15', time: '16:00', done: false, createdAt: '2026-03-08T08:30:00' },
  { id: 'r7', text: 'Birthday celebration for Sara', date: '2026-03-20', time: '12:00', done: false, createdAt: '2026-03-08T09:00:00' },
];

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [view, setView] = useState<'upcoming' | 'done'>('upcoming');
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const recognitionRef = useRef<any>(null);

  const today = new Date().toISOString().split('T')[0];

  const startVoiceRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setRecordingText(transcript);
      if (event.results[0].isFinal) {
        setNewText(transcript);
        setIsRecording(false);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setRecordingText('');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setRecordingText('');
  }, []);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (recordingText) {
      setNewText(recordingText);
    }
  }, [recordingText]);

  const addReminder = () => {
    const text = newText.trim();
    if (!text || !newDate) return;
    const reminder: Reminder = {
      id: `r-${Date.now()}`,
      text,
      date: newDate,
      time: newTime || '09:00',
      done: false,
      createdAt: new Date().toISOString(),
    };
    setReminders(prev => [...prev, reminder]);
    setNewText('');
    setNewDate('');
    setNewTime('');
    setShowAdd(false);
    setRecordingText('');
  };

  const toggleDone = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reminders
    .filter(r => view === 'done' ? r.done : !r.done)
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time}`).getTime();
      const db = new Date(`${b.date}T${b.time}`).getTime();
      return da - db;
    });

  // Group by date
  const grouped = filtered.reduce<Record<string, Reminder[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    if (dateStr === today) return 'Today';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isOverdue = (r: Reminder) => {
    if (r.done) return false;
    return new Date(`${r.date}T${r.time}`) < new Date();
  };

  const upcomingCount = reminders.filter(r => !r.done).length;
  const doneCount = reminders.filter(r => r.done).length;

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Reminders</h1>
          <p className="text-xs text-muted-foreground">{upcomingCount} upcoming · {doneCount} completed</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </motion.button>
      </div>

      {/* Add Reminder */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={isRecording ? recordingText : newText}
                  onChange={e => setNewText(e.target.value)}
                  placeholder="What to remember..."
                  className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isRecording ? 'bg-destructive animate-pulse' : 'bg-primary/20'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5 text-destructive-foreground" />
                  ) : (
                    <Mic className="w-5 h-5 text-primary" />
                  )}
                </motion.button>
              </div>

              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <p className="text-xs text-destructive">Listening... speak now</p>
                  <Volume2 className="w-3 h-3 text-destructive ml-auto animate-pulse" />
                </motion.div>
              )}

              <div className="flex gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                />
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-28 bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addReminder}
                disabled={!newText.trim() || !newDate}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Reminder
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('upcoming')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            view === 'upcoming' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
          }`}
        >
          <Bell className="w-4 h-4" /> Upcoming ({upcomingCount})
        </button>
        <button
          onClick={() => setView('done')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            view === 'done' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
          }`}
        >
          <Check className="w-4 h-4" /> Done ({doneCount})
        </button>
      </div>

      {/* Grouped by Date */}
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-10">
          <BellOff className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {view === 'done' ? 'No completed reminders yet' : 'No upcoming reminders'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {formatDate(date)}
              </h3>
            </div>
            {items.map((reminder, i) => {
              const overdue = isOverdue(reminder);
              return (
                <motion.div
                  key={reminder.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-3 flex items-start gap-3 ${overdue ? 'border-destructive/30' : ''}`}
                >
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleDone(reminder.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      reminder.done
                        ? 'bg-primary border-primary'
                        : overdue
                          ? 'border-destructive/50'
                          : 'border-border'
                    }`}
                  >
                    {reminder.done && <Check className="w-3 h-3 text-primary-foreground" />}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${reminder.done ? 'line-through opacity-50' : ''}`}>
                      {reminder.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] flex items-center gap-0.5 ${overdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Clock className="w-2.5 h-2.5" /> {reminder.time}
                      </span>
                      {overdue && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive font-semibold">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
