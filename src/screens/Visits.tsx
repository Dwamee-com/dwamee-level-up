import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Play, Square, Navigation, Clock, Gauge, Route as RouteIcon,
  Paperclip, ExternalLink, Target, X, Plus, TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

interface GeoPoint { lat: number; lng: number; }

interface Visit {
  id: string;
  title: string;
  startTime: string; // ISO
  endTime?: string;
  startLoc?: GeoPoint;
  endLoc?: GeoPoint;
  distanceKm: number;
  destinationUrl?: string;
  destination?: GeoPoint;
  autoMode?: 'start' | 'end' | null;
  note?: string;
  attachment?: { name: string; size: string };
  status: 'in_progress' | 'completed';
}

const STORAGE_KEY = 'dwamee_visits';

// Seed data for stats
const seedVisits = (): Visit[] => {
  const now = new Date();
  const mk = (daysAgo: number, hour: number, dur: number, dist: number, title: string): Visit => {
    const s = new Date(now); s.setDate(s.getDate() - daysAgo); s.setHours(hour, 0, 0, 0);
    const e = new Date(s.getTime() + dur * 60000);
    return {
      id: `seed-${daysAgo}-${hour}`, title,
      startTime: s.toISOString(), endTime: e.toISOString(),
      startLoc: { lat: 24.71 + Math.random() * 0.05, lng: 46.67 + Math.random() * 0.05 },
      endLoc: { lat: 24.71 + Math.random() * 0.05, lng: 46.67 + Math.random() * 0.05 },
      distanceKm: dist, status: 'completed',
    };
  };
  return [
    mk(0, 9, 45, 12.4, 'Client A — Al Olaya'),
    mk(0, 11, 30, 6.8, 'Site inspection — Malaz'),
    mk(1, 10, 55, 15.2, 'Vendor meeting'),
    mk(2, 9, 40, 9.1, 'Delivery route'),
    mk(3, 14, 25, 4.3, 'Quick check-in'),
    mk(5, 10, 70, 22.5, 'Regional visit'),
    mk(6, 9, 35, 7.7, 'Follow-up call'),
    mk(9, 11, 50, 14.0, 'Client onboarding'),
    mk(12, 10, 60, 18.3, 'Training site'),
    mk(15, 9, 45, 11.2, 'Audit visit'),
  ];
};

