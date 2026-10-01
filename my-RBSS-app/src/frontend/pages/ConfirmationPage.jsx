import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import PhotoCard from "../components/PhotoCard";
import './ConfirmationPage.css';

export default function ConfirmationPage(){

    const [agreed, setAgreed] = useState(false);

    return(
        <div className="app-frame">
            <div className="confirm-body">
                <PhotoCard>

                </PhotoCard>
                <Card className="info-card">
                    <p>Room number: <b>L-204</b></p>
                    <p>Room type: <b>Study room</b></p>
                    <p>Building: <b>Main Library</b></p>
                    <p>Allocated time: <b>15:00 - 17:00</b></p>
                    <p>Checking code: <b>7731</b></p>
                </Card>

                <div className="confirm-right">
                    <Card className="rules-card">
                        <h4>Rules</h4>
                        <ul>
                        <li>Keep noise to a minimum</li>
                        <li>No food or drink near equipment</li>
                        <li>Leave the room as you found it</li>
                        <li>Report faults at the front desk</li>
                        </ul>
                    </Card>

                    <label className="check-row">
                        <input 
                            type="checkbox" 
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)} />
                        I have read and understood all the rules.
                    </label>

                    <Button variant="solid" fullWidth disabled={!agreed}>
                        Confirm Booking.
                    </Button>

                </div>
            </div>
        </div>
    )
}