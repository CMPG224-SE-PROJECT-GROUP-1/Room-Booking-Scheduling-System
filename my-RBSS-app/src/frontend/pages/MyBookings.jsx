import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useMemo, useEffect } from "react";
import { BookingManager } from "../../backend/BookingManager";
import { supabase } from "../../supabaseClient";

import './MyBookings.css'

export default function MyBookings(){

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

      useEffect(() => {
          loadDashboard();
        }, []);


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
    )
}