import { useState, useEffect } from "react";
import { SLOW_LOAD_SECONDS } from "../../backend/slots";

// true once "loading" has lasted longer than SLOW_LOAD_SECONDS
export function useSlowLoad(loading, seconds = SLOW_LOAD_SECONDS) {
    const [slow, setSlow] = useState(false);

    useEffect(() => {
        if (!loading) {
            setSlow(false);
            return;
        }
        const timer = setTimeout(() => setSlow(true), seconds * 1000);
        return () => clearTimeout(timer);
    }, [loading, seconds]);

    return slow;
}