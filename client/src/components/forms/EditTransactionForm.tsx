import { useState } from "react";
import type { Category, Transaction, TransactionUpdate } from "../../types";
import { CURRENCIES } from "../../lib/constants";
import { Modal } from "../ui/Modal";
import { useApp } from "@/context/AppContext";

interface EditTransactionFormProps {
    onClose: () => void;
    transaction: Transaction;
    categories: Category[];
}

export function EditTransactionForm({
    onClose,
    transaction,
    categories,
}: EditTransactionFormProps) {
    const { editTransaction, getAccounts, getTransactions } = useApp();

    const [editTxForm, setEditTxForm] = useState<TransactionUpdate>({
        categoryId: transaction.categoryId,
        amount: Math.abs(transaction.amount),
        currency: transaction.currency,
        transactionDate: transaction.transactionDate.toString(),
        description: transaction.description,
        notes: transaction.notes,
        isCredit: transaction.isCredit ?? false,
        isIncome: transaction.isIncome,
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const set = <K extends keyof typeof editTxForm>(
        key: K,
        val: (typeof editTxForm)[K],
    ) => setEditTxForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = async () => {
        setIsSubmitted(true);

        if (!editTxForm.description.trim() || !editTxForm.amount) return;
        if (editTxForm.categoryId === 0) return;

        await editTransaction(transaction.id, editTxForm);
        await getAccounts();
        await getTransactions();

        onClose();
    };

    const inputCls =
        "w-full px-3 py-2.5 rounded-lg bg-[#060c14] text-slate-100 border border-[#1e293b] text-[13px] " +
        "focus:border-amber-400/50 focus:outline-none transition-colors";

    const labelCls =
        "text-[9px] tracking-[0.14em] text-slate-500 uppercase mb-1.5 block";

    console.log("transaction form:", editTxForm);
    console.log("categoryId:", editTxForm.categoryId);
    console.log("categories:", categories);
    
    return (
        <Modal
            title="Edit Transaction"
            onClose={onClose}
        >
            <div className="grid grid-cols-2 gap-3.5">
                {/* Type */}
                <div>
                    <label className={labelCls}>Type *</label>
                    <select
                        className={inputCls}
                        value={editTxForm.isCredit ? "credit" : "debit"}
                        onChange={(e) =>
                            set("isCredit", e.target.value === "credit")
                        }
                    >
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>

                {/* Income or Expense */}
                <div>
                    <label className={labelCls}>Income or Expense *</label>
                    <select
                        className={inputCls}
                        value={String(editTxForm.isIncome)}
                        onChange={(e) =>
                            set("isIncome", e.target.value === "true")
                        }
                    >
                        <option value="true">Income (money in)</option>
                        <option value="false">Expense (money out)</option>
                    </select>
                </div>

                {/* Amount + Currency */}
                <div className="col-span-2">
                    <label className={labelCls}>Amount *</label>
                    <div className="flex gap-2 w-fit">
                        <select
                            className={inputCls}
                            value={editTxForm.currency}
                            onChange={(e) => set("currency", e.target.value)}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        <input
                            className={inputCls}
                            type="number"
                            placeholder="0.00"
                            value={editTxForm.amount}
                            onChange={(e) =>
                                set("amount", e.target.valueAsNumber)
                            }
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                    <label className={labelCls}>Category *</label>
                    {isSubmitted && editTxForm.categoryId === 0 && (
                        <p className="text-red-400 text-[11px] mb-1">
                            A category is required...
                        </p>
                    )}
                    <select
                        className={inputCls}
                        value={editTxForm.categoryId}
                        onChange={(e) =>
                            set("categoryId", parseInt(e.target.value))
                        }
                    >
                        <option
                            value={0}
                            disabled
                        >
                            Select a category...
                        </option>
                        {categories.map((c) => (
                            <option
                                key={c.id}
                                value={c.id}
                            >
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div className="col-span-2">
                    <label className={labelCls}>Description *</label>
                    <input
                        className={inputCls}
                        type="text"
                        placeholder="e.g. Whole Foods"
                        value={editTxForm.description}
                        onChange={(e) => set("description", e.target.value)}
                    />
                </div>

                {/* Notes */}
                <div className="col-span-2">
                    <label className={labelCls}>Notes</label>
                    <textarea
                        className={`${inputCls} h-16 resize-none`}
                        placeholder="Optional notes..."
                        value={editTxForm.notes}
                        onChange={(e) => set("notes", e.target.value)}
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="col-span-2 py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide hover:bg-amber-300 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </Modal>
    );
}
