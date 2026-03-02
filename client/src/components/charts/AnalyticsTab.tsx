import { useState, useMemo } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import type { Account } from "../../types";
import { fmt } from "../../lib/utils";

interface AnalyticsTabProps {
  account: Account;
}

type Range = "7d" | "30d" | "90d" | "1y";

const RANGE_DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };

const PIE_COLORS = [
  "#fbbf24", "#60a5fa", "#4ade80", "#f97316",
  "#a78bfa", "#f43f5e", "#34d399", "#e879f9", "#94a3b8",
];

const TOOLTIP_STYLE = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  fontSize: 11,
  color: "#f8fafc",
};

export function AnalyticsTab({ account }: AnalyticsTabProps) {
  const [range, setRange] = useState<Range>("30d");

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RANGE_DAYS[range]);
    return account.transactions.filter((t) => new Date(t.date) >= cutoff);
  }, [account.transactions, range]);

  const totalSpend = useMemo(
    () => filtered.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0),
    [filtered]
  );
  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0),
    [filtered]
  );

  // Pie: spending by category
  const pieData = useMemo(() => {
    const totals: Record<string, number> = {};
    filtered.filter((t) => t.type === "debit").forEach((t) => {
      totals[t.category] = (totals[t.category] ?? 0) + t.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // Bar: daily spending
  const barData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter((t) => t.type === "debit").forEach((t) => {
      map[t.date] = (map[t.date] ?? 0) + t.amount;
    });
    return Object.entries(map).sort().map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount,
    }));
  }, [filtered]);

  // Line: running balance
  const lineData = useMemo(() => {
    let running = 0;
    return [...filtered]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((t) => {
        running += t.type === "credit" ? t.amount : -t.amount;
        return {
          date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          balance: running,
        };
      });
  }, [filtered]);

  const noData = filtered.length === 0;

  return (
    <div className="animate-fade-in">
      {/* Header row */}
      <div className="flex justify-between items-center mb-5">
        {/* Stat cards */}
        <div className="flex gap-4">
          {[
            { label: "TOTAL SPEND",  value: fmt(totalSpend,  account.currency), color: "text-rose-400"    },
            { label: "TOTAL INCOME", value: fmt(totalIncome, account.currency), color: "text-emerald-400" },
            {
              label: "NET",
              value: fmt(totalIncome - totalSpend, account.currency),
              color: totalIncome - totalSpend >= 0 ? "text-emerald-400" : "text-rose-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#0a1422] border border-[#1e293b] rounded-xl px-5 py-3 flex flex-col gap-1"
            >
              <span className="text-[9px] tracking-[0.15em] text-slate-500">{s.label}</span>
              <span className={`font-display text-lg font-semibold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Range selector */}
        <div className="flex gap-1">
          {(["7d", "30d", "90d", "1y"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-[11px] border transition-colors ${
                range === r
                  ? "bg-[#111d2e] text-amber-400 border-amber-400/40"
                  : "text-slate-500 border-[#1e293b] hover:text-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {noData ? (
        <div className="text-center py-16 text-slate-600 text-sm">
          No transactions in this time range.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Daily Spending bar */}
          <div className="bg-[#0a1422] border border-[#1e293b] rounded-xl p-5">
            <h4 className="text-[10px] tracking-[0.12em] text-slate-500 mb-4">DAILY SPENDING</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [fmt(v), "Spend"]} />
                <Bar dataKey="amount" fill="#fbbf24" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie */}
          <div className="bg-[#0a1422] border border-[#1e293b] rounded-xl p-5">
            <h4 className="text-[10px] tracking-[0.12em] text-slate-500 mb-4">SPENDING BY CATEGORY</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [fmt(v), ""]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Running Balance line — full width */}
          <div className="col-span-2 bg-[#0a1422] border border-[#1e293b] rounded-xl p-5">
            <h4 className="text-[10px] tracking-[0.12em] text-slate-500 mb-4">RUNNING BALANCE</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [fmt(v), "Balance"]} />
                <Line type="monotone" dataKey="balance" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
