import type { Account, Category } from "../types";

export const CURRENCIES = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "CHF",
    "CNY",
    "KRW",
    "OTHER ",
];

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 1, name: "Groceries" },
    { id: 2, name: "Travel" },
    { id: 3, name: "Dining" },
    { id: 4, name: "Housing" },
    { id: 5, name: "Health" },
    { id: 6, name: "Entertainment" },
    { id: 7, name: "Utilities" },
    { id: 8, name: "Shopping" },
    { id: 9, name: "Income" },
    { id: 10, name: "Other" },
];

export const MOCK_ACCOUNTS: Account[] = [
    {
        id: 1,
        name: "Chase Checking",
        type: "checking",
        balance: 8432.5,
        // currency: "USD",
        // goal: 15000,
        // saved: 8432.5,
        // transactions: [
        //   { id: "t1", date: "2026-02-20", amount: 142.3,  currency: "USD", description: "Whole Foods Market", notes: "",                category: "Groceries",     type: "debit"  },
        //   { id: "t2", date: "2026-02-18", amount: 3200,   currency: "USD", description: "Salary Deposit",     notes: "February payroll", category: "Income",        type: "credit" },
        //   { id: "t3", date: "2026-02-17", amount: 68.0,   currency: "USD", description: "Uber Eats",          notes: "",                category: "Dining",        type: "debit"  },
        //   { id: "t4", date: "2026-02-15", amount: 1200,   currency: "USD", description: "Rent Payment",       notes: "March rent",       category: "Housing",       type: "debit"  },
        //   { id: "t5", date: "2026-02-12", amount: 340,    currency: "USD", description: "Flight to NYC",      notes: "Business trip",    category: "Travel",        type: "debit"  },
        //   { id: "t6", date: "2026-02-10", amount: 89.99,  currency: "USD", description: "Netflix + Spotify",  notes: "",                category: "Entertainment", type: "debit"  },
        // ],
    },
    {
        id: 2,
        name: "Amex Platinum",
        type: "credit",
        balance: -2140.75,
        // currency: "USD",
        // goal: 0,
        // saved: 0,
        // transactions: [
        //   { id: "t7", date: "2026-02-22", amount: 420.0,  currency: "USD", description: "Delta Airlines",       notes: "",                 category: "Travel",   type: "debit" },
        //   { id: "t8", date: "2026-02-19", amount: 215.3,  currency: "USD", description: "Best Buy",             notes: "Keyboard",         category: "Shopping", type: "debit" },
        //   { id: "t9", date: "2026-02-14", amount: 180.5,  currency: "USD", description: "Cheesecake Factory",   notes: "Valentine's dinner", category: "Dining", type: "debit" },
        // ],
    },
    {
        id: 3,
        name: "High-Yield Savings",
        type: "savings",
        balance: 22100,
        // currency: "USD",
        // goal: 50000,
        // saved: 22100,
        // transactions: [
        //   { id: "t10", date: "2026-02-01", amount: 500, currency: "USD", description: "Monthly Transfer", notes: "", category: "Income", type: "credit" },
        //   { id: "t11", date: "2026-01-01", amount: 500, currency: "USD", description: "Monthly Transfer", notes: "", category: "Income", type: "credit" },
        // ],
    },
];

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
    checking: "Checking",
    credit: "Credit",
    savings: "Savings",
    investment: "Investment",
    travel: "Travel",
    entertainment: "Entertainment",
    food: "Food",
    highYields: "High-Yields Savings",
    other: "Other",
};

export const ACCOUNT_TYPE_ICONS: Record<string, string> = {
    checking: "⬡",
    credit: "◈",
    savings: "◉",
    investment: "◆",
};
