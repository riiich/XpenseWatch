import { useApp } from "../context/AppContext";

export function useSelectedAccount() {
    const { accounts, selectedAccId } = useApp();
    const account = accounts.find((a) => a.id === selectedAccId) ?? accounts[0];
    return account;
}
