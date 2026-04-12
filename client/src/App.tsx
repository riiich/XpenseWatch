import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import AuthPage from "./pages/auth/AuthPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import "./styles/globals.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { authed } = useAuth();
    return authed ? (
        <>{children}</>
    ) : (
        <Navigate
            to="/auth"
            replace
        />
    );
}

function AppRoutes() {
    const { authed } = useAuth();

    return (
        <Routes>
            <Route
                path="/auth"
                element={
                    authed ? (
                        <Navigate
                            to="/"
                            replace
                        />
                    ) : (
                        <AuthPage />
                    )
                }
            />
            <Route
                path="/"	
                element={
                    <ProtectedRoute>
                        <AppProvider>
                            <DashboardPage />
                        </AppProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <AppProvider>
                            <SettingsPage />
                        </AppProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
