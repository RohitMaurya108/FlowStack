import React, { useState } from 'react';
import { X, Sparkles, CreditCard, ShieldCheck, Check, Lock, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, user, setUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleSimulateStripeCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setUser((prev) => ({ ...prev, plan: 'pro' }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100 relative">
        <button
          onClick={() => {
            setIsSuccess(false);
            setIsUpgradeModalOpen(false);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Subscription Upgraded!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Welcome to FlowStack Pro. Unlimited Gemini AI Sidekick, Gantt Timelines, and Burndown Analytics are now unlocked!
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setIsUpgradeModalOpen(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
            >
              Continue to Workspace
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>FlowStack Pro Plan Upgrade</span>
              </div>
              <h3 className="text-lg font-black text-white">Unlock High-Velocity Team Features</h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-2">
                <span>FlowStack Pro Membership</span>
                <span className="text-indigo-400">$12.00 / month</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] pt-1">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Unlimited Gemini 3.6 Flash AI Sidekick & Subtask specs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Gantt Critical Path Timelines & Calendar schedules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Recharts Burndown Velocity & Team Workload Analytics</span>
                </li>
              </ul>
            </div>

            {/* Simulated Stripe Card Input */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                <span className="flex items-center space-x-1">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Stripe Secure Express Checkout</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-500">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL</span>
                </span>
              </div>
              <input
                type="text"
                readOnly
                value="•••• •••• •••• 4242 (Demo Stripe Card)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg font-mono text-slate-300 text-xs"
              />
            </div>

            <button
              onClick={handleSimulateStripeCheckout}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Confirm & Pay $12.00 via Stripe</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
