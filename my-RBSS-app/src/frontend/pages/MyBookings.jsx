import Card from "../components/Card";
import SlowLoadBanner from "../components/SlowLoadBanner";
import { ActiveBookingCard, PastBookingCard } from "../components/BookingCards";
import { useMyBookings } from "../hooks/useMyBookings";
import { useSlowLoad } from "../hooks/useSlowLoad";

import './Dashboard.css'

export default function MyBookings(){
    const {
        activeBookings, pastBookings, loading, cancellingId, actionError, cancel, reload
    } = useMyBookings();

    const slow = useSlowLoad(loading);

    return (
        <div className="app-frame">
            {slow && <SlowLoadBanner />}
            {actionError && <div className="dashboard-error-banner">{actionError}</div>}

            <section className="dashboard-section">
                <h3 className="section-title">Active Reservations</h3>

                {loading ? (
                    <div className="dashboard-state-text"><div class="loader"></div></div>
                ) : activeBookings.length === 0 ? (
                    <Card className="empty-state-card">
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
        </div>
    )
}