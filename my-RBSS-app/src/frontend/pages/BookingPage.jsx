import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import PhotoCard from '../components/PhotoCard';
import TextCard from '../components/TextCard';
import FilterSelect from '../components/FilterSelect';
import { CHECK_IN_GRACE_MINUTES } from '../../backend/slots';
import './BookingPage.css';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoom = location.state?.room;
  const passedSlot = location.state?.slot;

  useEffect(() => {
    if (!currentRoom || !passedSlot) {
      navigate('/browse', { replace: true });
    }
  }, [currentRoom, passedSlot, navigate]);

  const [capacity, setCapacity] = useState('1');
  const [roomUse, setRoomUse] = useState('Group study');
  const [errorMessage, setErrorMessage] = useState(null);

  const capacityOptions = useMemo(() => {
    const max = currentRoom?.capacity || 4;
    return Array.from({ length: max }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} ${i === 0 ? 'Person' : 'People'}`
    }));
  }, [currentRoom?.capacity]);

  const purposeOptions = [
    { value: 'Group study', label: 'Group study' },
    { value: 'Individual study', label: 'Individual study' },
    { value: 'Presentation prep', label: 'Presentation prep' },
    { value: 'Tutoring session', label: 'Tutoring session' },
    { value: 'Project meeting', label: 'Project meeting' },
    { value: 'Conference meeting', label: 'Conference meeting' }
  ];

  if (!currentRoom || !passedSlot) return null;

  function handleContinue(e) {
    e.preventDefault();
    setErrorMessage(null);

    if (Number(capacity) > currentRoom.capacity) {
      setErrorMessage(`This room only fits ${currentRoom.capacity} people.`);
      return;
    }
    if (!roomUse) {
      setErrorMessage('Please choose a purpose for the room.');
      return;
    }

    navigate('/confirmation', {
      state: {
        room: currentRoom,
        slot: passedSlot,
        roomUse,
        capacity: Number(capacity)
      }
    });
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
              metaRight={passedSlot.displayDate}
            >
              <p>Review room details and rules and also configure capacity, and reason for reservation.</p>
            </TextCard>
          </header>

          <div className="booking-split-container">
            <section className="booking-left">
              <form className="booking-form" onSubmit={handleContinue}>
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
                  <span>Time:</span> <b>{passedSlot.startTime} - {passedSlot.endTime}</b>
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="solid">
                    Continue
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
                    <li>1. Check-in is required using your 4-digit code within {CHECK_IN_GRACE_MINUTES} minutes of start time.</li>
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