const load = (): Visit[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  const seed = seedVisits();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

const save = (v: Visit[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(v));

const haversine = (a: GeoPoint, b: GeoPoint) => {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const parseMapsUrl = (url: string): GeoPoint | null => {
  const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  return null;
};

const getLocation = (): Promise<GeoPoint> => new Promise((resolve) => {
  if (!navigator.geolocation) {
    resolve({ lat: 24.7136 + Math.random() * 0.02, lng: 46.6753 + Math.random() * 0.02 });
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
    () => resolve({ lat: 24.7136 + Math.random() * 0.02, lng: 46.6753 + Math.random() * 0.02 }),
    { timeout: 5000 }
  );
});

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmtDur = (ms: number) => {
  const m = Math.round(ms / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
};

const isToday = (iso: string) => {
  const d = new Date(iso); const n = new Date();
  return d.toDateString() === n.toDateString();
};
const daysAgo = (iso: string) => (Date.now() - new Date(iso).getTime()) / 86400000;

const AVG_SPEED_KMH = 40; // assumption for ETA

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>(() => load());
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [destUrl, setDestUrl] = useState('');
  const [autoMode, setAutoMode] = useState<'start' | 'end' | null>(null);
  const [selected, setSelected] = useState<Visit | null>(null);
  const [, setTick] = useState(0);
  const [liveDistKm, setLiveDistKm] = useState<number | null>(null);

  useEffect(() => { save(visits); }, [visits]);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const active = visits.find((v) => v.status === 'in_progress');
  const todayVisits = visits.filter((v) => isToday(v.startTime)).sort((a, b) => b.startTime.localeCompare(a.startTime));

  // Live tracking to destination (distance + ETA + auto-arrival)
  useEffect(() => {
    if (!active?.destination) { setLiveDistKm(null); return; }
    let cancelled = false;
    const check = async () => {
      const cur = await getLocation();
      const d = haversine(cur, active.destination!);
      if (cancelled) return;
      setLiveDistKm(d);
      if (d < 0.15 && active.autoMode === 'end') {
        endVisit(active.id);
      }
    };
    check();
    const t = setInterval(check, 15000);
    return () => { cancelled = true; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  const startVisit = async () => {
    if (active) return;
    const loc = await getLocation();
    const dest = destUrl ? parseMapsUrl(destUrl) : null;
    const v: Visit = {
      id: `v-${Date.now()}`,
      title: title || 'New visit',
      startTime: new Date().toISOString(),
      startLoc: loc,
      destinationUrl: destUrl || undefined,
      destination: dest || undefined,
      autoMode: dest ? autoMode : null,
      distanceKm: 0,
      status: 'in_progress',
    };
    setVisits([v, ...visits]);
    setShowNew(false);
    setTitle(''); setDestUrl(''); setAutoMode(null);
    if (destUrl) {
      try { window.open(destUrl, '_blank', 'noopener,noreferrer'); } catch { /* empty */ }
    }
  };

  const endVisit = async (id: string) => {
    const loc = await getLocation();
    setVisits((prev) => prev.map((v) => {
      if (v.id !== id) return v;
      const dist = v.startLoc ? haversine(v.startLoc, loc) : 0;
      return {
        ...v, endTime: new Date().toISOString(), endLoc: loc,
        distanceKm: Math.round(dist * 100) / 100, status: 'completed',
      };
    }));
  };

  const updateVisit = (id: string, patch: Partial<Visit>) => {
    setVisits((prev) => prev.map((v) => v.id === id ? { ...v, ...patch } : v));
    setSelected((s) => s && s.id === id ? { ...s, ...patch } : s);
  };

  // Stats
  const weekVisits = visits.filter((v) => v.status === 'completed' && daysAgo(v.startTime) < 7);
  const monthVisits = visits.filter((v) => v.status === 'completed' && daysAgo(v.startTime) < 30);
  const totalKmWeek = weekVisits.reduce((s, v) => s + v.distanceKm, 0);
  const totalKmMonth = monthVisits.reduce((s, v) => s + v.distanceKm, 0);

  const weekChart = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const dayVisits = visits.filter((v) => v.status === 'completed' && new Date(v.startTime).toDateString() === d.toDateString());
      return {
        day: days[d.getDay()],
        visits: dayVisits.length,
        km: Math.round(dayVisits.reduce((s, v) => s + v.distanceKm, 0) * 10) / 10,
      };
    });
  }, [visits]);

  const durationMs = (v: Visit) => {
    const end = v.endTime ? new Date(v.endTime).getTime() : Date.now();
    return end - new Date(v.startTime).getTime();
  };
  const avgSpeed = (v: Visit) => {
    const hours = durationMs(v) / 3600000;
    if (hours <= 0) return 0;
    return Math.round((v.distanceKm / hours) * 10) / 10;
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Today's Visits</h1>
          <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          disabled={!!active}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {/* Active visit */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 border-primary/40 bg-primary/5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span className="text-xs font-semibold text-success">IN PROGRESS</span>
            </div>
            <span className="text-xs text-muted-foreground">{fmtDur(durationMs(active))}</span>
          </div>
          <div className="font-semibold mb-3">{active.title}</div>
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="rounded-lg bg-card p-2">
              <Clock className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" />
              <div className="text-xs font-semibold">{fmtTime(active.startTime)}</div>
              <div className="text-[9px] text-muted-foreground">Started</div>
            </div>
            <div className="rounded-lg bg-card p-2">
              <RouteIcon className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" />
              <div className="text-xs font-semibold">
                {active.startLoc ? '—' : '—'}
              </div>
              <div className="text-[9px] text-muted-foreground">Tracking</div>
            </div>
            <div className="rounded-lg bg-card p-2">
              <Target className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" />
              <div className="text-xs font-semibold">{active.destination ? 'Set' : 'None'}</div>
              <div className="text-[9px] text-muted-foreground">Destination</div>
            </div>
          </div>
          {active.destinationUrl && (
            <a href={active.destinationUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary mb-2">
              <ExternalLink className="w-3 h-3" /> Open in Google Maps
              {active.autoMode === 'end' && <span className="ml-auto text-[10px] text-success">Auto-end on arrival</span>}
            </a>
          )}
          <button
            onClick={() => endVisit(active.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm"
          >
            <Square className="w-4 h-4 fill-current" /> End visit
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="This week" primary={`${weekVisits.length}`} sub={`${totalKmWeek.toFixed(1)} km`} icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="This month" primary={`${monthVisits.length}`} sub={`${totalKmMonth.toFixed(1)} km`} icon={<RouteIcon className="w-4 h-4" />} />
      </div>

      <div className="glass-card p-3">
        <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-primary" /> Weekly progress
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekChart} margin={{ top: 6, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="km" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today list */}
      <div>
        <div className="text-sm font-semibold mb-2">Today ({todayVisits.length})</div>
        {todayVisits.length === 0 ? (
          <div className="glass-card p-6 text-center text-xs text-muted-foreground">
            No visits yet today. Tap <b>New</b> to start one.
          </div>
        ) : (
          <div className="space-y-2">
            {todayVisits.map((v) => (
              <button key={v.id} onClick={() => setSelected(v)}
                className="w-full glass-card p-3 text-left hover:border-primary/40 transition">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-semibold text-sm">{v.title}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    v.status === 'in_progress' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
                  }`}>{v.status === 'in_progress' ? 'Live' : 'Done'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  <MiniStat icon={<Clock className="w-3 h-3" />} val={fmtTime(v.startTime)} lbl="Start" />
                  <MiniStat icon={<Clock className="w-3 h-3" />} val={v.endTime ? fmtTime(v.endTime) : '—'} lbl="End" />
                  <MiniStat icon={<RouteIcon className="w-3 h-3" />} val={`${v.distanceKm} km`} lbl="Dist" />
                  <MiniStat icon={<Gauge className="w-3 h-3" />} val={`${avgSpeed(v)}`} lbl="km/h" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New visit modal */}
      <AnimatePresence>
        {showNew && (
          <Modal onClose={() => setShowNew(false)} title="New visit">
            <div className="space-y-3">
              <Field label="Title">
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Client meeting" className="input" />
              </Field>
              <Field label="Google Maps URL (optional)" hint="Paste a maps link to enable auto-arrival">
                <input value={destUrl} onChange={(e) => setDestUrl(e.target.value)}
                  placeholder="https://maps.google.com/..." className="input" />
              </Field>
              {destUrl && (
                <Field label="Auto-mark on arrival">
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['start', 'end', null] as const).map((m) => (
                      <button key={String(m)} onClick={() => setAutoMode(m)}
                        className={`py-2 rounded-lg text-xs font-medium border ${
                          autoMode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border'
                        }`}>
                        {m === 'start' ? 'Start' : m === 'end' ? 'End' : 'Off'}
                      </button>
                    ))}
                  </div>
                </Field>
              )}
              <button onClick={startVisit}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-success text-success-foreground font-semibold">
                <Play className="w-4 h-4 fill-current" /> Start visit now
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Visit details */}
      <AnimatePresence>
        {selected && (
          <Modal onClose={() => setSelected(null)} title={selected.title}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <DetailRow label="Start" val={fmtTime(selected.startTime)} />
                <DetailRow label="End" val={selected.endTime ? fmtTime(selected.endTime) : 'In progress'} />
                <DetailRow label="Duration" val={fmtDur(durationMs(selected))} />
                <DetailRow label="Distance" val={`${selected.distanceKm} km`} />
                <DetailRow label="Avg speed" val={`${avgSpeed(selected)} km/h`} />
                <DetailRow label="Status" val={selected.status === 'in_progress' ? 'Live' : 'Completed'} />
              </div>
              {selected.startLoc && (
                <div className="rounded-lg bg-muted p-2.5 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-success" />
                    <b>Start:</b> {selected.startLoc.lat.toFixed(4)}, {selected.startLoc.lng.toFixed(4)}
                  </div>
                  {selected.endLoc && (
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-destructive" />
                      <b>End:</b> {selected.endLoc.lat.toFixed(4)}, {selected.endLoc.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              )}
              <Field label="Note">
                <textarea value={selected.note || ''}
                  onChange={(e) => updateVisit(selected.id, { note: e.target.value })}
                  placeholder="Add a note..." rows={3} className="input resize-none" />
              </Field>
              <Field label="Attachment">
                <label className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border text-xs cursor-pointer hover:bg-muted/50">
                  <Paperclip className="w-3.5 h-3.5" />
                  {selected.attachment ? selected.attachment.name : 'Attach a file'}
                  <input type="file" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    updateVisit(selected.id, { attachment: { name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` } });
                  }} />
                </label>
              </Field>
              {selected.status === 'in_progress' && (
                <button onClick={() => { endVisit(selected.id); setSelected(null); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm">
                  <Square className="w-4 h-4 fill-current" /> End visit
                </button>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <style>{`
        .input {
          width: 100%; padding: 0.6rem 0.75rem; border-radius: 0.6rem;
          border: 1px solid hsl(var(--border)); background: hsl(var(--card));
          font-size: 0.85rem; outline: none;
        }
        .input:focus { border-color: hsl(var(--primary)); }
      `}</style>
    </div>
  );
}

function StatCard({ label, primary, sub, icon }: { label: string; primary: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-3">
      <div className="flex items-center justify-between text-muted-foreground mb-1">
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className="text-xl font-bold text-gradient-primary">{primary}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function MiniStat({ icon, val, lbl }: { icon: React.ReactNode; val: string; lbl: string }) {
  return (
    <div className="rounded-md bg-muted/50 py-1">
      <div className="flex items-center justify-center gap-0.5 text-[10px] font-semibold">{icon}{val}</div>
      <div className="text-[9px] text-muted-foreground">{lbl}</div>
    </div>
  );
}

function DetailRow({ label, val }: { label: string; val: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm font-semibold">{val}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold mb-1">{label}</div>
      {children}
      {hint && <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>}
    </label>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-background rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" /> {title}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
