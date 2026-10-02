import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../backend/User";

export default function ProtectedRoutes() {
    const [checking, setChecking] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        authService.getCurrentSession().then((s) => {
            setSession(s);
            setChecking(false);
        });

        const unsubscribe = authService.onAuthStateChange((s) => setSession(s));
        return unsubscribe;
    }, []);

    if (checking) return <p>Loading...</p>;
    if (!session) return <Navigate to="/" replace />;

    return <Outlet />;
}