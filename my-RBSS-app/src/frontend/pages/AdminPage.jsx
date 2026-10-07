import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import TextCard from "../components/TextCard";
import { AdminUser } from "../../backend/AdminUser";
import { authService } from "../../backend/User";
import "./Dashboard.css";

const ROLES = ["student", "teacher", "postgrad", "manager", "admin"];

const fmtTime = (iso) =>
  new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AdminPage() {
  const admin = useMemo(() => new AdminUser(), []);

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [audit, setAudit] = useState([]);
  const [myId, setMyId] = useState(null);
  const [codes, setCodes] = useState({});          // { [booking_id]: "1234" } what the admin typed
  const [mForm, setMForm] = useState({ room_id: "", start: "", end: "", reason: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  async function loadAll() {
  setLoading(true);

  const calls = {
    Bookings: admin.listUpcomingBookings(),
    Rooms: admin.listRooms(),
    Users: admin.listUsers(),
    Maintenance: admin.listMaintenance(),
    "Audit log": admin.listAuditLog(30),
    Me: authService.getCurrentUser(),
  };

  const names = Object.keys(calls);
  const results = await Promise.allSettled(Object.values(calls));
  const setters = {
    Bookings: setBookings,
    Rooms: setRooms,
    Users: setUsers,
    Maintenance: setMaintenance,
    "Audit log": setAudit,
    Me: (me) => setMyId(me?.id ?? null),
  };

  const failed = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      setters[names[i]](r.value);
    } else {
      console.error(`Admin: ${names[i]} failed`, r.reason);
      failed.push(`${names[i]}: ${r.reason?.message || r.reason}`);
    }
  });

  if (failed.length > 0) setMessage({ type: "error", text: failed.join("  |  ") });
  setLoading(false);
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

  function onSchedule() {
    if (!mForm.room_id || !mForm.start || !mForm.end) {
      setMessage({ type: "error", text: "Please choose a room, a start time and an end time." });
      return;
    }
    run(
      () =>
        admin.scheduleMaintenance(
          mForm.room_id,
          new Date(mForm.start).toISOString(),
          new Date(mForm.end).toISOString(),
          mForm.reason
        ),
      "Maintenance scheduled. Overlapping bookings were cancelled."
    );
    setMForm({ room_id: "", start: "", end: "", reason: "" });
  }

  return (
    <div className="app-frame">
      <TextCard
        tag="Admin"
        title="Admin Panel"
        metaLeft="CHECK-INS • ROOMS • USERS • AUDIT"
        metaRight=""
      >
        <p>Check students in with their 4-digit code, block rooms, schedule maintenance and manage accounts.</p>
      </TextCard>

      <div className="home-body">
        <main className="home-main">
          {message && (
            <div className="dashboard-error-banner" style={message.type === "ok" ? { color: "green" } : undefined}>
              {message.text}
            </div>
          )}

          {loading && <div className="dashboard-state-text">Loading...</div>}

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
                      <Button
                        variant="outline"
                        onClick={() => {
                          const reason = window.prompt("Reason for cancelling this booking:");
                          if (reason !== null) {
                            run(() => admin.cancelAnyBooking(b.booking_id, reason), "Booking cancelled.");
                          }
                        }}
                      >
                        Cancel booking
                      </Button>
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
                      Capacity {r.capacity} • <span>{r.availability ? "Available" : "Blocked"}</span>
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

          <section className="dashboard-section">
            <h3 className="section-title">Maintenance Windows</h3>

            <Card className="booking-card">
              <div className="booking-details">
                <select value={mForm.room_id} onChange={(e) => setMForm({ ...mForm, room_id: e.target.value })}>
                  <option value="">Choose a room…</option>
                  {rooms.map((r) => (
                    <option key={r.room_id} value={r.room_id}>{r.building} • {r.room_number}</option>
                  ))}
                </select>
                <label>From <input type="datetime-local" value={mForm.start}
                  onChange={(e) => setMForm({ ...mForm, start: e.target.value })} /></label>
                <label>To <input type="datetime-local" value={mForm.end}
                  onChange={(e) => setMForm({ ...mForm, end: e.target.value })} /></label>
                <input placeholder="Reason (optional)" value={mForm.reason}
                  onChange={(e) => setMForm({ ...mForm, reason: e.target.value })} />
              </div>
              <div className="booking-actions">
                <Button variant="solid" onClick={onSchedule}>Schedule maintenance</Button>
              </div>
            </Card>

            <div className="bookings-list">
              {maintenance.map((m) => (
                <Card key={m.maintenance_id} className="booking-card">
                  <div className="booking-details">
                    <div className="booking-room">{m.rooms?.building} • Room {m.rooms?.room_number}</div>
                    <div className="booking-time">{fmtTime(m.start_time)} – {fmtTime(m.end_time)}</div>
                    {m.reason && <div className="booking-meta">Reason: <span>{m.reason}</span></div>}
                  </div>
                  <div className="booking-actions">
                    <Button
                      variant="outline"
                      onClick={() => run(() => admin.cancelMaintenance(m.maintenance_id), "Maintenance window removed.")}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <h3 className="section-title">Users</h3>
            <div className="bookings-list">
              {users.map((u) => {
                const isMe = u.user_id === myId;
                return (
                  <Card key={u.user_id} className="booking-card">
                    <div className="booking-details">
                      <div className="booking-room">
                        {u.full_name} ({u.student_number}){isMe ? " • you" : ""}
                      </div>
                      <div className="booking-meta">
                        {u.is_active ? "Active" : "Deactivated"}
                      </div>
                    </div>
                    <div className="booking-actions">
                      <select
                        value={u.role}
                        disabled={isMe}
                        onChange={(e) =>
                          run(() => admin.updateUser(u.user_id, { role: e.target.value }), "Role updated.")
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <Button
                        variant="outline"
                        disabled={isMe}
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
                );
              })}
            </div>
          </section>

          <section className="dashboard-section">
            <h3 className="section-title">Audit Log (latest 30)</h3>
            {audit.length === 0 ? (
              <Card className="empty-state-card"><p>No audit entries yet.</p></Card>
            ) : (
              <table className="schedule">
                <thead>
                  <tr><th>When</th><th>Action</th><th>Table</th><th>By</th></tr>
                </thead>
                <tbody>
                  {audit.map((a) => (
                    <tr key={a.log_id}>
                      <td>{fmtTime(a.timestamp)}</td>
                      <td>{a.action}</td>
                      <td>{a.table_affected}</td>
                      <td>{a.profiles?.student_number ?? "system"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}