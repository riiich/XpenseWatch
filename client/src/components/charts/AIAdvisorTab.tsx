import { useState, useMemo } from "react";
import type { Account } from "../../types";
import { fmt } from "../../lib/utils";
import { ACCOUNT_TYPE_LABELS } from "../../lib/constants";

interface AIAdvisorTabProps {
  account: Account;
}

export function AIAdvisorTab({ account }: AIAdvisorTabProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string>("");

  const topCategory = useMemo(() => {
    const totals: Record<string, number> = {};
    account.transactions
      .filter((t) => t.type === "debit")
      .forEach((t) => {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
      });
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    return sorted[0] ?? null;
  }, [account]);

  const totalSpend = useMemo(
    () =>
      account.transactions
        .filter((t) => t.type === "debit")
        .reduce((s, t) => s + t.amount, 0),
    [account]
  );

  const pct =
    account.goal > 0
      ? ((account.saved / account.goal) * 100).toFixed(1)
      : null;

  const fetchInsight = async () => {
    setLoading(true);
    setOpen(true);
    setInsight("");

    const prompt = `The user has an expense tracker account named "${account.name}" (${ACCOUNT_TYPE_LABELS[account.type]}).
Current balance: ${fmt(account.balance, account.currency)}.
${account.goal > 0 ? `Savings goal: ${fmt(account.goal)} — currently ${pct}% achieved.` : "No savings goal set."}
Top spending category this month: ${topCategory ? `${topCategory[0]} at ${fmt(topCategory[1])}` : "none"}.
Total spend across all transactions: ${fmt(totalSpend)}.
Total transactions: ${account.transactions.length}.

Give exactly 3 concise, specific, actionable financial insights to help this user improve their finances and reach their goal faster. Be direct and data-driven. Format as 3 separate short paragraphs, each starting with a bolded action title like **Title:** followed by the advice.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text =
        data.content
          ?.map((b: { type: string; text?: string }) => b.text ?? "")
          .join("\n") ?? "Unable to load insights.";
      setInsight(text);
    } catch {
      setInsight("Could not connect to the AI service. Please try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setInsight("");
  };

  // Parse **Bold:** prefix into styled paragraphs
  const renderInsight = (raw: string) =>
    raw
      .split("\n")
      .filter(Boolean)
      .map((para, i) => {
        const match = para.match(/^\*\*(.+?):\*\*\s*(.*)/);
        if (match) {
          return (
            <p key={i} className="text-[13px] text-slate-300 leading-relaxed mb-4">
              <span className="text-amber-400 font-medium">{match[1]}: </span>
              {match[2]}
            </p>
          );
        }
        return (
          <p key={i} className="text-[13px] text-slate-300 leading-relaxed mb-4">
            {para}
          </p>
        );
      });

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#0a1422] to-[#0f1e35] border border-[#1e3052] rounded-2xl p-7">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-400 text-lg">◈</span>
              <span className="text-sm font-medium text-slate-100">AI Financial Advisor</span>
            </div>
            <p className="text-[11px] text-slate-500 tracking-wide">
              Powered by Claude · Analyzes your account data
            </p>
          </div>

          {!open ? (
            <button
              onClick={fetchInsight}
              className="px-5 py-2.5 rounded-lg bg-[#1e3052] border border-[#2d4a75] text-blue-400
                text-[11px] tracking-wide hover:bg-[#243d66] transition-colors"
            >
              Get Insights
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-lg border border-[#1e293b] text-slate-500
                text-[11px] tracking-wide hover:text-slate-300 transition-colors"
            >
              Close
            </button>
          )}
        </div>

        {/* Context chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: "Balance",  value: fmt(account.balance, account.currency) },
            { label: "Spend",    value: fmt(totalSpend, account.currency) },
            ...(topCategory ? [{ label: "Top Category", value: topCategory[0] }] : []),
            ...(pct ? [{ label: "Goal Progress", value: `${pct}%` }] : []),
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#060c14] border border-[#1e293b] rounded-full"
            >
              <span className="text-[9px] tracking-[0.12em] text-slate-500">{chip.label}</span>
              <span className="text-[11px] text-slate-300">{chip.value}</span>
            </div>
          ))}
        </div>

        {/* Loading state */}
        {open && loading && (
          <div className="flex items-center gap-3 py-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-dot inline-block"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-[13px] text-slate-500">Analyzing your finances…</span>
          </div>
        )}

        {/* Insight text */}
        {open && !loading && insight && (
          <div className="pt-2 border-t border-[#1e293b] mt-2 animate-fade-in">
            {renderInsight(insight)}
          </div>
        )}

        {/* Idle prompt */}
        {!open && (
          <p className="text-[12px] text-slate-500 leading-relaxed">
            Ask AI to analyze your spending patterns, evaluate your progress toward your savings
            goal, and give personalized recommendations to improve your financial health.
          </p>
        )}
      </div>
    </div>
  );
}
