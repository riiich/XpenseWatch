import { createContext, useContext, useState, type ReactNode } from "react";
import type { Account, Category, Transaction } from "../types";
import { MOCK_ACCOUNTS, DEFAULT_CATEGORIES } from "../lib/constants";
import { randomId } from "../lib/utils";

interface AppContextValue {
  accounts: Account[];
  categories: Category[];
  selectedAccId: string;
  setSelectedAccId: (id: string) => void;
  addAccount: (acc: Account) => void;
  addTransaction: (accId: string, tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (accId: string, txId: string) => void;
  addCategory: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedAccId, setSelectedAccId] = useState<string>(MOCK_ACCOUNTS[0].id);

  const addAccount = (acc: Account) => {
    setAccounts((prev) => [...prev, acc]);
    setSelectedAccId(acc.id);
  };

  const addTransaction = (accId: string, tx: Omit<Transaction, "id">) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== accId) return a;
        const newBalance =
          tx.type === "credit" ? a.balance + tx.amount : a.balance - tx.amount;
        const newSaved =
          tx.type === "credit" ? a.saved + tx.amount : a.saved;
        return {
          ...a,
          balance: newBalance,
          saved: newSaved,
          transactions: [{ ...tx, id: randomId() }, ...a.transactions],
        };
      })
    );
  };

  const deleteTransaction = (accId: string, txId: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accId
          ? { ...a, transactions: a.transactions.filter((t) => t.id !== txId) }
          : a
      )
    );
  };

  const addCategory = (name: string) => {
    const palette = ["#fbbf24", "#60a5fa", "#4ade80", "#f97316", "#a78bfa", "#f43f5e", "#34d399"];
    setCategories((prev) => [
      ...prev,
      { id: randomId(), name, color: palette[prev.length % palette.length], icon: "◈" },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        accounts,
        categories,
        selectedAccId,
        setSelectedAccId,
        addAccount,
        addTransaction,
        deleteTransaction,
        addCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
