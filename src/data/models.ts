export interface Employee {
  id: string;
  name: string;
  avatar: string;
  department: string;
  level: number;
  xp: number;
  shieldType: ShieldType;
  rank: number;
  streak: number;
  badges: Badge[];
  stats: AttendanceStats;
  pointsBalance: number;
}

export type ShieldType = 'none' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legend';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

export interface AttendanceStats {
  onTimeDays: number;
  lateDays: number;
  perfectWeeks: number;
  totalDays: number;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  description: string;
  pointsCost: number;
  category: string;
}

export interface RankingEntry {
  employee: Employee;
  rank: number;
  monthlyXP: number;
}

export interface LevelNode {
  level: number;
  requiredXP: number;
  reward?: string;
  shieldUnlock?: ShieldType;
  isMilestone: boolean;
}

export interface MonthlyWinner {
  employee: Employee;
  month: string;
  year: number;
  prize: number;
}

export function getLevelTitle(level: number): string {
  if (level >= 90) return 'Legend';
  if (level >= 70) return 'Master';
  if (level >= 50) return 'Elite';
  if (level >= 30) return 'Pro';
  if (level >= 15) return 'Rising Star';
  if (level >= 5) return 'Apprentice';
  return 'Rookie';
}

export function getRequiredXP(level: number): number {
  return level * 100;
}

export function getShieldForLevel(level: number): ShieldType {
  if (level >= 100) return 'legend';
  if (level >= 75) return 'diamond';
  if (level >= 50) return 'platinum';
  if (level >= 25) return 'gold';
  if (level >= 10) return 'silver';
  return 'none';
}

export function getShieldColor(shield: ShieldType): string {
  switch (shield) {
    case 'silver': return 'text-silver';
    case 'gold': return 'text-gold';
    case 'platinum': return 'text-platinum';
    case 'diamond': return 'text-diamond';
    case 'legend': return 'text-legend';
    default: return 'text-muted-foreground';
  }
}

export function getShieldEmoji(shield: ShieldType): string {
  switch (shield) {
    case 'silver': return '🛡️';
    case 'gold': return '🏅';
    case 'platinum': return '💎';
    case 'diamond': return '👑';
    case 'legend': return '🏆';
    default: return '⚪';
  }
}
