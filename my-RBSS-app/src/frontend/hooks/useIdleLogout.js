import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../backend/User";
import { IDLE_LOGOUT_MINUTES } from "../../backend/slots";

// Logs the user out after IDLE_LOGOUT_MINUTES without any mouse / keyboard / touch activity.
// To test quickly set IDLE_LOGOUT_MINUTES = 0.5 in slots.js
export function useIdleLogout() {
    const navigate = useNavigate();

    useEffect(() => {
        let timer;

        const logout = async () => {
            try {
                await authService.signOut();
            } finally {
                navigate("/", { replace: true });
            }
        };

        const reset = () => {
            clearTimeout(timer);
            timer = setTimeout(logout, IDLE_LOGOUT_MINUTES * 60 * 1000);
        };

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((e) => window.addEventListener(e, reset));
        reset();   // start the timer

        return () => {
            clearTimeout(timer);
            events.forEach((e) => window.removeEventListener(e, reset));
        };
    }, [navigate]);
}