import type { Transaction } from "../../types";
import { fmt, shortDate } from "../../lib/utils";

interface TransactionRowProps {
    transaction: Transaction;
    onDelete: (id: number) => void;
}

export function TransactionRow({ transaction: tx, onDelete }: TransactionRowProps) {
    const isCredit = tx.type === "credit";

    return (
        <div className="flex items-center gap-10 px-3 py-3 rounded-lg border-b border-[#0f172a] hover:bg-[#0a1422] transition-colors group">
            {/* Date */}
            <span className="text-[12px] text-slate-500 w-22 shrink-0">
                {shortDate(tx.transactionDate)}
            </span>

            {/* Category dot */}
            <div className="w-1.5 h-1.5 rounded-full shrink-0" />

            {/* Description + notes */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <span className="text-[12px] text-slate-200 truncate">
                    {tx.description}
                </span>
                {tx.notes && (
                    <span className="text-[11px] text-slate-500 truncate">
                        {tx.notes}
                    </span>
                )}
            </div>

            {/* Category */}
            <span className="text-[12px] text-slate-500 tracking-wide w-1/7 shrink-0 sm:block">
                {tx.categoryName}
            </span>

            {/* Amount */}
            <span
                className={`text-[14px] font-medium tracking-wide w-28 text-right shrink-0 ${
                    isCredit ? "text-emerald-400" : "text-slate-100"
                }`}
            >
                {tx.isIncome ? (
                    <span className="text-emerald-400">
                        +{fmt(tx.amount, tx.currency)}
                    </span>
                ) : (
                    <span className="text-red-400">
                        -{fmt(tx.amount, tx.currency)}
                    </span>
                )}
            </span>

            {/* Delete */}
            <button
                onClick={() => onDelete(tx.id)}
                className="text-red-400 text-xl hover:text-2xl leading-none w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete transaction"
            >
                🗑️
            </button>
        </div>
    );
}
