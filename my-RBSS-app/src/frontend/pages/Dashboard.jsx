import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import TextCard from "../components/TextCard";
import NotificationList from "../components/NotificationList";
import SlowLoadBanner from "../components/SlowLoadBanner";
import { ActiveBookingCard, PastBookingCard } from "../components/BookingCards";
import { bookingManager } from "../../backend/BookingManager";
import { authService } from "../../backend/User";
import { useMyBookings } from "../hooks/useMyBookings";
import { useSlowLoad } from "../hooks/useSlowLoad";
import { supabase } from "../../supabaseClient";
import "./Dashboard.css";
import "../components/Loader.css";


export function Dashboard() {
  const navigate = useNavigate();

  const {
    activeBookings, pastBookings, loading, cancellingId,
    actionError, setActionError, cancel, reload,
  } = useMyBookings();

  const [userName, setUserName] = useState("User");
  const [availableCount, setAvailableCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [maintenanceText, setMaintenanceText] = useState("The place where all your studying goals come true!");

  const slow = useSlowLoad(loading || statsLoading);

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
    async function loadStats() {
      try {
        const profile = await authService.getCurrentProfile();
        const first = (profile?.full_name || "User").split(" ")[0];
        setUserName(first.charAt(0).toUpperCase() + first.slice(1));

        const rooms = await bookingManager.searchRooms();
        setAvailableCount(rooms.filter((r) => r.availability === true).length);
      } catch (err) {
        console.error("Dashboard stats error:", err);
        setActionError("Failed to load room information from the server.");
      } finally {
        setStatsLoading(false);
      }
    }

    async function loadMaintenance() {

      function formatTime(time){
        const formatted = new Date(time).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return formatted;
      }
    
      try {
        const { data: randomRoom, error } = await supabase
          .rpc('get_random_room_maintenance', { target_limit: 1 })
          .maybeSingle();

        if (error) {
          console.error("Supabase RPC error:", error);
          setActionError("Failed to load maintenance text");
          return;
        }

        const messageText = randomRoom ? `Please note that Room ${randomRoom.room.room_number} in building '${randomRoom.room.building}' is scheduled for maintenance from [ ${formatTime(randomRoom.startTime)} ] until [ ${formatTime(randomRoom.endTime)} ]${randomRoom.reason ? ` due to [ ${randomRoom.reason} ]` : ""}.` : "The place where all your studying goals come true!";

        setMaintenanceText(messageText);
        
      } catch (err) {
        console.error("Maintenance text unexpected error:", err);
        setActionError("Failed to load maintenance text");
      }

        
    }
    loadStats();
    loadMaintenance();
  }, [setActionError]);

  async function handleClearHistory() {
    if (!window.confirm("Delete all your past and cancelled bookings? This cannot be undone.")) return;

    try {
      await authService.clearMyHistory();
      await reload();
    } catch (err) {
      setActionError(err.message || "Could not clear your history.");
    }
  }

  async function handleDeleteAccount() {
    const typed = window.prompt(
      "This permanently deletes your account, bookings and notifications.\nType DELETE to confirm:"
    );
    if (typed !== "DELETE") return;

    try {
      await authService.deleteMyAccount();
      navigate("/", { replace: true });
    } catch (err) {
      setActionError(err.message || "Could not delete your account.");
    }
  }

  return (
    <div className="app-frame">
      <TextCard
        tag="Notice & Updates"
        title={`Welcome back, ${userName}.`}
        metaLeft="SYSTEM ANNOUNCEMENT"
        metaRight={currentDate}
        isLoading = {statsLoading}
      >
        <p>
          {maintenanceText}
        </p>
      </TextCard>

      <div className="home-body">
        <main className="home-main">
          {slow && <SlowLoadBanner />}

          {actionError && (
            <div className="dashboard-error-banner">{actionError}</div>
          )}

          <div className="stat-row">
            <Card
              className="stat-card clickable"
              onClick={() => !statsLoading && navigate("/browse")}
              isLoading={statsLoading}
            >
              <span className="num">{availableCount}</span>
              <span className="lbl">Available Rooms</span>
            </Card>

            <Card 
              className="stat-card"
              onClick={() => !loading && navigate("/mybookings")}
              isLoading={loading}
            >

              <span className="num">{activeBookings.length}</span>
              <span className="lbl">Active Bookings</span>
            </Card>
          </div>

          <Button
            variant="solid"
            fullWidth
            onClick={() => navigate("/browse")}
          >
            Book New Room
          </Button>

          <NotificationList />

          <section className="dashboard-section">
            <h3 className="section-title">Active Reservations</h3>

            { activeBookings.length === 0 ? (
              <Card 
                className={ activeBookings.length === 0 ? "empty-state-card" : "bookings-list"}
                isLoading={loading}
              >
                <p>You have no active reservations right now.</p>
              </Card>
            ) : (
              <div className="bookings-list">
                {activeBookings.map((b) => (
                  <ActiveBookingCard
                    key={b.booking_id}
                    booking={b}
                    cancelling={cancellingId === b.booking_id}
                    onCancel={cancel}
                    onChanged={reload}
                  />
                ))}
              </div>
            )}
          </section>

          {!loading && pastBookings.length > 0 && (
            <section className="dashboard-section">
              <h3 className="section-title">History & Past Bookings</h3>
              <div className="bookings-list">
                {pastBookings.map((b) => (
                  <PastBookingCard key={b.booking_id} booking={b} />
                ))}
              </div>
            </section>
          )}

          <section className="dashboard-section">
            <h3 className="section-title">My Data</h3>
            <Card className="booking-card">
              <div className="booking-details">
                <div className="booking-meta">
                  You can remove your past bookings, or delete your account and all your data.
                </div>
              </div>
              <div className="booking-actions">
                <Button variant="outline" onClick={handleClearHistory}>Clear my history</Button>
                <Button variant="outline" onClick={handleDeleteAccount}>Delete my account</Button>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;