import { useState } from "react";
import Button from "./Button";
import { bookingManager } from "../../backend/BookingManager";

const PURPOSES = [
    "Group study", "Individual study", "Presentation prep",
    "Tutoring session", "Project meeting", "Conference meeting"
];

// Edit the purpose and number of people on an upcoming booking
export default function EditBookingBox({ booking, maxPeople, onDone }) {
    const [open, setOpen] = useState(false);
    const [roomUse, setRoomUse] = useState(booking.room_use);
    const [attendees, setAttendees] = useState(String(booking.attendees ?? 1));
    const [msg, setMsg] = useState(null);

    if (!open) {
        return <Button variant="outline" onClick={() => setOpen(true)}>Edit</Button>;
    }

    const onSave = async () => {
        setMsg(null);
        try {
            await bookingManager.updateBooking(booking.booking_id, {
                room_use: roomUse,
                attendees: Number(attendees),
            });
            setOpen(false);
            if (onDone) await onDone();
        } catch (err) {
            setMsg(err.message || "Could not save changes.");
        }
    };

    return (
        <div>
            <select value={roomUse} onChange={(e) => setRoomUse(e.target.value)}>
                {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={attendees} onChange={(e) => setAttendees(e.target.value)}>
                {Array.from({ length: maxPeople || 4 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "person" : "people"}</option>
                ))}
            </select>
            <Button variant="solid" onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            {msg && <div className="booking-meta">{msg}</div>}
        </div>
    );
}