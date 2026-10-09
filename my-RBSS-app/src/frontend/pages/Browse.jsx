import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Browse.css';
import Card from '../components/Card';
import Button from '../components/Button';
import FilterSelect from '../components/FilterSelect';
import TextCard from '../components/TextCard';
import SlowLoadBanner from '../components/SlowLoadBanner';
import { bookingManager } from '../../backend/BookingManager';
import {
  TIMES, SLOT_HOURS, DAYS_AHEAD, DAYS_PER_PAGE, addHours, formatDisplayDate,
} from '../../backend/slots';
import { useSlowLoad } from '../hooks/useSlowLoad';
import "../components/Loader.css";

const BUILDING_OPTIONS = ['Any building', 'Robbenhoek Library', 'Eagles Humanities Library', 'Thuto Research Center', 'The Commerce Building'];
const TIME_OPTIONS = ['Any time', ...TIMES];
const AMENITY_OPTIONS = [
  'Any amenity',
  'Whiteboard',
  'Power outlets',
  'Projector',
  'TV screen',
  'Video conferencing',
  'Stage/podium',
];
const CAPACITY_OPTIONS = ['Any size', '2', '4', '6', '8', '10', '12'];
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

function getUpcomingDays(count) {
  const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const today = new Date();
  const list = [];

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    list.push({
      dayName: dayNames[d.getDay()],
      dateStr,
      label: `${dayNames[d.getDay()]} (${mm}/${dd})`,
    });
  }
  return list;
}

