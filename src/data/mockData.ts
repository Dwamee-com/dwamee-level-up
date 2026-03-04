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
  { id: 'r1', name: 'Gift Card $50', icon: '🎁', description: 'Amazon gift card', pointsCost: 500, category: 'Gift Cards', redeemedBy: ['e2', 'e6'] },
  { id: 'r2', name: 'Extra Day Off', icon: '🏖️', description: 'One additional vacation day', pointsCost: 1000, category: 'Time Off', redeemedBy: ['e8'] },
  { id: 'r3', name: 'Lunch Voucher', icon: '🍕', description: 'Free lunch at partner restaurant', pointsCost: 200, category: 'Food', redeemedBy: ['e2', 'e3', 'e4', 'e6'] },
  { id: 'r4', name: 'Cash Bonus $100', icon: '💰', description: 'Direct deposit bonus', pointsCost: 2000, category: 'Cash', redeemedBy: ['e8'] },
  { id: 'r5', name: 'Parking Spot', icon: '🅿️', description: 'Reserved parking for a month', pointsCost: 800, category: 'Perks', redeemedBy: [] },
  { id: 'r6', name: 'Team Dinner', icon: '🍽️', description: 'Dinner for you and your team', pointsCost: 1500, category: 'Experience', redeemedBy: ['e6'] },
  { id: 'r7', name: 'Gym Pass', icon: '🏋️', description: 'One month gym membership', pointsCost: 600, category: 'Health', redeemedBy: ['e2'] },
  { id: 'r8', name: 'Tech Gadget', icon: '📱', description: 'Choose from curated tech items', pointsCost: 3000, category: 'Tech', redeemedBy: [] },
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

// Salary data
export interface SalaryMonth {
  month: string;
  monthIndex: number;
  year: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  status: 'confirmed' | 'pending';
  details: SalaryDetail[];
}

export interface SalaryDetail {
  date: string;
  event: string;
  type: 'bonus' | 'deduction';
  amount: number;
  reason: string;
}

