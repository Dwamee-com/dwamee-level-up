import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Check, Coins } from 'lucide-react';
import { rewards } from '@/data/mockData';
import { currentEmployee } from '@/data/mockData';

export default function Rewards() {
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
  const balance = currentEmployee.pointsBalance;

  const handleRedeem = (id: string) => {
    setRedeemed(prev => new Set(prev).add(id));
  };

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Rewards</h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
          <Coins className="w-4 h-4 text-accent" />
          <span className="font-bold text-sm text-accent">{balance}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rewards.map((reward, i) => {
          const canAfford = balance >= reward.pointsCost;
          const isRedeemed = redeemed.has(reward.id);

          return (
            <motion.div
              key={reward.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-4 flex flex-col items-center text-center relative overflow-hidden ${
                !canAfford && !isRedeemed ? 'opacity-60' : ''
              }`}
            >
              {isRedeemed && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
              <span className="text-3xl mb-2">{reward.icon}</span>
              <h3 className="text-sm font-semibold mb-1">{reward.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-3">{reward.description}</p>
              <div className="flex items-center gap-1 mb-3">
                <Coins className="w-3 h-3 text-accent" />
                <span className="text-xs font-bold text-accent">{reward.pointsCost}</span>
              </div>
              {!isRedeemed && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!canAfford}
                  onClick={() => handleRedeem(reward.id)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                    canAfford
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (
                    <>
                      <ShoppingBag className="w-3 h-3" /> Redeem
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> Locked
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
