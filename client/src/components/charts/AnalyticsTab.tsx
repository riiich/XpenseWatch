import { useState, useMemo } from "react";
import {
	BarChart,
	Bar,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
	ReferenceLine,
	PieChart,
	Pie,
	Legend,
} from "recharts";
import type { Account, Transaction, Goal, AnalyticsTabProps } from "../../types";
import { fmt } from "../../lib/utils";

type Range = "7d" | "weekly" | "monthly" | "yearly" | "all";

const MOCK_GOAL: Goal = {
	id: 1,
	title: "Emergency Fund",
	accountId: 0,
	description: "6 months of expenses",
	targetGoal: 10000,
};

const TOOLTIP_STYLE = {
	background: "#060c14",
	border: "1px solid #1e3052",
	borderRadius: 8,
	fontSize: 11,
	color: "#f8fafc",
	boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
};

const PIE_COLORS = [
	"#fbbf24",
	"#60a5fa",
	"#4ade80",
	"#f97316",
	"#a78bfa",
	"#f43f5e",
	"#34d399",
	"#e879f9",
	"#94a3b8",
];

const BAR_COLOR = "#fbbf24";
const AREA_COLOR = "#60a5fa";
const INCOME_COLOR = "#34d399";
const SPEND_COLOR = "#f43f5e";

function StatCard({
	label,
	value,
	sub,
	accent,
}: {
	label: string;
	value: string;
	sub?: string;
	accent?: string;
}) {
	return (
		<div className="bg-[#0a1422] border border-[#1e3052] rounded-2xl px-5 py-4 flex flex-col gap-1.5">
			<span className="text-[9px] tracking-[0.18em] text-slate-500 uppercase">{label}</span>
			<span className={`font-display text-xl font-semibold ${accent ?? "text-slate-100"}`}>
				{value}
			</span>
			{sub && <span className="text-[10px] text-slate-600">{sub}</span>}
		</div>
	);
}

