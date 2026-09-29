import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import Card from '../components/Card';
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";

export function Dashboard(){
    const navigate = useNavigate();

    return (
        <div className="app=frame">
            <TopNav/>
            <Sidebar/>

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