export const annualSalaries: SalaryMonth[] = [
  {
    month: 'January', monthIndex: 0, year: 2026, basicSalary: 5000, bonus: 350, deduction: 200, netSalary: 5150, status: 'confirmed',
    details: [
      { date: '2026-01-03', event: 'Left early', type: 'deduction', amount: 100, reason: 'Left at 3:00 PM without approval' },
      { date: '2026-01-06', event: 'Overtime', type: 'bonus', amount: 150, reason: 'Stayed until 9 PM for project deadline' },
      { date: '2026-01-15', event: 'Left early', type: 'deduction', amount: 100, reason: 'Left at 2:30 PM - doctor appointment' },
      { date: '2026-01-20', event: 'Perfect week bonus', type: 'bonus', amount: 200, reason: 'Full attendance week 3' },
    ]
  },
  {
    month: 'February', monthIndex: 1, year: 2026, basicSalary: 5000, bonus: 500, deduction: 0, netSalary: 5500, status: 'confirmed',
    details: [
      { date: '2026-02-05', event: 'Performance bonus', type: 'bonus', amount: 300, reason: 'Exceeded KPIs for Q1' },
      { date: '2026-02-14', event: 'Referral bonus', type: 'bonus', amount: 200, reason: 'Referred new team member' },
    ]
  },
  {
    month: 'March', monthIndex: 2, year: 2026, basicSalary: 5000, bonus: 150, deduction: 300, netSalary: 4850, status: 'pending',
    details: [
      { date: '2026-03-01', event: 'Late arrival', type: 'deduction', amount: 50, reason: 'Arrived at 9:45 AM' },
      { date: '2026-03-02', event: 'Late arrival', type: 'deduction', amount: 50, reason: 'Arrived at 10:00 AM' },
      { date: '2026-03-03', event: 'Left early', type: 'deduction', amount: 100, reason: 'Left at 1:00 PM' },
      { date: '2026-03-04', event: 'Overtime', type: 'bonus', amount: 150, reason: 'Weekend work for deployment' },
      { date: '2026-03-10', event: 'Absence', type: 'deduction', amount: 100, reason: 'Unexcused absence' },
    ]
  },
  {
    month: 'April', monthIndex: 3, year: 2026, basicSalary: 5000, bonus: 0, deduction: 150, netSalary: 4850, status: 'pending',
    details: [
      { date: '2026-04-02', event: 'Late arrival', type: 'deduction', amount: 50, reason: 'Arrived at 9:30 AM' },
      { date: '2026-04-08', event: 'Left early', type: 'deduction', amount: 100, reason: 'Left at 3:00 PM' },
    ]
  },
  {
    month: 'May', monthIndex: 4, year: 2026, basicSalary: 5000, bonus: 400, deduction: 0, netSalary: 5400, status: 'pending',
    details: [
      { date: '2026-05-10', event: 'Project completion', type: 'bonus', amount: 400, reason: 'Completed major milestone ahead of schedule' },
    ]
  },
  {
    month: 'June', monthIndex: 5, year: 2026, basicSalary: 5000, bonus: 200, deduction: 50, netSalary: 5150, status: 'pending',
    details: [
      { date: '2026-06-05', event: 'Late arrival', type: 'deduction', amount: 50, reason: 'Arrived at 9:15 AM' },
      { date: '2026-06-18', event: 'Overtime', type: 'bonus', amount: 200, reason: 'Worked Saturday for release' },
    ]
  },
  {
    month: 'July', monthIndex: 6, year: 2026, basicSalary: 5000, bonus: 0, deduction: 0, netSalary: 5000, status: 'pending',
    details: []
  },
  {
    month: 'August', monthIndex: 7, year: 2026, basicSalary: 5000, bonus: 250, deduction: 100, netSalary: 5150, status: 'pending',
    details: [
      { date: '2026-08-03', event: 'Late arrival', type: 'deduction', amount: 50, reason: 'Arrived at 9:20 AM' },
      { date: '2026-08-12', event: 'Left early', type: 'deduction', amount: 50, reason: 'Left at 4:00 PM' },
      { date: '2026-08-20', event: 'Training bonus', type: 'bonus', amount: 250, reason: 'Completed advanced certification' },
    ]
  },
  {
    month: 'September', monthIndex: 8, year: 2026, basicSalary: 5000, bonus: 600, deduction: 0, netSalary: 5600, status: 'pending',
    details: [
      { date: '2026-09-01', event: 'Performance bonus', type: 'bonus', amount: 400, reason: 'Top performer Q3' },
      { date: '2026-09-15', event: 'Perfect week bonus', type: 'bonus', amount: 200, reason: 'Full attendance weeks 1-2' },
    ]
  },
  {
    month: 'October', monthIndex: 9, year: 2026, basicSalary: 5000, bonus: 100, deduction: 200, netSalary: 4900, status: 'pending',
    details: [
      { date: '2026-10-05', event: 'Late arrival', type: 'deduction', amount: 100, reason: 'Arrived at 10:30 AM twice' },
      { date: '2026-10-12', event: 'Left early', type: 'deduction', amount: 100, reason: 'Left at 2:00 PM' },
      { date: '2026-10-25', event: 'Overtime', type: 'bonus', amount: 100, reason: 'Stayed for system migration' },
    ]
  },
  {
    month: 'November', monthIndex: 10, year: 2026, basicSalary: 5000, bonus: 800, deduction: 0, netSalary: 5800, status: 'pending',
    details: [
      { date: '2026-11-01', event: 'Employee of Month', type: 'bonus', amount: 500, reason: 'Employee of the Month award' },
      { date: '2026-11-15', event: 'Perfect week bonus', type: 'bonus', amount: 300, reason: 'Full attendance all month' },
    ]
  },
  {
    month: 'December', monthIndex: 11, year: 2026, basicSalary: 5000, bonus: 1000, deduction: 0, netSalary: 6000, status: 'pending',
    details: [
      { date: '2026-12-20', event: 'Annual bonus', type: 'bonus', amount: 1000, reason: 'Year-end performance bonus' },
    ]
  },
];

// Tasks data
export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
  assignedTo: string;
  attachments: TaskAttachment[];
  comments: TaskComment[];
  dueTime?: string;
  completedAt?: string;
}

