import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../backend/User";

// Login and sign-up pages: if you are already logged in, go to the dashboard.
export default function PublicOnlyRoute() {
    const [checking, setChecking] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        authService.getCurrentSession().then((s) => {
            setSession(s);
            setChecking(false);
        });
    }, []);

    if (checking) return <p>Loading...</p>;
    if (session) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}