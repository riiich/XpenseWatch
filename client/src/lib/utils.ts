import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const fmt = (n: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

export const shortDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

export const randomId = () => Math.random();
