import type { Transaction } from "../../types";
import { DEFAULT_CATEGORIES } from "../../lib/constants";
import { fmt, shortDate } from "../../lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionRow({ transaction: tx, onDelete }: TransactionRowProps) {
  const isCredit = tx.type === "credit";
  const catColor =
    DEFAULT_CATEGORIES.find((c) => c.name === tx.category)?.color ?? "#64748b";

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg border-b border-[#0f172a] hover:bg-[#0a1422] transition-colors group">
      {/* Date */}
      <span className="text-[11px] text-slate-500 w-14 shrink-0">
        {shortDate(tx.date)}
      </span>

      {/* Category dot */}
      <div
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: catColor }}
      />

      {/* Description + notes */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[12px] text-slate-200 truncate">{tx.description}</span>
        {tx.notes && (
          <span className="text-[10px] text-slate-500 truncate">{tx.notes}</span>
        )}
      </div>

      {/* Category */}
      <span className="text-[10px] text-slate-500 tracking-wide w-24 shrink-0 hidden sm:block">
        {tx.category}
      </span>

      {/* Amount */}
      <span
        className={`text-[13px] font-medium tracking-wide w-28 text-right shrink-0 ${
          isCredit ? "text-emerald-400" : "text-slate-100"
        }`}
      >
        {isCredit ? "+" : "−"}
        {fmt(tx.amount, tx.currency)}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(tx.id)}
        className="text-slate-700 hover:text-rose-400 text-lg leading-none w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete transaction"
      >
        ×
      </button>
    </div>
  );
}