export default function Browse() {
  const navigate = useNavigate();

  const allDays = useMemo(() => getUpcomingDays(DAYS_AHEAD), []);
  const defaultDate = allDays[0].dateStr;
  const [pageStart, setPageStart] = useState(0);
  const tableDays = allDays.slice(pageStart, pageStart + DAYS_PER_PAGE);

  const [rooms, setRooms] = useState([]);
  const [busySlots, setBusySlots] = useState([]);   
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [filters, setFilters] = useState({
    building: 'Any building',
    time: '09:00',
    date: defaultDate,
    amenity: 'Any amenity',
    minCapacity: 'Any size',
  });

  const [selectedSlot, setSelectedSlot] = useState({
    dateStr: defaultDate,
    time: '09:00',
  });
  const [roomIndex, setRoomIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const slow = useSlowLoad(loading);

  // Fetch real rooms & busy slots from Supabase
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const [fetchedRooms, slots] = await Promise.all([
          bookingManager.searchRooms({
            building: filters.building !== 'Any building' ? filters.building : undefined,
          }),
          bookingManager.fetchBusySlots(),
        ]);

        setRooms(fetchedRooms);
        setBusySlots(slots);
      } catch (err) {
        console.error('Failed to load data:', err);
        setErrorMsg('Could not load rooms. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [filters.building]);

  const isRoomFree = (roomId, dateStr, timeStr) => {
    const slotStart = new Date(`${dateStr}T${timeStr}:00`);
    const slotEnd = new Date(slotStart.getTime() + SLOT_HOURS * 60 * 60 * 1000);

    if (slotStart < new Date()) return false;

    const hasConflict = busySlots.some((b) => {
      if (b.room_id !== roomId) return false;
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      return slotStart < bEnd && slotEnd > bStart;
    });

    return !hasConflict;
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (!room.availability) return false;
      if (filters.minCapacity !== 'Any size' && room.capacity < Number(filters.minCapacity)) return false;
      if (filters.amenity === 'Any amenity') return true;
      return Array.isArray(room.amenities) && room.amenities.includes(filters.amenity);
    });
  }, [rooms, filters.amenity, filters.minCapacity]);

  const availableRoomsAtSlot = useMemo(() => {
    return filteredRooms.filter((room) =>
      isRoomFree(room.room_id, selectedSlot.dateStr, selectedSlot.time)
    );
  }, [filteredRooms, selectedSlot, busySlots]);

  const currentRoom = availableRoomsAtSlot[roomIndex] || null;

  const handleFilterChange = (field, val) => {
    setFilters((prev) => ({ ...prev, [field]: val }));
    setRoomIndex(0);

    if (field === 'date') {
      setSelectedSlot((prev) => ({ ...prev, dateStr: val }));
      const idx = allDays.findIndex((d) => d.dateStr === val);
      if (idx >= 0) setPageStart(Math.floor(idx / DAYS_PER_PAGE) * DAYS_PER_PAGE);
    }
    if (field === 'time' && val !== 'Any time') {
      setSelectedSlot((prev) => ({ ...prev, time: val }));
    }
  };

  const handleSelectSlot = (dateStr, time) => {
    setSelectedSlot({ dateStr, time });
    setFilters((prev) => ({ ...prev, date: dateStr, time }));
    setRoomIndex(0);
  };

  const handlePrevRoom = () => {
    setRoomIndex((prev) => (prev > 0 ? prev - 1 : availableRoomsAtSlot.length - 1));
  };

  const handleNextRoom = () => {
    setRoomIndex((prev) => (prev < availableRoomsAtSlot.length - 1 ? prev + 1 : 0));
  };

  const handleBookNow = () => {
    navigate('/booking', {
      state: {
        room: currentRoom,
        slot: {
          date: selectedSlot.dateStr,
          displayDate: formatDisplayDate(selectedSlot.dateStr),
          startTime: selectedSlot.time,
          endTime: addHours(selectedSlot.time, SLOT_HOURS),
        },
      },
    });
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="browse-header">
          <div class="loader"></div>
          {slow && <SlowLoadBanner />}
        </div>
      </div>
    );
  }

  const activeDayObj = allDays.find((d) => d.dateStr === selectedSlot.dateStr) || allDays[0];
  const formattedAmenities =
    Array.isArray(currentRoom?.amenities) && currentRoom.amenities.length > 0
      ? currentRoom.amenities.join(', ')
      : 'None listed';

  return (
    <div className="app-frame">
      <div className="page-wrapper">
        <main className="browse-page">

          <header className="browse-header">
            <TextCard
              tag="Room search and book"
              title="Select Your Room."
              metaLeft="Filter and take your time"
              metaRight={formatDisplayDate(defaultDate)}
            >
              <p>Filter by building, time, capacity and amenities to view availability.</p>
            </TextCard>
          </header>

          <div className="browse-split-container">
            {/* Filters */}
            <section className="browse-left">
              <div className="search-body">
                <div className="filters">
                  <FilterSelect
                    label="Building"
                    value={filters.building}
                    options={BUILDING_OPTIONS}
                    onChange={(val) => handleFilterChange('building', val)}
                  />
                  <FilterSelect
                    label="Time"
                    value={filters.time}
                    options={TIME_OPTIONS}
                    onChange={(val) => handleFilterChange('time', val)}
                  />
                  <FilterSelect
                    label="Date"
                    value={filters.date}
                    options={allDays.map((d) => ({ value: d.dateStr, label: d.label }))}
                    onChange={(val) => handleFilterChange('date', val)}
                  />
                  <FilterSelect
                    label="Amenity"
                    value={filters.amenity}
                    options={AMENITY_OPTIONS}
                    onChange={(val) => handleFilterChange('amenity', val)}
                  />
                  <FilterSelect
                    label="Minimum capacity"
                    value={filters.minCapacity}
                    options={CAPACITY_OPTIONS}
                    onChange={(val) => handleFilterChange('minCapacity', val)}
                  />
                </div>
              </div>
            </section>

            <section className="browse-right">
              <div className="results">

                {slow && <SlowLoadBanner />}
                {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

                <div className="slot-browser-bar">
                  <div className="active-slot-pill">
                    Viewing: <b>{activeDayObj.label} @ {selectedSlot.time}</b>
                    {filters.building !== 'Any building' && ` (${filters.building})`}
                  </div>

                  {availableRoomsAtSlot.length > 1 && (
                    <div className="room-nav-controls">
                      <button className="nav-arrow-btn" onClick={handlePrevRoom} title="Previous Room">
                        ←
                      </button>
                      <span className="room-counter">
                        {roomIndex + 1} of {availableRoomsAtSlot.length} available
                      </span>
                      <button className="nav-arrow-btn" onClick={handleNextRoom} title="Next Room">
                        →
                      </button>
                    </div>
                  )}
                </div>

                <div className="cards-row">
                  {currentRoom ? (
                    <>
                      <Card className="picture-card">
                        <img
                          src={currentRoom.image || FALLBACK_IMAGE}
                          alt={`Room ${currentRoom.room_number}`}
                          className="room-image expandable-pic"
                          onClick={() => setIsViewerOpen(true)}
                        />
                      </Card>

                      <Card className="detail-card">
                        <dl>
                          <div><b>Room:</b> {currentRoom.room_number}</div>
                          <div><b>Building:</b> {currentRoom.building}</div>
                          <div><b>Capacity:</b> {currentRoom.capacity} people</div>
                          <div><b>Amenities:</b> {formattedAmenities}</div>
                          <div className="availability-status">
                            <b>Status:</b> <span className="status-open">Open at {selectedSlot.time}</span>
                          </div>
                        </dl>
                        <Button variant="solid" onClick={handleBookNow}>
                          Book now
                        </Button>
                      </Card>
                    </>
                  ) : (
                    <Card className="no-rooms-card">
                      <div className="no-rooms-msg">
                        <h4>No rooms available</h4>
                        <p>No free rooms match your selection for this time slot.</p>
                      </div>
                    </Card>
                  )}
                </div>

                <div className="room-nav-controls">
                  <button
                    className="nav-arrow-btn"
                    disabled={pageStart === 0}
                    onClick={() => setPageStart((p) => Math.max(0, p - DAYS_PER_PAGE))}
                  >
                    ← Earlier
                  </button>
                  <span className="room-counter">
                    {tableDays[0].label} – {tableDays[tableDays.length - 1].label}
                  </span>
                  <button
                    className="nav-arrow-btn"
                    disabled={pageStart + DAYS_PER_PAGE >= allDays.length}
                    onClick={() => setPageStart((p) => p + DAYS_PER_PAGE)}
                  >
                    Later →
                  </button>
                </div>

                <table className="schedule">
                  <thead>
                    <tr>
                      <th></th>
                      {TIMES.map((t) => (
                        <th key={t}>{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableDays.map((d) => (
                      <tr key={d.dateStr}>
                        <td>{d.label}</td>
                        {TIMES.map((time) => {
                          const isSelected =
                            selectedSlot.dateStr === d.dateStr && selectedSlot.time === time;
                          const isPast = new Date(`${d.dateStr}T${time}:00`) < new Date();

                          // Count available rooms
                          const freeCount = filteredRooms.filter((r) =>
                            isRoomFree(r.room_id, d.dateStr, time)
                          ).length;

                          return (
                            <td
                              key={time}
                              className={`schedule-slot-cell ${isSelected ? 'cell-selected' : ''}`}
                              onClick={() => handleSelectSlot(d.dateStr, time)}
                            >
                              {isPast ? (
                                <span className="slot-booked">Past</span>
                              ) : freeCount === 0 ? (
                                <span className="slot-booked">Booked</span>
                              ) : (
                                <span className="slot-free">{freeCount} Free</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </section>
          </div>
        </main>
      </div>

      {isViewerOpen && currentRoom && (
        <div className="picture-viewer-modal" onClick={() => setIsViewerOpen(false)}>
          <img
            src={currentRoom.image || FALLBACK_IMAGE}
            alt={`Room ${currentRoom.room_number}`}
            className="expanded-image"
          />
          <span className="close-viewer-label">Click anywhere to close</span>
        </div>
      )}
    </div>
  );
}