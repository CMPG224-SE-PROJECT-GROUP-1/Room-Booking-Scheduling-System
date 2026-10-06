import { useState, useEffect } from "react";
import { authService } from "../../backend/User";

export function useMyRole() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        let alive = true;
        authService.getCurrentProfile().then((p) => {
            if (alive) setRole(p?.role ?? null);
        });
        return () => { alive = false; };
    }, []);

    return role;
}