import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextValue {
    authed: boolean;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        password: string,
    ) => Promise<any>;
    login: (username: string, password: string) => Promise<any>;
    logout: () => void;
    demo: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authed, setAuthed] = useState(false); // if true, go to main page

    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        password: string,
    ) => {
        const res = await fetch("http://localhost:5095/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            return { status: res.status, success: true, data: data };
        } else {
            return {
                success: false,
                status: res.status,
                code: data.code,
                errorMsg: data.errorMsg,
                errors: data.errors ?? [],
            };
        }
    };

    const login = async (username: string, password: string) => {
        const res = await fetch("http://localhost:5095/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await res.json();

        if (res.status === 200) {
            localStorage.setItem("token", data.token);
            setAuthed(true);
            return {
                status: res.status,
                isSuccess: true,
                data: data,
            };
        } else {
            return {
				status: res.status,
                isSuccess: false,
				errorMsg: data.errorMsg
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuthed(false);
    };

    const demo = () => {
        setAuthed(true);
    };

    return (
        <AuthContext.Provider
            value={{
                authed,
                register,
                login,
                logout,
                demo,
            }}
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
