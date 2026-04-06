import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Lock, Check, Coins, Users, Share2, ExternalLink, X } from 'lucide-react';
import { rewards, allEmployees } from '@/data/mockData';
import { currentEmployee } from '@/data/mockData';

export default function Rewards() {
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
  const [sharedOnMeta, setSharedOnMeta] = useState<Set<string>>(new Set());
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [showRedeemers, setShowRedeemers] = useState<string | null>(null);
  const balance = currentEmployee.pointsBalance;

  const handleShare = (rewardId: string) => {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href + '?reward=' + rewardId), '_blank', 'width=600,height=400');
    setSharedOnMeta(prev => new Set(prev).add(rewardId));
  };

  const handleRedeem = (id: string) => {
    if (!sharedOnMeta.has(id)) {
      setSelectedReward(id);
      return;
    }
    setRedeemed(prev => new Set(prev).add(id));
  };

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Rewards</h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
          <Coins className="w-4 h-4 text-accent" />
          <span className="font-bold text-sm text-accent">{balance}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rewards.map((reward, i) => {
          const canAfford = balance >= reward.pointsCost;
          const isRedeemed = redeemed.has(reward.id);
          const isShared = sharedOnMeta.has(reward.id);
          const redeemerNames = reward.redeemedBy.map(id => allEmployees.find(e => e.id === id)?.name).filter(Boolean);

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
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
              <span className="text-3xl mb-2">{reward.icon}</span>
              <h3 className="text-sm font-semibold mb-1">{reward.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-2">{reward.description}</p>

              {redeemerNames.length > 0 && (
                <button
                  onClick={() => setShowRedeemers(showRedeemers === reward.id ? null : reward.id)}
                  className="flex items-center gap-1 text-[9px] text-muted-foreground mb-2 hover:text-foreground transition-colors"
                >
                  <Users className="w-2.5 h-2.5" />
                  {redeemerNames.length} redeemed
                </button>
              )}

              <AnimatePresence>
                {showRedeemers === reward.id && redeemerNames.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full overflow-hidden mb-2"
                  >
                    <div className="bg-secondary rounded-lg p-2 space-y-1">
                      {redeemerNames.map((name, ni) => (
                        <div key={ni} className="flex items-center gap-1.5 text-[10px]">
                          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[7px] font-bold">
                            {name!.charAt(0)}
                          </div>
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-1 mb-3">
                <Coins className="w-3 h-3 text-accent" />
                <span className="text-xs font-bold text-accent">{reward.pointsCost}</span>
              </div>

              {!isRedeemed && canAfford && (
                <div className="w-full space-y-1.5">
                  {!isShared && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare(reward.id)}
                      className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 bg-blue-50 text-[#1877F2] border border-[#1877F2]/20"
                    >
                      <Share2 className="w-3 h-3" /> Share on Meta
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={!isShared}
                    onClick={() => handleRedeem(reward.id)}
                    className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                      isShared
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {isShared ? (
                      <><ShoppingBag className="w-3 h-3" /> Redeem</>
                    ) : (
                      <><Lock className="w-3 h-3" /> Share First</>
                    )}
                  </motion.button>
                </div>
              )}

              {!isRedeemed && !canAfford && (
                <div className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 bg-muted text-muted-foreground cursor-not-allowed">
                  <Lock className="w-3 h-3" /> Not Enough Points
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Share Prompt Dialog */}
      <AnimatePresence>
        {selectedReward && !sharedOnMeta.has(selectedReward) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 max-w-sm w-full text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                <Share2 className="w-7 h-7 text-[#1877F2]" />
              </div>
              <h3 className="text-lg font-bold font-display">Share to Unlock</h3>
              <p className="text-sm text-muted-foreground">You must share this achievement on Meta (Facebook) before you can redeem this reward.</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleShare(selectedReward);
                  setSelectedReward(null);
                }}
                className="w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Share on Facebook
              </motion.button>
              <button onClick={() => setSelectedReward(null)} className="text-xs text-muted-foreground">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
