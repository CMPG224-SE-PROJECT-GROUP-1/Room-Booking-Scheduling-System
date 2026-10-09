import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../backend/User";
import "./Loader.css";


export default function RoleRoute({ allow = ["admin"] }) {
    const [checking, setChecking] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        authService.getCurrentProfile().then((p) => {
            setRole(p?.role ?? null);
            setChecking(false);
        });
    }, []);

    if (checking) return <div class="loader"></div>;
    if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}