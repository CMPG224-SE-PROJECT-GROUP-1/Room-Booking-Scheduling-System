import { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import { notificationService } from "../../backend/NotificationService";

export default function NotificationList() {
    const [items, setItems] = useState([]);

    async function load() {
        try {
            setItems(await notificationService.fetchMine(5));
        } catch (err) {
            console.error("Notifications error:", err);
        }
    }

    useEffect(() => {
        load();
        const t = setInterval(load, 60000);     // look for new ones every minute
        return () => clearInterval(t);
    }, []);

    if (items.length === 0) return null;

    return (
        <section className="dashboard-section">
            <h3 className="section-title">Notifications</h3>
            <div className="bookings-list">
                {items.map((n) => (
                    <Card key={n.notification_id} className="booking-card">
                        <div className="booking-details">
                            <div className="booking-room" style={{ fontWeight: n.is_read ? "normal" : "bold" }}>
                                {n.message_content}
                            </div>
                            <div className="booking-meta">
                                {n.notification_type} • {new Date(n.sent_at).toLocaleString()}
                            </div>
                        </div>
                        {!n.is_read && (
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    await notificationService.markRead(n.notification_id);
                                    load();
                                }}
                            >
                                Mark read
                            </Button>
                        )}
                    </Card>
                ))}
            </div>
        </section>
    );
}