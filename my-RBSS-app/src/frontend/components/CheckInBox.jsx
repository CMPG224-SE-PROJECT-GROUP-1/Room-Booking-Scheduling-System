import { useState, useEffect } from "react";
import Button from "./Button";
import { bookingManager } from "../../backend/BookingManager";
import { CHECK_IN_GRACE_MINUTES } from "../../backend/slots";


export default function CheckInBox({ booking, onDone }) {
    const [code, setCode] = useState("");
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [, setTick] = useState(0);

    // re-check the clock every 30 seconds so the box appears by itself
    useEffect(() => {
        const t = setInterval(() => setTick((n) => n + 1), 30000);
        return () => clearInterval(t);
    }, []);

    if (booking.checked_in) return <div className="code-chip">✔ Checked in</div>;

    const graceMs = CHECK_IN_GRACE_MINUTES * 60 * 1000;
    const start = new Date(booking.start_time).getTime();
    const now = Date.now();
    const windowOpen = now >= start - graceMs && now <= start + graceMs;

    if (!windowOpen) {
        if (now < start - graceMs) {
            const opens = new Date(start - graceMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return <div className="booking-meta">Check-in opens at {opens}</div>;
        }
        return null;   // window closed
    }

    const onCheckIn = async () => {
        setMsg(null);
        setLoading(true);
        try {
            await bookingManager.processCheckIn(booking.booking_id, code);
            setMsg("Checked in!");
            if (onDone) await onDone();
        } catch (err) {
            setMsg(err.message || "Could not check in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                placeholder="4-digit code"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button variant="solid" disabled={loading} onClick={onCheckIn}>
                {loading ? "Checking in..." : "Check in"}
            </Button>
            {msg && <div className="booking-meta">{msg}</div>}
        </div>
    );
}