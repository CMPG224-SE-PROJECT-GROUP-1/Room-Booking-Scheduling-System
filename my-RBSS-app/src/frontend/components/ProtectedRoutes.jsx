import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../backend/User";
import "./Loader.css";

// Layout route: logged in -> show the child routes, otherwise go to the login page ("/")
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

    if (checking) return <div class="loader"></div>;
    if (!session) return <Navigate to="/" replace />;

    return <Outlet />;
}