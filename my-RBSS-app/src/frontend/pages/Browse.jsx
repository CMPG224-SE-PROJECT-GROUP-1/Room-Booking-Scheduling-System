import React, { useState, useEffect, useMemo } from 'react';
import './Browse.css';
import Card from '../components/Card';
import Button from '../components/Button';
import FilterSelect from '../components/FilterSelect';
import TextCard from '../components/TextCard';
import { bookingManager } from '../../backend/BookingManager';
import { TIMES, SLOT_HOURS, addHours, formatDisplayDate } from "../../frontend/utils/slots";

import { useNavigate } from 'react-router-dom';

const BUILDING_OPTIONS = ['Any building', 'Library', 'Humanities', 'Science Block', 'Commerce'];
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
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

// Helper to get real dates
function getUpcomingDays(count = 5) {
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

  const upcomingDays = useMemo(() => getUpcomingDays(4), []);
  const defaultDate = upcomingDays[0].dateStr;

  const [rooms, setRooms] = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [filters, setFilters] = useState({
    building: 'Any building',
    time: '09:00',
    date: defaultDate,
    amenity: 'Any amenity',
  });

  const [selectedSlot, setSelectedSlot] = useState({
    dateStr: defaultDate,
    time: '09:00',
  });
  const [roomIndex, setRoomIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
      if (!room.availability) return false; // Ignore blocked maintenance rooms
      if (filters.amenity === 'Any amenity') return true;
      return Array.isArray(room.amenities) && room.amenities.includes(filters.amenity);
    });
  }, [rooms, filters.amenity]);

  const availableRoomsAtSlot = useMemo(() => {
    return filteredRooms.filter((room) =>
      isRoomFree(room.room_id, selectedSlot.dateStr, selectedSlot.time)
    );
  }, [filteredRooms, selectedSlot, busySlots]);

  const currentRoom = availableRoomsAtSlot[roomIndex] || null;

  // Handlers
  const handleFilterChange = (field, val) => {
    setFilters((prev) => ({ ...prev, [field]: val }));
    setRoomIndex(0);

    if (field === 'date') {
      setSelectedSlot((prev) => ({ ...prev, dateStr: val }));
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
    alert("Going to book") // DEBUG
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

  // only blank the page on the very first load
  if (loading && rooms.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="browse-header"><p>Loading rooms...</p></div>
      </div>
    );
  }

  const activeDayObj = upcomingDays.find((d) => d.dateStr === selectedSlot.dateStr) || upcomingDays[0];
  const formattedAmenities = Array.isArray(currentRoom?.amenities) && currentRoom.amenities.length > 0
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
              <p>Filter by building, time, and amenities to view availability.</p>
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
                    options={upcomingDays.map((d) => ({ value: d.dateStr, label: d.label }))}
                    onChange={(val) => handleFilterChange('date', val)}
                  />
                  <FilterSelect
                    label="Amenity"
                    value={filters.amenity}
                    options={AMENITY_OPTIONS}
                    onChange={(val) => handleFilterChange('amenity', val)}
                  />
                </div>
              </div>
            </section>

            {/* Results + Calendar */}
            <section className="browse-right">
              <div className="results">

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

                {/* Selected Room Cards */}
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

                {/* Schedule Table */}
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
                    {upcomingDays.map((d) => (
                      <tr key={d.dateStr}>
                        <td>{d.dayName}</td>
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