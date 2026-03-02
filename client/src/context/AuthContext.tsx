import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextValue {
  authed: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);

  return (
    <AuthContext.Provider
      value={{ authed, login: () => setAuthed(true), logout: () => setAuthed(false) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
