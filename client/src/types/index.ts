export type AccountType = "checking" | "credit" | "savings" | "investment";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  goal: number;
  saved: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  notes: string;
  category: string;
  type: "debit" | "credit";
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type TabType = "transactions" | "charts" | "ai";
export type AuthView = "login" | "signup";
