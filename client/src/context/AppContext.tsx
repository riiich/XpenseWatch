import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from "react";
import type { Account, Category, Transaction } from "../types";
import { randomId } from "../lib/utils";

interface AppContextValue {
    accounts: Account[];
    categories: Category[];
    selectedAccId: number;
    setSelectedAccId: (id: number) => void;
    selectedCategoryId: number | null;
    setSelectedCategoryId: (id: number) => void;
    addAccount: (acc: Account) => void;
    addTransaction: (accId: number, tx: Omit<Transaction, "id">) => void;
    // deleteTransaction: (accId: number, txId: string) => void;
    isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [selectedAccId, setSelectedAccId] = useState<number>(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const addAccount = (acc: Account) => {
        setAccounts((prev) => [...prev, acc]);
        setSelectedAccId(acc.id);
    };

    useEffect(() => {
        // load user's accounts
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

            const accounts: Account[] = data.map((a: Account) => ({
                id: a.id,
                name: a.name,
                type: a.type,
                balance: a.balance,
            }));

            setAccounts(accounts);
			// setSelectedAccId(accounts[0].id);
            setIsLoading(false);
        };

        // load the categories
        const getCategories = async () => {
            setIsLoading(true);

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
            setIsLoading(false);
        };

        getAccounts();
        getCategories();
    }, []);

    // load the user's current account transactions
    useEffect(() => {
		if(!selectedAccId) return;

        const getTransactions = async () => {
            setIsLoading(true);

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
                amount: t.amount,
                currency: t.currency,
                description: t.description,
                notes: t.notes,
            }));

            console.log("transaction data: ", transactionData);
        };

        getTransactions();
        setIsLoading(false);
    }, [selectedAccId]);

    const addTransaction = (accId: number, tx: Omit<Transaction, "id">) => {
        setAccounts((prev) =>
            prev.map((a) => {
                if (a.id !== accId) return a;
                const newBalance =
                    tx.type === "credit"
                        ? a.balance + tx.amount
                        : a.balance - tx.amount;
                // const newSaved =
                //     tx.type === "credit" ? a.saved + tx.amount : a.saved;
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

    // const deleteTransaction = (accId: string, txId: string) => {
    //     setAccounts((prev) =>
    //         prev.map((a) =>
    //             a.id === accId
    //                 ? {
    //                       ...a,
    //                       transactions: a.transactions.filter(
    //                           (t) => t.id !== txId,
    //                       ),
    //                   }
    //                 : a,
    //         ),
    //     );
    // };

    return (
        <AppContext.Provider
            value={{
                accounts,
                categories,
                selectedAccId,
                setSelectedAccId,
                selectedCategoryId,
                setSelectedCategoryId,
                addAccount,
                addTransaction,
                // deleteTransaction,
                isLoading,
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
