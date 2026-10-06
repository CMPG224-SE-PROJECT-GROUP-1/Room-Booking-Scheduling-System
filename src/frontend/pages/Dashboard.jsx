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
  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState(null);

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
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setActionError(null);

      // Authenticated user details
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const displayName =
          user.user_metadata?.first_name ||
          user.user_metadata?.full_name?.split(" ")[0] ||
          user.email?.split("@")[0] ||
          "User";
        setUserName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
      }

      // Available rooms tally
      const rooms = await BookingManager.searchRooms({});
      const activeRooms = (rooms || []).filter((r) => r.availability === true);
      setAvailableCount(activeRooms.length);

      // Bookings classification
      const bookings = await BookingManager.fetchBookings();
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

      setActiveBookings(active);
      setPastBookings(pastOrCancelled);
    } catch (err) {
      console.error("Dashboard error:", err);
      setActionError("Failed to sync reservations from the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await BookingManager.cancelBooking(bookingId);
      await loadDashboard();
    } catch (err) {
      console.error("Cancel failed:", err);
      setActionError("Unable to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
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
        <main className="home-main">
          {actionError && (
            <div className="dashboard-error-banner">{actionError}</div>
          )}

          <div className="stat-row">
            <Card
              className="stat-card clickable"
              onClick={() => navigate("/browse")}
            >
              <span className="num">{loading ? "—" : availableCount}</span>
              <span className="lbl">Available Rooms</span>
            </Card>

            <Card className="stat-card">
              <span className="num">{loading ? "—" : activeBookings.length}</span>
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

          {/* Active Reservations Section */}
          <section className="dashboard-section">
            <h3 className="section-title">Active Reservations</h3>

            {loading ? (
              <div className="dashboard-state-text">Loading reservations...</div>
            ) : activeBookings.length === 0 ? (
              <Card className="empty-state-card">
                <p>You have no active reservations right now.</p>
              </Card>
            ) : (
              <div className="bookings-list">
                {activeBookings.map((b) => (
                  <Card key={b.booking_id} className="booking-card">
                    <div className="booking-details">
                      <div className="booking-room">
                        {b.rooms?.building || "Building"} • Room{" "}
                        {b.rooms?.room_number || b.room_id}
                      </div>
                      <div className="booking-time">
                        {new Date(b.start_time).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        •{" "}
                        {new Date(b.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(b.end_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="booking-meta">
                        Purpose: <span>{b.room_use}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <div className="code-chip">
                        Code: <b>{b.check_in_code}</b>
                      </div>
                      <Button
                        variant="outline"
                        disabled={cancellingId === b.booking_id}
                        onClick={() => handleCancel(b.booking_id)}
                      >
                        {cancellingId === b.booking_id ? "Cancelling..." : "Cancel"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* History / Cancelled Section */}
          {pastBookings.length > 0 && (
            <section className="dashboard-section">
              <h3 className="section-title">History & Past Bookings</h3>
              <div className="bookings-list">
                {pastBookings.map((b) => (
                  <Card key={b.booking_id} className="booking-card past-booking">
                    <div className="booking-details">
                      <div className="booking-room">
                        {b.rooms?.building || "Building"} • Room{" "}
                        {b.rooms?.room_number || b.room_id}
                      </div>
                      <div className="booking-time">
                        {new Date(b.start_time).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        •{" "}
                        {new Date(b.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(b.end_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`status-badge ${
                          b.status === false ? "status-cancelled" : "status-completed"
                        }`}
                      >
                        {b.status === false ? "Cancelled" : "Completed"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;