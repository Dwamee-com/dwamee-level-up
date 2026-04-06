import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Clock, Calendar, Award, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { monthlyWinners, currentEmployee } from '@/data/mockData';
import { getLevelTitle, getShieldEmoji } from '@/data/models';
import jsPDF from 'jspdf';

function generateCertificate(winner: typeof monthlyWinners[0]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  doc.setDrawColor(24, 109, 181);
  doc.setLineWidth(3);
  doc.rect(10, 10, w - 20, doc.internal.pageSize.getHeight() - 20);
  doc.setLineWidth(1);
  doc.rect(14, 14, w - 28, doc.internal.pageSize.getHeight() - 28);

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('DWAMEE GAME HR', w / 2, 30, { align: 'center' });

  doc.setFontSize(32);
  doc.setTextColor(24, 109, 181);
  doc.text('EMPLOYEE OF THE MONTH', w / 2, 55, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('This certificate is proudly presented to', w / 2, 75, { align: 'center' });

  doc.setFontSize(28);
  doc.setTextColor(30, 30, 30);
  doc.text(winner.employee.name, w / 2, 95, { align: 'center' });

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1);
  doc.line(w / 2 - 60, 100, w / 2 + 60, 100);

  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`For outstanding performance in ${winner.month} ${winner.year}`, w / 2, 115, { align: 'center' });
  doc.text(`Level ${winner.employee.level} · ${getLevelTitle(winner.employee.level)}`, w / 2, 125, { align: 'center' });
  doc.text(`Prize: $${winner.prize}`, w / 2, 135, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.line(w / 2 - 40, 165, w / 2 + 40, 165);
  doc.text('CEO Signature', w / 2, 172, { align: 'center' });

  doc.save(`Employee_of_Month_${winner.month}_${winner.year}.pdf`);
}

export default function EmployeeOfMonth() {
  const current = monthlyWinners[0];
  const past = monthlyWinners.slice(1);
  const [sharedOnMeta, setSharedOnMeta] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysLeft = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const handleShareOnMeta = () => {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank', 'width=600,height=400');
    setSharedOnMeta(true);
  };

  const handleClaimReward = () => {
    if (sharedOnMeta) {
      setRewardClaimed(true);
    }
  };

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <h1 className="text-2xl font-bold font-display">Employee of the Month</h1>

      {/* Winner Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-6 text-center glow-gold relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <span className="text-4xl mb-3 block">🏆</span>
        <div className="w-20 h-20 rounded-full bg-accent/10 border-3 border-accent mx-auto flex items-center justify-center text-3xl font-bold mb-3">
          {current.employee.name.charAt(0)}
        </div>
        <h2 className="text-xl font-bold font-display">{current.employee.name}</h2>
        <p className="text-sm text-muted-foreground">{current.month} {current.year}</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">Lv {current.employee.level}</p>
            <p className="text-[10px] text-muted-foreground">{getLevelTitle(current.employee.level)}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold">{current.employee.xp} XP</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-accent">${current.prize}</p>
            <p className="text-[10px] text-muted-foreground">Prize</p>
          </div>
        </div>
        <div className="mt-3">
          <span className="text-sm">{getShieldEmoji(current.employee.shieldType)} {current.employee.shieldType} Shield</span>
        </div>

        {/* Share & Claim Section */}
        <div className="mt-4 space-y-2">
          {!sharedOnMeta ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShareOnMeta}
              className="w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share Achievement on Meta
            </motion.button>
          ) : !rewardClaimed ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClaimReward}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> Claim Your Reward!
            </motion.button>
          ) : (
            <div className="w-full py-3 rounded-xl bg-emerald-100 text-success font-semibold text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Reward Claimed!
            </div>
          )}

          {sharedOnMeta && !rewardClaimed && (
            <p className="text-[10px] text-success flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" /> Shared on Meta — You can now claim!
            </p>
          )}

          {!sharedOnMeta && (
            <p className="text-[10px] text-muted-foreground">Share on Meta first to unlock the reward</p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => generateCertificate(current)}
          className="mt-3 w-full py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2 border border-primary/20"
        >
          <Download className="w-4 h-4" />
          Download Certificate
        </motion.button>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Next Announcement</p>
          <p className="text-xs text-muted-foreground">{daysLeft} days remaining</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">{daysLeft}</span>
        </div>
      </motion.div>

      {/* Past Winners */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Past Winners
        </h3>
        {past.map((w, i) => (
          <motion.div
            key={`${w.month}-${w.year}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card p-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm">
              {w.employee.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{w.employee.name}</p>
              <p className="text-[10px] text-muted-foreground">{w.month} {w.year} · Lv {w.employee.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-accent">${w.prize}</p>
              <button
                onClick={() => generateCertificate(w)}
                className="text-[10px] text-primary underline"
              >
                PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
