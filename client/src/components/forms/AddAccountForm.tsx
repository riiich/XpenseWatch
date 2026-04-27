import { useState } from "react";
import type { Account, AccountType } from "../../types";
import { CURRENCIES, ACCOUNT_TYPE_LABELS } from "../../lib/constants";
import { Modal } from "../ui/Modal";
import { useApp } from "@/context/AppContext";

interface AddAccountFormProps {
    onClose: () => void;
}

export function AddAccountForm({ onClose }: AddAccountFormProps) {
	const { addAccount, selectedAccId } = useApp();
    const [form, setForm] = useState({
        name: "",
        type: "checking" as AccountType,
        currency: "USD",
        balance: 0,
    });

    const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
        setForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = async () => {
        if (!form.name.trim()) return;

        // api call to save account
        const res = await fetch("http://localhost:5095/api/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                name: form.name.trim(),
                type: form.type,
				currency: form.currency,
                balance: form.balance,
            }),
        });

		const data = await res.json();
		addAccount(data);

        onClose();
    };

    const inputCls =
        "w-full px-3 py-2.5 rounded-lg bg-[#060c14] text-slate-100 border border-[#1e293b] text-[12px] " +
        "focus:border-amber-400/50 focus:outline-none transition-colors";

    const labelCls =
        "text-[9px] tracking-[0.14em] text-slate-500 uppercase mb-1.5 block";

    return (
        <Modal
            title="New Account"
            onClose={onClose}
            maxWidth="max-w-sm"
        >
            <div className="grid grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="col-span-2">
                    <label className={labelCls}>Account Name</label>
                    <input
                        className={inputCls}
                        type="text"
                        placeholder="e.g. Chase Checking"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Type */}
                <div>
                    <label className={labelCls}>Type</label>
                    <select
                        className={inputCls}
                        value={form.type}
                        onChange={(e) =>
                            set("type", e.target.value as AccountType)
                        }
                    >
                        {(
                            Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]
                        ).map((t) => (
                            <option
                                key={t}
                                value={t}
                            >
                                {ACCOUNT_TYPE_LABELS[t]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Currency */}
                <div>
                    <label className={labelCls}>Currency</label>
                    <select
                        className={inputCls}
                        value={form.currency}
                        onChange={(e) => set("currency", e.target.value)}
                    >
                        {CURRENCIES.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Balance */}
                <div className="col-span-2">
                    <label className={labelCls}>Balance</label>
                    <input
                        className={inputCls}
                        type="number"
                        placeholder="0.00"
                        value={form.balance}
                        onChange={(e) => set("balance", parseFloat(e.target.value))}
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="col-span-2 py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide hover:bg-amber-300 transition-colors"
                >
                    Create Account
                </button>
            </div>
        </Modal>
    );
}
