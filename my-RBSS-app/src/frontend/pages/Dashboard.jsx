import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import Card from '../components/Card';
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import TextCard from "../components/TextCard";

export function Dashboard(){
    const navigate = useNavigate();

    return (
        <div className="app=frame">

            <TextCard
            tag="Notice & Updates"
            title="Welcome back, Neo."
            metaLeft="SYSTEM ANNOUNCEMENT"
            metaRight="OCT 24, 2026"
            >
                <p>
                    Maintenance is scheduled for Study Hall B this Thursday between 18:00 and 21:00.
                    Room bookings remain open for all secondary halls.
                </p>
            </TextCard>

            <div className="home-body">

                <div className="home-main">

                    <div className="stat-row">

                        <Card className="stat-card">
                            <span className="num">10</span>
                            <span className="lbl">Available Rooms</span>
                        </Card>

                        <Card className="stat-card">
                            <span className="num">4</span>
                            <span className="lbl">Upcoming Bookings</span>
                        </Card>`

                    </div>

                    <Button variant="solid" fullWidth onClick={() => navigate('/browse')}>
                        Book New Room
                    </Button>

                </div>


            </div>


        </div>
    )
}