import Card from "./Card";
import Button from "./Button";
import CheckInBox from "./CheckInBox";
import EditBookingBox from "./EditBookingBox";

const fmtDay = (iso) =>
    new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


function statusLabel(b) {
    if (b.status === false) {
        return b.cancel_reason?.startsWith("No check-in") ? "No-show" : "Cancelled";
    }
    return b.checked_in ? "Completed" : "No-show";
}

export function ActiveBookingCard({ booking: b, cancelling, onCancel, onChanged }) {
    return (
        <Card className="booking-card">
            <div className="booking-details">
                <div className="booking-room">
                    {b.rooms?.building || "Building"} • Room {b.rooms?.room_number || b.room_id}
                </div>
                <div className="booking-time">
                    {fmtDay(b.start_time)} • {fmtTime(b.start_time)} – {fmtTime(b.end_time)}
                </div>
                <div className="booking-meta">
                    Purpose: <span>{b.room_use}</span>
                    {b.attendees ? <> • People: <span>{b.attendees}</span></> : null}
                </div>
            </div>

            <div className="booking-actions">
                <div className="code-chip">
                    Code: <b>{b.check_in_code}</b>
                </div>
                <CheckInBox booking={b} onDone={onChanged} />
                <EditBookingBox booking={b} maxPeople={b.rooms?.capacity} onDone={onChanged} />
                <Button
                    variant="outline"
                    disabled={cancelling}
                    onClick={() => onCancel(b.booking_id)}
                >
                    {cancelling ? "Cancelling..." : "Cancel"}
                </Button>
            </div>
        </Card>
    );
}

export function PastBookingCard({ booking: b }) {
    const label = statusLabel(b);

    return (
        <Card className="booking-card past-booking">
            <div className="booking-details">
                <div className="booking-room">
                    {b.rooms?.building || "Building"} • Room {b.rooms?.room_number || b.room_id}
                </div>
                <div className="booking-time">
                    {fmtDay(b.start_time)} • {fmtTime(b.start_time)} – {fmtTime(b.end_time)}
                </div>
                {b.status === false && b.cancel_reason && (
                    <div className="booking-meta">Reason: <span>{b.cancel_reason}</span></div>
                )}
            </div>
            <div>
                <span className={`status-badge ${label === "Completed" ? "status-completed" : "status-cancelled"}`}>
                    {label}
                </span>
            </div>
        </Card>
    );
}