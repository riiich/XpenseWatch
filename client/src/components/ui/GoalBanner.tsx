import type { Account } from "../../types";
import { fmt } from "../../lib/utils";

interface GoalBannerProps {
  account: Account;
}

export function GoalBanner({ account }: GoalBannerProps) {
  if (account.type === "credit" || account.goal <= 0) return null;

  const pct = Math.min((account.saved / account.goal) * 100, 100);
  const remaining = account.goal - account.saved;

  return (
    <div className="bg-gradient-to-br from-[#0f1e35] to-[#111827] border border-[#1e293b] rounded-xl px-6 py-5 mb-6 animate-fade-in">
      {/* Top row */}
      <div className="flex justify-between mb-4">
        <div>
          <span className="block text-[9px] tracking-[0.15em] text-slate-500 mb-1">
            SAVINGS GOAL
          </span>
          <span className="font-display text-xl font-semibold text-slate-100">
            {fmt(account.goal, account.currency)}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[9px] tracking-[0.15em] text-slate-500 mb-1">
            REMAINING
          </span>
          <span
            className={`font-display text-xl font-semibold ${
              remaining > 0 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {remaining > 0 ? fmt(remaining, account.currency) : "ACHIEVED ✓"}
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative h-1 bg-[#1e293b] rounded-full mb-2">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] transition-all duration-700"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        <span className="text-[11px] text-slate-500">
          {fmt(account.saved, account.currency)} saved
        </span>
        <span className="text-[11px] text-amber-400 font-medium">
          {pct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
