import { useState, useEffect, useCallback } from "react";
import { bookingManager } from "../../backend/BookingManager";

export function useMyBookings() {
    const [activeBookings, setActiveBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [actionError, setActionError] = useState(null);

    const load = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setActionError(null);

            const bookings = await bookingManager.fetchBookings();
            const now = new Date();

            const active = [];
            const pastOrCancelled = [];

            (bookings || []).forEach((b) => {
                const isFuture = new Date(b.end_time) >= now;
                if (b.status === true && isFuture) {
                    active.push(b);
                } else {
                    pastOrCancelled.push(b);
                }
            });

            active.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

            setActiveBookings(active);
            setPastBookings(pastOrCancelled);
        } catch (err) {
            console.error("Bookings error:", err);
            setActionError("Failed to sync reservations from the server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function cancel(bookingId) {
        const reason = window.prompt("Please enter a reason for cancelling this booking:");
        if (reason === null) return;
        if (!reason.trim()) {
            setActionError("Please enter a reason for cancellation.");   
            return;
        }
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            setCancellingId(bookingId);
            await bookingManager.cancelBooking(bookingId, reason.trim());
            await load(true);
        } catch (err) {
            console.error("Cancel failed:", err);
            setActionError(err.message || "Unable to cancel booking. Please try again.");
        } finally {
            setCancellingId(null);
        }
    }

    return {
        activeBookings, pastBookings, loading, cancellingId,
        actionError, setActionError, cancel, reload: () => load(true)
    };
}