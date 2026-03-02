import { useRef, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Zap, Star } from 'lucide-react';
import { currentEmployee, teammates } from '@/data/mockData';
import { levelNodes } from '@/data/mockData';
import { getShieldEmoji } from '@/data/models';

export default function GameMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const playerLevel = currentEmployee.level;

  const reversedNodes = useMemo(() => [...levelNodes].reverse(), []);

  const teammatesByLevel = useMemo(() => {
    const map = new Map<number, string[]>();
    teammates.forEach(t => {
      const arr = map.get(t.level) || [];
      arr.push(t.name.charAt(0));
      map.set(t.level, arr);
    });
    return map;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const idx = reversedNodes.findIndex(n => n.level === playerLevel);
      const nodeHeight = 90;
      const offset = idx * nodeHeight - 200;
      scrollRef.current.scrollTop = Math.max(0, offset);
    }
  }, [playerLevel, reversedNodes]);

  const getNodeStyle = (level: number) => {
    if (level === playerLevel) return 'current';
    if (level < playerLevel) return 'completed';
    return 'locked';
  };

  const getMilestoneIcon = (level: number) => {
    if (level === 10) return '🛡️';
    if (level === 25) return '🏅';
    if (level === 50) return '💎';
    if (level === 75) return '👑';
    if (level === 100) return '🏆';
    if (level % 10 === 0) return '⭐';
    return null;
  };

  const selectedNode = selectedLevel ? levelNodes.find(n => n.level === selectedLevel) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold font-display">Game Map</h1>
        <p className="text-sm text-muted-foreground">Your journey to Legend</p>
      </div>

      {/* Map */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 relative">
        <div className="flex flex-col items-center py-8" style={{ minHeight: reversedNodes.length * 90 }}>
          {reversedNodes.map((node, i) => {
            const style = getNodeStyle(node.level);
            const milestone = getMilestoneIcon(node.level);
            const mates = teammatesByLevel.get(node.level);
            const isLeft = i % 2 === 0;

            return (
              <div
                key={node.level}
                className="relative flex items-center w-full"
                style={{ height: 90 }}
              >
                {/* Connector line */}
                {i < reversedNodes.length - 1 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0.5"
                    style={{
                      top: '50%',
                      height: '90px',
                      background: style === 'locked'
                        ? 'hsl(215 20% 18%)'
                        : 'linear-gradient(180deg, hsl(207 78% 40%), hsl(207 78% 30%))',
                    }}
                  />
                )}

                {/* Left label */}
                <div className={`flex-1 flex ${isLeft ? 'justify-end pr-4' : 'justify-end pr-4 opacity-0'}`}>
                  {isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.abs(node.level - playerLevel) < 8 ? 0.1 : 0 }}
                      className="text-right"
                    >
                      <p className={`text-xs font-bold ${style === 'current' ? 'text-primary' : style === 'completed' ? 'text-foreground/70' : 'text-muted-foreground/40'}`}>
                        Lv {node.level}
                      </p>
                      {node.reward && style !== 'locked' && (
                        <p className="text-[9px] text-accent">{node.reward}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Node */}
                <button
                  onClick={() => setSelectedLevel(node.level)}
                  className="relative z-10 flex-shrink-0"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`
                      flex items-center justify-center rounded-full border-2 transition-all
                      ${node.isMilestone ? 'w-14 h-14' : 'w-10 h-10'}
                      ${style === 'current'
                        ? 'border-primary bg-primary/20 glow-primary'
                        : style === 'completed'
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border bg-muted/30'
                      }
                    `}
                  >
                    {milestone ? (
                      <span className={`${node.isMilestone ? 'text-xl' : 'text-sm'}`}>{milestone}</span>
                    ) : style === 'locked' ? (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/40" />
                    ) : style === 'current' ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Zap className="w-4 h-4 text-primary" />
                      </motion.div>
                    ) : (
                      <Star className="w-3.5 h-3.5 text-primary/60" />
                    )}
                  </motion.div>

                  {/* Teammate indicators */}
                  {mates && (
                    <div className="absolute -top-1 -right-1 flex -space-x-1">
                      {mates.slice(0, 2).map((initial, j) => (
                        <div
                          key={j}
                          className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[8px] font-bold flex items-center justify-center border border-background"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Current player indicator */}
                  {style === 'current' && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                    />
                  )}
                </button>

                {/* Right label */}
                <div className={`flex-1 flex ${!isLeft ? 'justify-start pl-4' : 'justify-start pl-4 opacity-0'}`}>
                  {!isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-left"
                    >
                      <p className={`text-xs font-bold ${style === 'current' ? 'text-primary' : style === 'completed' ? 'text-foreground/70' : 'text-muted-foreground/40'}`}>
                        Lv {node.level}
                      </p>
                      {node.reward && style !== 'locked' && (
                        <p className="text-[9px] text-accent">{node.reward}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedLevel(null)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] glass-card p-6 rounded-b-none space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-display">Level {selectedNode.level}</h3>
                <button onClick={() => setSelectedLevel(null)} className="p-1">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between glass-card p-3">
                  <span className="text-sm text-muted-foreground">Required XP</span>
                  <span className="font-bold text-primary">{selectedNode.requiredXP} XP</span>
                </div>
                {selectedNode.reward && (
                  <div className="flex items-center justify-between glass-card p-3">
                    <span className="text-sm text-muted-foreground">Reward</span>
                    <span className="font-bold text-accent">{selectedNode.reward}</span>
                  </div>
                )}
                {selectedNode.shieldUnlock && (
                  <div className="flex items-center justify-between glass-card p-3">
                    <span className="text-sm text-muted-foreground">Shield Unlock</span>
                    <span className="text-xl">{getShieldEmoji(selectedNode.shieldUnlock)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between glass-card p-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`font-bold text-sm ${
                    selectedNode.level <= currentEmployee.level ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {selectedNode.level <= currentEmployee.level ? '✅ Completed' : selectedNode.level === currentEmployee.level + 1 ? '🔓 Next Level' : '🔒 Locked'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
