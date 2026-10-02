import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import PhotoCard from "../components/PhotoCard";
import { bookingManager } from "../../backend/BookingManager";
import { toIso } from "../../frontend/utils/slots";
import './ConfirmationPage.css';

export default function ConfirmationPage(){
    const location = useLocation();
    const navigate = useNavigate();

    const room = location.state?.room;
    const slot = location.state?.slot;
    const roomUse = location.state?.roomUse;

    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [booking, setBooking] = useState(null);  

    useEffect(() => {
        if (!room || !slot) {
            navigate("/browse", { replace: true });
        }
    }, [room, slot, navigate]);

    if (!room || !slot) return null;

    const onConfirm = async () => {
        setErrorMsg(null);
        setLoading(true);
        try {
            const saved = await bookingManager.createBooking(
                room.room_id,
                {
                    start: toIso(slot.date, slot.startTime),
                    end: toIso(slot.date, slot.endTime)
                },
                roomUse
            );
            setBooking(saved);
        } catch (err) {
            setErrorMsg(err.message || "Failed to complete booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="app-frame">
            <div className="confirm-body">
                <PhotoCard
                    photoLink={room.image}
                    altText={`Room ${room.room_number}`}
                />
                <Card className="info-card">
                    <p>Room number: <b>{room.room_number}</b></p>
                    <p>Building: <b>{room.building}</b></p>
                    <p>Date: <b>{slot.displayDate}</b></p>
                    <p>Allocated time: <b>{slot.startTime} - {slot.endTime}</b></p>
                    <p>Purpose: <b>{roomUse}</b></p>
                    <p>Checking code: <b>{booking ? booking.check_in_code : "Shown after you confirm"}</b></p>
                </Card>

                <div className="confirm-right">
                    <Card className="rules-card">
                        <h4>Rules</h4>
                        <ul>
                        <li>Keep noise to a minimum</li>
                        <li>No food or drink near equipment</li>
                        <li>Leave the room as you found it</li>
                        <li>Report faults at the front desk</li>
                        <li>Check in within 15 minutes of your start time</li>
                        </ul>
                    </Card>

                    {errorMsg && (
                        <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMsg}</p>
                    )}

                    {booking ? (
                        <>
                            <p style={{ color: "green" }}>Booking confirmed! Keep your code safe.</p>
                            <Button variant="solid" fullWidth onClick={() => navigate("/dashboard")}>
                                Go to Dashboard
                            </Button>
                        </>
                    ) : (
                        <>
                            <label className="check-row">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)} />
                                I have read and understood all the rules.
                            </label>

                            <Button variant="solid" fullWidth disabled={!agreed || loading} onClick={onConfirm}>
                                {loading ? "Booking..." : "Confirm Booking."}
                            </Button>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}