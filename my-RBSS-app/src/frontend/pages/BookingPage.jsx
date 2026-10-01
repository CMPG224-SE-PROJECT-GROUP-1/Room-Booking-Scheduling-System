import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import PhotoCard from '../components/PhotoCard';
import TextCard from '../components/TextCard';
import FilterSelect from '../components/FilterSelect';
import {BookingManager} from '../../backend/BookingManager';
import './BookingPage.css';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Modal open/close state
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Retrieve room & slot passed from Browse.jsx; provide safe fallbacks
  const currentRoom = location.state?.room || {
    room_id: 204,
    room_number: 'L-204',
    building: 'Library',
    capacity: 6,
    availability: true,
    amenities: ['Whiteboard', 'Power outlets', 'TV screen'],
    image: null
  };

  const passedSlot = location.state?.slot || {
    date: '2026-10-24',
    displayDate: 'OCT 24, 2026',
    startTime: '15:00',
    endTime: '17:00'
  };

  const [startTime, setStartTime] = useState(passedSlot.startTime || '15:00');
  const [endTime, setEndTime] = useState(passedSlot.endTime || '17:00');
  const [capacity, setCapacity] = useState('2');
  const [roomUse, setRoomUse] = useState('Group study');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const timeOptions = [
    { value: '09:00', label: '09:00' },
    { value: '11:00', label: '11:00' },
    { value: '15:00', label: '15:00' },
    { value: '17:00', label: '17:00' },
    { value: '19:00', label: '19:00' }
  ];

  const capacityOptions = useMemo(() => {
    const max = currentRoom.capacity || 4;
    return Array.from({ length: max }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} ${i === 0 ? 'Person' : 'People'}`
    }));
  }, [currentRoom.capacity]);

  const purposeOptions = [
    { value: 'Group study', label: 'Group study' },
    { value: 'Individual study', label: 'Individual study' },
    { value: 'Presentation prep', label: 'Presentation prep' },
    { value: 'Tutoring session', label: 'Tutoring session' },
    { value: 'Project meeting', label: 'Project meeting' },
    { value: 'Conference meeting', label: 'Conference meeting' }
  ];

  function generateCheckInCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async function handleBook(e) {
    e.preventDefault();
    setErrorMessage(null);

    setIsSubmitting(true);

    try {
      const selectedDate = passedSlot.date || new Date().toISOString().split('T')[0];
      const startIso = new Date(`${selectedDate}T${startTime}:00`).toISOString();
      const endIso = new Date(`${selectedDate}T${endTime}:00`).toISOString();
      const checkInCode = generateCheckInCode();

      const bookingData = {
        room_id: currentRoom.room_id,
        start_time: startIso,
        end_time: endIso,
        room_use: roomUse,
        check_in_code: checkInCode,
        status: true
      };

      const newBooking = await BookingManager.createBooking(bookingData);

      navigate('/confirmation', {
        state: {
          booking: newBooking || bookingData,
          room: currentRoom,
          slot: {
            date: selectedDate,
            displayDate: passedSlot.displayDate,
            startTime,
            endTime
          }
        }
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-frame">
      <div className="page-wrapper">
        <main className="booking-page">
          <header className="booking-header">
            <TextCard
              tag="Booking Confirmation"
              title="Confirm your Booking"
              metaLeft="Review rules below"
              metaRight={passedSlot.displayDate || 'OCT 24, 2026'}
            >
              <p>Review room details and rules and also configure capacity, and reason for reservation.</p>
            </TextCard>
          </header>

          <div className="booking-split-container">
            {/* Left Column: Interactive Form */}
            <section className="booking-left">
              <form className="booking-form" onSubmit={handleBook}>
                <div className="readonly-row">
                  <span>Room:</span> <b>{currentRoom.room_number}</b>
                </div>
                <div className="readonly-row">
                  <span>Building:</span> <b>{currentRoom.building}</b>
                </div>
                <div className="readonly-row">
                  <span>Max Capacity:</span> <b>{currentRoom.capacity} People</b>
                </div>
                <div className="readonly-row">
                  <span>Time:</span> <b>{startTime} - {endTime}</b>
                </div>

                <h3>Details</h3>
                <div className="fgroup">
                  <FilterSelect
                    label="Number of people"
                    value={capacity}
                    options={capacityOptions}
                    onChange={(e) => setCapacity(e?.target ? e.target.value : e)}
                  />
                </div>
                <div className="fgroup">
                  <FilterSelect
                    label="Purpose"
                    value={roomUse}
                    options={purposeOptions}
                    onChange={(e) => setRoomUse(e?.target ? e.target.value : e)}
                  />
                </div>

                {errorMessage && (
                  <div className="form-error-banner">{errorMessage}</div>
                )}

                <div className="btn-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Booking...' : 'Book now'}
                  </Button>
                </div>
              </form>
            </section>

            <section className="booking-right">
              <div className="cards-row">
                <div>
                  <PhotoCard
                    photoLink={currentRoom.image}
                    altText={`Room ${currentRoom.room_number}`}
                    />
                </div>

                <Card className="detail-card">
                  <dl>
                    <div>
                      <b>Room:</b> {currentRoom.room_number}
                    </div>
                    <div>
                      <b>Building:</b> {currentRoom.building}
                    </div>
                    <div>
                      <b>Capacity:</b> Up to {currentRoom.capacity} people
                    </div>
                    <div>
                      <b>Amenities:</b>{' '}
                      {currentRoom.amenities && currentRoom.amenities.length > 0
                        ? currentRoom.amenities.join(', ')
                        : 'Standard desk'}
                    </div>
                    <div className="availability-status">
                      <b>Status:</b>{' '}
                      <span className={currentRoom.availability ? 'status-open' : 'status-blocked'}>
                        {currentRoom.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </dl>
                </Card>
              </div>

              <div className="bottom-rules">
                <TextCard tag="Guidelines" title="Room Usage Rules">
                  <ul className="rules-list">
                    <li>1. Check-in is required using your 4-digit code within 15 minutes of start time.</li>
                    <li>2. Maintain acceptable noise levels appropriate to the building zone.</li>
                    <li>3. Return whiteboard markers, HDMI cords, and accessories before departure.</li>
                    <li>4. No food or open drink containers allowed near technical workstations.</li>
                  </ul>
                </TextCard>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}