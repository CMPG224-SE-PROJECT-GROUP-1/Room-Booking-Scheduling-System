import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import TextCard from "../components/TextCard";
import { BookingManager } from "../../backend/BookingManager";
import { supabase } from "../../supabaseClient";
import "./Dashboard.css";

export function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [availableCount, setAvailableCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentDate = useMemo(() => {
    return new Date()
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  }, []);

  useEffect(() => {
    async function initializeDashboard() {
      try {
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const displayName =
            user.user_metadata?.first_name ||
            user.user_metadata?.full_name?.split(" ")[0] ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User";

          setUserName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
        }

        const rooms = await BookingManager.searchRooms({});
        const activeRooms = (rooms || []).filter((r) => r.availability === true);

        const bookings = await BookingManager.fetchBookings();
        const now = new Date();
        const upcoming = (bookings || []).filter(
          (b) => b.status === true && new Date(b.end_time) >= now
        );

        setAvailableCount(activeRooms.length);
        setUpcomingCount(upcoming.length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeDashboard();
  }, []);

    const handleUpcomingClick = () =>{
        navigate("/mybookings");
    }

    const handleAvailClick = () =>{
        navigate("/browse");
    }

  return (
    <div className="app-frame">
      <TextCard
        tag="Notice & Updates"
        title={`Welcome back, ${userName}.`}
        metaLeft="SYSTEM ANNOUNCEMENT"
        metaRight={currentDate}
      >
        <p>
          Maintenance is scheduled for Study Hall B this Thursday between 18:00
          and 21:00. Room bookings remain open for all secondary halls.
        </p>
      </TextCard>

      <div className="home-body">
        <div className="home-main">
          <div className="stat-row">
            <Card className="stat-card" onClick={handleAvailClick}>
              <span className="num">{loading ? "—" : availableCount}</span>
              <span className="lbl">Available Rooms</span>
            </Card>

            <Card className="stat-card" onClick={handleUpcomingClick}>
              <span className="num">{loading ? "—" : upcomingCount}</span>
              <span className="lbl">Upcoming Bookings</span>
            </Card>
          </div>

          <Button
            variant="solid"
            fullWidth
            onClick={() => navigate("/browse")}
          >
            Book New Room
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;