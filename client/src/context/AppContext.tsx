import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from "react";
import type {
    Account,
    Category,
    Transaction,
    TransactionUpdate,
} from "../types";
import { randomId } from "../lib/utils";

interface AppContextValue {
    accounts: Account[];
    categories: Category[];
    transactions: Transaction[];
    getAccounts: () => Promise<void>;
    getTransactions: () => Promise<void>;
    selectedAccId: number;
    setSelectedAccId: (id: number) => void;
    selectedCategoryId: number;
    setSelectedCategoryId: (id: number) => void;
    addAccount: (acc: Account) => void;
    addTransaction: (accId: number, tx: Omit<Transaction, "id">) => void;
    editTransaction: (txId: number, txEdit: TransactionUpdate) => void;
    deleteTransaction: (accId: number, txId: number) => void;
    isLoading: boolean;
    isTransactionLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isTransactionLoading, setIsTransactionLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedAccId, setSelectedAccId] = useState<number>(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

    const addAccount = (acc: Account) => {
        setAccounts((prev) => [...prev, acc]);
        setSelectedAccId(acc.id);
    };

    const getAccounts = async () => {
        setIsLoading(true);

        const transactionRes = await fetch(
            "http://localhost:5095/api/accounts",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        );

        const data = await transactionRes.json();

        const accountData: Account[] = data.map((a: Account) => ({
            id: a.id,
            name: a.name,
            type: a.type,
            balance: a.balance,
        }));

        setAccounts(accountData);

        if (accountData.length > 0 && !selectedAccId) {
            setSelectedAccId(accountData[0].id); // have to select first account id so it can fetch the correct transactions
        }

        setIsLoading(false);
    };

    const getCategories = async () => {
        const categoryRes = await fetch(
            "http://localhost:5095/api/categories",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        );

        const data = await categoryRes.json();

        const categories: Category[] = data.map((c: Category) => ({
            id: c.id,
            name: c.name,
        }));

        setCategories(categories);
        setSelectedCategoryId(0);
    };

    const getTransactions = async () => {
        setIsTransactionLoading(true);

        const res = await fetch(
            `http://localhost:5095/api/transactions/${selectedAccId}/transactions`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        );

        const data = await res.json();

        const transactionData = data.map((t: Transaction) => ({
            id: t.id,
            transactionDate: t.transactionDate,
            accountName: t.accountName,
            categoryName: t.categoryName,
            categoryId: t.categoryId,
            amount: t.amount,
            currency: t.currency,
            description: t.description,
            notes: t.notes,
            isIncome: t.isIncome,
            isCredit: t.isCredit,
        }));

        setTransactions(transactionData);
        setIsTransactionLoading(false);
    };

    // immediately fetch the accounts and categories on load
    useEffect(() => {
        getAccounts();
        getCategories();
    }, []);

    // load the user's current account transactions
    useEffect(() => {
        if (!selectedAccId) return;

        getTransactions();
    }, [selectedAccId]);

    const addTransaction = (accId: number, tx: Omit<Transaction, "id">) => {
        setAccounts((prev) =>
            prev.map((a) => {
                if (a.id !== accId) return a;

                const newBalance =
                    tx.type === "credit"
                        ? a.balance + tx.amount
                        : a.balance - tx.amount;
                // const newSaved = tx.type === "credit" ? a.saved + tx.amount : a.saved;
                return {
                    ...a,
                    balance: newBalance,
                    // saved: newSaved,
                    transactions: [
                        { ...tx, id: randomId() },
                        // ...a.transactions,
                    ],
                };
            }),
        );
    };

    const editTransaction = async (txId: number, txEdit: TransactionUpdate) => {
        const res = await fetch(
            `http://localhost:5095/api/transactions/${txId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(txEdit),
            },
        );

        const data = await res.json();

        console.log("edited transaction: ", data);
    };

    const deleteTransaction = async (txId: number) => {
        const res = await fetch(
            `http://localhost:5095/api/transactions/${txId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            },
        );

        const data = await res.json();

        console.log("deleted data: ", data);

        getTransactions();
    };

    return (
        <AppContext.Provider
            value={{
                accounts,
                categories,
                transactions,
                getAccounts,
                getTransactions,
                selectedAccId,
                setSelectedAccId,
                selectedCategoryId,
                setSelectedCategoryId,
                addAccount,
                addTransaction,
                editTransaction,
                deleteTransaction,
                isLoading,
                isTransactionLoading,
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
