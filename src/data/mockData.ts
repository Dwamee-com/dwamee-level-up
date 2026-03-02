import { Employee, Reward, LevelNode, MonthlyWinner, Badge } from './models';

const badges: Badge[] = [
  { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'Check in before 8 AM for 5 days' },
  { id: 'b2', name: 'Perfect Week', icon: '⭐', description: 'No absences for a full week' },
  { id: 'b3', name: 'Streak Master', icon: '🔥', description: '30-day streak' },
  { id: 'b4', name: 'Team Player', icon: '🤝', description: 'Help 5 teammates' },
  { id: 'b5', name: 'Night Owl', icon: '🦉', description: 'Work overtime 10 times' },
  { id: 'b6', name: 'Marathon', icon: '🏃', description: '100 on-time days' },
  { id: 'b7', name: 'Champion', icon: '🏆', description: 'Employee of the Month' },
  { id: 'b8', name: 'Rocket', icon: '🚀', description: 'Level up 5 times in one month' },
];

export const currentEmployee: Employee = {
  id: 'e1',
  name: 'Ahmed Al-Rashid',
  avatar: '',
  department: 'Engineering',
  level: 27,
  xp: 2450,
  shieldType: 'gold',
  rank: 3,
  streak: 14,
  badges: badges.slice(0, 6),
  stats: { onTimeDays: 142, lateDays: 8, perfectWeeks: 28, totalDays: 150 },
  pointsBalance: 1850,
};

export const teammates: Employee[] = [
  { id: 'e2', name: 'Sara Chen', avatar: '', department: 'Design', level: 35, xp: 3200, shieldType: 'gold', rank: 1, streak: 22, badges: badges.slice(0, 7), stats: { onTimeDays: 180, lateDays: 3, perfectWeeks: 35, totalDays: 183 }, pointsBalance: 2400 },
  { id: 'e3', name: 'John Smith', avatar: '', department: 'Marketing', level: 31, xp: 2900, shieldType: 'gold', rank: 2, streak: 18, badges: badges.slice(0, 5), stats: { onTimeDays: 160, lateDays: 10, perfectWeeks: 30, totalDays: 170 }, pointsBalance: 2100 },
  { id: 'e4', name: 'Maria Garcia', avatar: '', department: 'Engineering', level: 22, xp: 1900, shieldType: 'silver', rank: 4, streak: 7, badges: badges.slice(0, 4), stats: { onTimeDays: 120, lateDays: 15, perfectWeeks: 20, totalDays: 135 }, pointsBalance: 1200 },
  { id: 'e5', name: 'James Lee', avatar: '', department: 'HR', level: 18, xp: 1600, shieldType: 'silver', rank: 5, streak: 5, badges: badges.slice(0, 3), stats: { onTimeDays: 100, lateDays: 20, perfectWeeks: 15, totalDays: 120 }, pointsBalance: 900 },
  { id: 'e6', name: 'Fatima Al-Zahra', avatar: '', department: 'Finance', level: 42, xp: 4100, shieldType: 'gold', rank: 6, streak: 30, badges: badges.slice(0, 8), stats: { onTimeDays: 200, lateDays: 2, perfectWeeks: 40, totalDays: 202 }, pointsBalance: 3200 },
  { id: 'e7', name: 'Yuki Tanaka', avatar: '', department: 'Engineering', level: 15, xp: 1350, shieldType: 'silver', rank: 7, streak: 3, badges: badges.slice(0, 2), stats: { onTimeDays: 80, lateDays: 12, perfectWeeks: 12, totalDays: 92 }, pointsBalance: 650 },
  { id: 'e8', name: 'Omar Hassan', avatar: '', department: 'Sales', level: 52, xp: 5100, shieldType: 'platinum', rank: 8, streak: 45, badges, stats: { onTimeDays: 220, lateDays: 1, perfectWeeks: 44, totalDays: 221 }, pointsBalance: 4100 },
  { id: 'e9', name: 'Emily Davis', avatar: '', department: 'Design', level: 12, xp: 1050, shieldType: 'silver', rank: 9, streak: 2, badges: badges.slice(0, 2), stats: { onTimeDays: 60, lateDays: 18, perfectWeeks: 8, totalDays: 78 }, pointsBalance: 400 },
  { id: 'e10', name: 'David Kim', avatar: '', department: 'Marketing', level: 8, xp: 680, shieldType: 'none', rank: 10, streak: 1, badges: badges.slice(0, 1), stats: { onTimeDays: 40, lateDays: 25, perfectWeeks: 5, totalDays: 65 }, pointsBalance: 200 },
];

export const allEmployees = [currentEmployee, ...teammates];

export const rewards: Reward[] = [
  { id: 'r1', name: 'Gift Card $50', icon: '🎁', description: 'Amazon gift card', pointsCost: 500, category: 'Gift Cards' },
  { id: 'r2', name: 'Extra Day Off', icon: '🏖️', description: 'One additional vacation day', pointsCost: 1000, category: 'Time Off' },
  { id: 'r3', name: 'Lunch Voucher', icon: '🍕', description: 'Free lunch at partner restaurant', pointsCost: 200, category: 'Food' },
  { id: 'r4', name: 'Cash Bonus $100', icon: '💰', description: 'Direct deposit bonus', pointsCost: 2000, category: 'Cash' },
  { id: 'r5', name: 'Parking Spot', icon: '🅿️', description: 'Reserved parking for a month', pointsCost: 800, category: 'Perks' },
  { id: 'r6', name: 'Team Dinner', icon: '🍽️', description: 'Dinner for you and your team', pointsCost: 1500, category: 'Experience' },
  { id: 'r7', name: 'Gym Pass', icon: '🏋️', description: 'One month gym membership', pointsCost: 600, category: 'Health' },
  { id: 'r8', name: 'Tech Gadget', icon: '📱', description: 'Choose from curated tech items', pointsCost: 3000, category: 'Tech' },
];

export const levelNodes: LevelNode[] = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const node: LevelNode = {
    level,
    requiredXP: level * 100,
    isMilestone: level % 10 === 0 || level === 25 || level === 75,
  };
  if (level === 10) { node.shieldUnlock = 'silver'; node.reward = 'Silver Shield Unlocked!'; }
  if (level === 25) { node.shieldUnlock = 'gold'; node.reward = 'Gold Shield Unlocked!'; }
  if (level === 50) { node.shieldUnlock = 'platinum'; node.reward = 'Platinum Shield Unlocked!'; }
  if (level === 75) { node.shieldUnlock = 'diamond'; node.reward = 'Diamond Shield Unlocked!'; }
  if (level === 100) { node.shieldUnlock = 'legend'; node.reward = 'Legend Crown Unlocked! 🏆'; }
  if (!node.reward && level % 10 === 0) node.reward = `${level * 10} bonus points`;
  return node;
});

export const monthlyWinners: MonthlyWinner[] = [
  { employee: teammates[0], month: 'February', year: 2026, prize: 500 },
  { employee: teammates[5], month: 'January', year: 2026, prize: 500 },
  { employee: teammates[7], month: 'December', year: 2025, prize: 500 },
  { employee: currentEmployee, month: 'November', year: 2025, prize: 500 },
];
