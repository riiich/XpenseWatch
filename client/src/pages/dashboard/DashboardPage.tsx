import { useState } from "react";
import { Sidebar } from "../../components/layouts/Sidebar";
import { GoalBanner } from "../../components/ui/GoalBanner";
import { TransactionRow } from "../../components/ui/TransactionRow";
import { AddTransactionForm } from "../../components/forms/AddTransactionForm";
import { AddAccountForm } from "../../components/forms/AddAccountForm";
import { AnalyticsTab } from "../../components/charts/AnalyticsTab";
import { AIAdvisorTab } from "../../components/charts/AIAdvisorTab";
import { useApp } from "../../context/AppContext";
import { useSelectedAccount } from "../../hooks/useSelectedAccount";
import { ACCOUNT_TYPE_LABELS } from "../../lib/constants";
import { fmt } from "../../lib/utils";
import type { TabType } from "../../types";

export default function DashboardPage() {
    const {
        addAccount,
        transactions,
        addTransaction,
        // deleteTransaction,
        categories,
        selectedAccId,
        selectedCategoryId,
        isLoading,
    } = useApp();
    const account = useSelectedAccount();

    const [activeTab, setActiveTab] = useState<TabType>("transactions");
    const [showAddTx, setShowAddTx] = useState(false);
    const [showAddAcc, setShowAddAcc] = useState(false);

    const TABS: { id: TabType; label: string }[] = [
        { id: "transactions", label: "Transactions" },
        { id: "charts", label: "Analytics" },
        { id: "ai", label: "AI Advisor" },
    ];

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <h1 className="font-bold text-4xl">Loading...</h1>
                </div>
            ) : (
                <div className="flex h-screen bg-[#060c14] overflow-hidden">
                    <Sidebar onAddAccount={() => setShowAddAcc(true)} />

                    {/* Main */}
                    <main className="flex-1 overflow-y-auto px-10 py-8">
                        {/* Account header */}
                        <header className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="font-display text-3xl font-semibold text-slate-100 mb-1">
                                    {account.name}
                                </h1>
                                <span className="text-[10px] tracking-[0.15em] text-slate-500 uppercase">
                                    {ACCOUNT_TYPE_LABELS[account.type]} Account
                                </span>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="text-right">
                                    <span className="block text-[9px] tracking-[0.15em] text-slate-500 mb-1">
                                        BALANCE
                                    </span>
                                    <span
                                        className={`font-display text-[26px] font-semibold ${
                                            account.balance >= 0
                                                ? "text-slate-100"
                                                : "text-rose-400"
                                        }`}
                                    >
                                        {fmt(account.balance)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setShowAddTx(true)}
                                    className="px-5 py-2.5 rounded-lg bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide hover:bg-amber-300 transition-colors"
                                >
                                    + Transaction
                                </button>
                            </div>
                        </header>

                        {/* Goal banner */}
                        <GoalBanner account={account} />

                        {/* Tabs */}
                        <div className="flex gap-1 border-b border-[#1e293b] mb-6">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`px-4 py-2.5 text-[11px] tracking-wide rounded-t-md -mb-px border-b-2 transition-colors ${
                                        activeTab === t.id
                                            ? "text-amber-400 border-amber-400"
                                            : "text-slate-500 border-transparent hover:text-slate-300"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        {activeTab === "transactions" && (
                            <div className="animate-fade-in">
                                {transactions.length === 0 ||
                                transactions === undefined ? (
                                    <div className="text-center py-20">
                                        <div className="text-6xl text-[#1e293b] mb-4">
                                            ◇
                                        </div>
                                        <p className="text-slate-600 text-sm mb-5">
                                            No transactions yet
                                        </p>
                                        <button
                                            onClick={() => setShowAddTx(true)}
                                            className="px-5 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] text-amber-400 text-[12px] hover:bg-[#111d2e] transition-colors"
                                        >
                                            Add your first transaction
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Column headers */}
                                        <div className="flex items-center gap-3 px-3 pb-2 border-b border-[#1e293b] text-slate-100 mb-1">
                                            <span className="text-[11px] tracking-[0.12em] w-14">
                                                DATE
                                            </span>
                                            <span className="w-20" />
                                            <span className="text-[11px] tracking-[0.12em] flex-1">
                                                DESCRIPTION
                                            </span>
                                            <span className="text-[11px] tracking-[0.12em] w-1/6 sm:block">
                                                CATEGORY
                                            </span>
                                            <span className="text-[11px] tracking-[0.12em] w-28 text-right">
                                                AMOUNT
                                            </span>
                                        </div>

                                        {transactions.map((t) => (
                                            <TransactionRow
                                                key={t.id}
                                                transaction={t}
                                                // onDelete={(id) =>
                                                //     deleteTransaction(selectedAccId, id)
                                                // }
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === "charts" && (
                            <AnalyticsTab account={account} />
                        )}
                        {activeTab === "ai" && (
                            <AIAdvisorTab account={account} />
                        )}
                    </main>

                    {/* Modals */}
                    {showAddTx && (
                        <AddTransactionForm
                            onClose={() => setShowAddTx(false)}
                            onAdd={(tx) => addTransaction(selectedAccId, tx)}
                            categories={categories}
                        />
                    )}
                    {showAddAcc && (
                        <AddAccountForm onClose={() => setShowAddAcc(false)} />
                    )}
                </div>
            )}
        </>
    );
}