export function AnalyticsTab({ account, transactions }: AnalyticsTabProps) {
	const [range, setRange] = useState<Range>("monthly");

	// ── Filtered transactions ──────────────────────────────────────────
	const filtered = useMemo(() => {
		if (range === "all") return transactions;

		const now = new Date();
		let cutoff: Date;

		if (range === "7d") {
			cutoff = new Date(now);
			cutoff.setDate(now.getDate() - 7);
		} else if (range === "weekly") {
			cutoff = new Date(now);
			cutoff.setDate(now.getDate() - 8 * 7); // past 8 weeks
		} else if (range === "monthly") {
			cutoff = new Date(now);
			cutoff.setMonth(now.getMonth() - 6); // past 6 months
		} else {
			cutoff = new Date(now);
			cutoff.setFullYear(now.getFullYear() - 1);
		}

		return transactions.filter((t) => new Date(t.transactionDate) >= cutoff);
	}, [transactions, range]);

	const totalSpend = useMemo(
		() => filtered.filter((t) => !t.isIncome).reduce((s, t) => s + t.amount, 0),
		[filtered],
	);
	const totalIncome = useMemo(
		() => filtered.filter((t) => t.isIncome).reduce((s, t) => s + t.amount, 0),
		[filtered],
	);
	const net = totalIncome - totalSpend;

	// ── Bar chart data ─────────────────────────────────────────────────
	const barData = useMemo(() => {
		const buckets: Record<string, { income: number; spend: number }> = {};

		filtered.forEach((t) => {
			let key: string;
			if (range === "7d") {
				key = t.transactionDate;
			} else if (range === "weekly") {
				const d = new Date(t.transactionDate);
				const startOfWeek = new Date(d);
				startOfWeek.setDate(d.getDate() - d.getDay());
				key = startOfWeek.toISOString().slice(0, 10);
			} else {
				key = t.transactionDate.slice(0, 7);
			}

			if (!buckets[key]) buckets[key] = { income: 0, spend: 0 };
			if (t.isIncome) buckets[key].income += t.amount;
			else buckets[key].spend -= Math.abs(t.amount); // negative
		});

		return Object.entries(buckets)
			.sort()
			.map(([key, vals]) => {
				let label: string;
				if (range === "7d") {
					label = new Date(key).toLocaleDateString("en-US", {
						weekday: "short",
						month: "short",
						day: "numeric",
					});
				} else if (range === "weekly") {
					label = `Wk ${new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
				} else {
					label = new Date(key + "-01").toLocaleDateString("en-US", {
						month: "short",
						year: "numeric",
					});
				}
				return {
					label,
					income: parseFloat(vals.income.toFixed(2)),
					spend: parseFloat(vals.spend.toFixed(2)),
				};
			});
	}, [filtered, range]);

	const pieData = useMemo(() => {
		const totals: Record<string, number> = {};
		(range === "all" ? transactions : filtered)
			.filter((t) => !t.isIncome)
			.forEach((t) => {
				totals[t.categoryName] = (totals[t.categoryName] ?? 0) + Math.abs(t.amount);
			});
		return Object.entries(totals).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
	}, [filtered]);

	// ── Goal ──────────────────────────────────────────────────────────
	const goal = MOCK_GOAL;
	const goalProgress = Math.min((account.balance / goal.targetGoal) * 100, 100);
	const goalRemaining = Math.max(goal.targetGoal - account.balance, 0);

	const noData = filtered.length === 0;

	const RANGE_LABELS: Record<Range, string> = {
		"7d": "Past 7 Days",
		weekly: "By Week",
		monthly: "By Month",
		yearly: "This Year",
		all: "All Time",
	};

	return (
		<div className="animate-fade-in space-y-5">
			{/* ── Range selector ── */}
			<div className="flex items-center justify-between">
				<span className="text-[10px] tracking-[0.15em] text-slate-500 uppercase">
					{RANGE_LABELS[range]}
				</span>
				<div className="flex gap-1 bg-[#0a1422] border border-[#1e3052] rounded-xl p-1">
					{(["7d", "weekly", "monthly", "yearly", "all"] as Range[]).map((r) => (
						<button
							key={r}
							onClick={() => setRange(r)}
							className={`px-3 py-1.5 rounded-lg text-[11px] tracking-wide transition-all ${
								range === r
									? "bg-[#1e3052] text-amber-400 shadow-inner"
									: "text-slate-500 hover:text-slate-300"
							}`}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			{/* ── Stat cards ── */}
			<div className="grid grid-cols-4 gap-3">
				<StatCard
					label="Balance"
					value={fmt(account.balance)}
					accent={account.balance >= 0 ? "text-slate-100" : "text-rose-400"}
				/>
				<StatCard
					label="Total Spend"
					value={fmt(totalSpend)}
					accent="text-rose-400"
					sub={RANGE_LABELS[range]}
				/>
				<StatCard
					label="Total Income"
					value={fmt(totalIncome)}
					accent="text-emerald-400"
					sub={RANGE_LABELS[range]}
				/>
			</div>

			{/* ── Goal card ── */}
			<div className="bg-[#0a1422] border border-[#1e3052] rounded-2xl p-5">
				<div className="flex justify-between items-start mb-3">
					<div>
						<div className="flex items-center gap-2 mb-0.5">
							<span className="text-amber-400 text-xs">◎</span>
							<span className="text-[11px] tracking-wide text-slate-300 font-medium">
								{goal.title}
							</span>
							<span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
								MOCK
							</span>
						</div>
						{goal.description && (
							<p className="text-[10px] text-slate-600 ml-4">{goal.description}</p>
						)}
					</div>
					<div className="text-right">
						<span className="text-[10px] text-slate-500">Target</span>
						<p className="text-sm font-semibold text-slate-200">{fmt(goal.targetGoal)}</p>
					</div>
				</div>

				{/* Progress bar */}
				<div className="relative h-2 bg-[#1e3052] rounded-full overflow-hidden mb-3">
					<div
						className="absolute inset-y-0 left-0 bg-amber-400 rounded-full transition-all duration-700"
						style={{ width: `${goalProgress}%` }}
					/>
				</div>

				<div className="flex justify-between items-center">
					<div className="flex items-center gap-1.5">
						<span className="text-amber-400 font-semibold text-sm">{fmt(account.balance)}</span>
						<span className="text-slate-600 text-[10px]">saved</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] text-slate-600">{goalProgress.toFixed(1)}% there ·</span>
						<span className="text-[10px] text-slate-500">{fmt(goalRemaining)} remaining</span>
					</div>
				</div>
			</div>

			{noData ? (
				<div className="text-center py-16 text-slate-600 text-sm">
					No transactions in this time range.
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4">
					{/* ── Bar: Spending over time ── */}
					<div className="bg-[#0a1422] border border-[#1e3052] rounded-2xl p-5">
						<h4 className="text-[10px] tracking-[0.15em] text-slate-500 mb-4 uppercase">
							Income vs Spending — {RANGE_LABELS[range]}
						</h4>
						<ResponsiveContainer width="100%" height={200}>
							<BarChart
								data={barData}
								barSize={50}
								margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#1e3052" />
								<XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 13 }} />
								<YAxis
									tick={{ fill: "#64748b", fontSize: 10 }}
									tickFormatter={(v) => `$${Math.abs(v)}`}
								/>
								<ReferenceLine y={0} stroke="#1e3052" strokeWidth={2} />
								<Tooltip
									contentStyle={TOOLTIP_STYLE}
									cursor={{ fill: "transparent" }}
									formatter={(v: number, name: string) => [
										fmt(Math.abs(v)),
										name === "income" ? "Income" : "Spend",
									]}
								/>
								<Bar
									dataKey="income"
									// stackId="a"
									fill={INCOME_COLOR}
									radius={[4, 4, 0, 0]}
									activeBar={false}
								/>
								<Bar
									dataKey="spend"
									// stackId="a"
									fill={SPEND_COLOR}
									radius={[0, 0, 4, 4]}
									activeBar={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					<div className="bg-[#0a1422] border border-[#1e3052] rounded-2xl p-5">
						<h4 className="text-[10px] tracking-[0.15em] text-slate-500 mb-4 uppercase">
							Spending by Category
						</h4>
						<ResponsiveContainer width="100%" height={200}>
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									innerRadius={0}
									outerRadius={80}
									dataKey="value"
									nameKey="name"
									paddingAngle={3}
								>
									{pieData.map((_, i) => (
										<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={TOOLTIP_STYLE}
									labelStyle={{ color: "#f8fafc" }}
									itemStyle={{ color: "#f8fafc" }}
									formatter={(v: number, name: string) => [fmt(v), name]}
								/>
								<Legend
									iconType="circle"
									iconSize={8}
									wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</div>
	);
}