export const dailyTasks: DailyTask[] = [
  {
    id: 't1', title: 'Complete Sprint Review Presentation', description: 'Prepare slides for the sprint review meeting with stakeholders. Include velocity charts and demo screenshots.',
    status: 'in_progress', priority: 'high', date: '2026-03-04', assignedTo: 'e1', dueTime: '14:00',
    attachments: [
      { id: 'a1', name: 'sprint_review_template.pptx', type: 'pptx', size: '2.4 MB' },
      { id: 'a2', name: 'velocity_chart.png', type: 'png', size: '340 KB' },
    ],
    comments: [
      { id: 'c1', userId: 'e2', userName: 'Sara Chen', text: 'Don\'t forget to include the design system updates!', timestamp: '2026-03-04T09:15:00' },
      { id: 'c2', userId: 'e1', userName: 'Ahmed Al-Rashid', text: 'Good point, I\'ll add that section. Thanks!', timestamp: '2026-03-04T09:30:00' },
    ],
  },
  {
    id: 't2', title: 'Update API Documentation', description: 'Review and update the REST API docs for the new endpoints added in v2.3.',
    status: 'not_started', priority: 'medium', date: '2026-03-04', assignedTo: 'e1', dueTime: '17:00',
    attachments: [
      { id: 'a3', name: 'api_spec_v2.3.yaml', type: 'yaml', size: '156 KB' },
    ],
    comments: [
      { id: 'c3', userId: 'e4', userName: 'Maria Garcia', text: 'I can help review once you\'re done.', timestamp: '2026-03-04T08:45:00' },
    ],
  },
  {
    id: 't3', title: 'Fix Login Bug #4521', description: 'Users reporting intermittent login failures on mobile devices. Investigate and fix.',
    status: 'completed', priority: 'urgent', date: '2026-03-04', assignedTo: 'e1', dueTime: '11:00', completedAt: '2026-03-04T10:30:00',
    attachments: [
      { id: 'a4', name: 'error_logs.txt', type: 'txt', size: '89 KB' },
      { id: 'a5', name: 'screenshot_bug.png', type: 'png', size: '520 KB' },
    ],
    comments: [
      { id: 'c4', userId: 'e7', userName: 'Yuki Tanaka', text: 'This might be related to the session timeout issue.', timestamp: '2026-03-03T16:00:00' },
      { id: 'c5', userId: 'e1', userName: 'Ahmed Al-Rashid', text: 'Confirmed - fixed the session handling. PR merged.', timestamp: '2026-03-04T10:35:00' },
    ],
  },
  {
    id: 't4', title: 'Code Review: Payment Module', description: 'Review the payment module refactoring PR submitted by the backend team.',
    status: 'paused', priority: 'medium', date: '2026-03-04', assignedTo: 'e1', dueTime: '16:00',
    attachments: [
      { id: 'a6', name: 'pr_diff_summary.md', type: 'md', size: '45 KB' },
    ],
    comments: [
      { id: 'c6', userId: 'e3', userName: 'John Smith', text: 'Waiting on the test coverage report before final review.', timestamp: '2026-03-04T11:00:00' },
    ],
  },
  {
    id: 't5', title: 'Team Standup Notes', description: 'Document key decisions and blockers from the daily standup meeting.',
    status: 'completed', priority: 'low', date: '2026-03-04', assignedTo: 'e1', dueTime: '09:30', completedAt: '2026-03-04T09:35:00',
    attachments: [],
    comments: [
      { id: 'c7', userId: 'e5', userName: 'James Lee', text: 'Shared the notes in the team channel.', timestamp: '2026-03-04T09:40:00' },
    ],
  },
  {
    id: 't6', title: 'Deploy Staging Build', description: 'Build and deploy the latest development branch to the staging environment for QA testing.',
    status: 'not_started', priority: 'high', date: '2026-03-04', assignedTo: 'e1', dueTime: '15:00',
    attachments: [
      { id: 'a7', name: 'deploy_checklist.md', type: 'md', size: '12 KB' },
    ],
    comments: [],
  },
];
