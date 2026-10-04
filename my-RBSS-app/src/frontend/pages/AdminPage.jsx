import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import TextCard from "../components/TextCard";
import { AdminUser } from "../../backend/AdminUser";

export default function AdminPage() {
  const admin = useMemo(() => new AdminUser(), []);

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [codes, setCodes] = useState({});          
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  async function loadAll() {
    try {
      setLoading(true);
      const [b, r, u] = await Promise.all([
        admin.listUpcomingBookings(),
        admin.listRooms(),
        admin.listUsers(),
      ]);
      setBookings(b);
      setRooms(r);
      setUsers(u);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to load admin data." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function run(action, okText) {
    setMessage(null);
    try {
      await action();
      setMessage({ type: "ok", text: okText });
      await loadAll();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    }
  }

  const fmtTime = (iso) =>
    new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="app-frame">
      <TextCard
        tag="Admin"
        title="Admin Panel"
        metaLeft="CHECK-INS • ROOMS • USERS"
        metaRight=""
      >
        <p>Check students in with their 4-digit code, block rooms for maintenance, and manage accounts.</p>
      </TextCard>

      <div className="home-body">
        <main className="home-main">
          {message && (
            <div className="dashboard-error-banner" style={message.type === "ok" ? { color: "green" } : undefined}>
              {message.text}
            </div>
          )}

          {loading && <div className="dashboard-state-text">Loading...</div>}

          {/* ---------- CHECK-INS ---------- */}
          <section className="dashboard-section">
            <h3 className="section-title">Bookings & Check-in</h3>
            {bookings.length === 0 ? (
              <Card className="empty-state-card"><p>No upcoming bookings.</p></Card>
            ) : (
              <div className="bookings-list">
                {bookings.map((b) => (
                  <Card key={b.booking_id} className="booking-card">
                    <div className="booking-details">
                      <div className="booking-room">
                        {b.rooms?.building} • Room {b.rooms?.room_number}
                      </div>
                      <div className="booking-time">
                        {fmtTime(b.start_time)} – {fmtTime(b.end_time)}
                      </div>
                      <div className="booking-meta">
                        {b.profiles?.full_name} ({b.profiles?.student_number}) • <span>{b.room_use}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      {b.checked_in ? (
                        <div className="code-chip">✔ Checked in</div>
                      ) : (
                        <>
                          <input
                            placeholder="4-digit code"
                            maxLength={4}
                            value={codes[b.booking_id] || ""}
                            onChange={(e) => setCodes((prev) => ({ ...prev, [b.booking_id]: e.target.value }))}
                          />
                          <Button
                            variant="solid"
                            onClick={() =>
                              run(() => admin.checkInBooking(b.booking_id, codes[b.booking_id]), "Checked in.")
                            }
                          >
                            Check in
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* ---------- ROOMS ---------- */}
          <section className="dashboard-section">
            <h3 className="section-title">Rooms</h3>
            <div className="bookings-list">
              {rooms.map((r) => (
                <Card key={r.room_id} className="booking-card">
                  <div className="booking-details">
                    <div className="booking-room">{r.building} • Room {r.room_number}</div>
                    <div className="booking-meta">
                      Capacity {r.capacity} •{" "}
                      <span>{r.availability ? "Available" : "Blocked"}</span>
                    </div>
                  </div>
                  <div className="booking-actions">
                    {r.availability ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (window.confirm(`Block ${r.room_number}? Upcoming bookings will be cancelled.`)) {
                            run(() => admin.blockRoom(r.room_id), `Room ${r.room_number} blocked.`);
                          }
                        }}
                      >
                        Block
                      </Button>
                    ) : (
                      <Button
                        variant="solid"
                        onClick={() => run(() => admin.unblockRoom(r.room_id), `Room ${r.room_number} unblocked.`)}
                      >
                        Unblock
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ---------- USERS ---------- */}
          <section className="dashboard-section">
            <h3 className="section-title">Users</h3>
            <div className="bookings-list">
              {users.map((u) => (
                <Card key={u.user_id} className="booking-card">
                  <div className="booking-details">
                    <div className="booking-room">{u.full_name} ({u.student_number})</div>
                    <div className="booking-meta">
                      {u.role} • <span>{u.is_active ? "Active" : "Deactivated"}</span>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <Button
                      variant="outline"
                      onClick={() =>
                        run(
                          () => admin.setUserActive(u.user_id, !u.is_active),
                          u.is_active ? "User deactivated." : "User reactivated."
                        )
                      }
                    >
                      {u.is_active ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}