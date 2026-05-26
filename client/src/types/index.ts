export type AccountType =
    | "checking"
    | "credit"
    | "savings"
    | "investment"
    | "travel"
    | "other";

export interface Account {
    id: number;
    name: string;
    type: AccountType;
    balance: number;
    // saved: number;
    // transactions: Transaction[];
}

export interface Transaction {
    id: number;
    transactionDate: string;
    accountName: string;
    categoryName: string;
    amount: number;
    currency: string;
    description: string;
    notes: string;
    isIncome: boolean;
    type: "debit" | "credit";
}

export interface Category {
    id: number;
    name: string;
}

export interface Goal {
    id: number;
    title: string;
    accountId: number;
    description?: string;
    targetGoal: number;
}

export interface AnalyticsTabProps {
    account: Account;
    transactions: Transaction[];
}

export type TabType = "transactions" | "charts" | "ai";
export type AuthView = "login" | "signup";
