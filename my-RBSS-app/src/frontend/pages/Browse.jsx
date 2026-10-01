import './Browse.css';
import Card from '../components/Card';
import Button from '../components/Button';
import FilterSelect from '../components/FilterSelect';
import TextCard from '../components/TextCard'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const days = ['Mon', 'Tues', 'Wed', 'Thurs'];
const times = ['09:00', '11:00', '15:00', '17:00', '19:00'];
const bookedMap = {
  Mon:   [false, true, false, false, true],
  Tues:  [true, false, false, false, false],
  Wed:   [false, false, true, false, false],
  Thurs: [false, false, false, true, false],
};

const ROOM_IMAGE_SRC = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

export default function Browse() {
  const navigate = useNavigate();
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div className="app-frame">
      <div className="page-wrapper">
        <main className="browse-page">

          {/* Full-width header above split */}
          <header className="browse-header">
            <TextCard
            tag="Room search and book"
            title="Select Your Room."
            metaLeft="Filter and take your time"
            metaRight="OCT 24, 2026"
            >
                <p>
                Filter by building, time, and amenities to view availability.
                </p>
            </TextCard>
          </header>

          <div className="browse-split-container">
            <section className="browse-left">
              <div className="search-body">
                <div className="filters">
                  <FilterSelect label="Building" value="Any building" />
                  <FilterSelect label="Time" value="Any time" />
                  <FilterSelect label="Date" value="Today" />
                  <FilterSelect label="Type" value="Study room" />

                  <Button variant="solid" fullWidth>Search</Button>
                </div>
              </div>
            </section>

            <section className="browse-right">
              <div className="results">

                <div className="cards-row">
                  {/* Picture Card */}
                  <Card className="picture-card">
                    <img
                      src= {ROOM_IMAGE_SRC}
                      alt="Room Preview (click to enlarge)"
                      className="room-image"
                      onClick={() => setIsViewerOpen(true)}
                    />
                  </Card>

                  <Card className="detail-card">
                    <dl>
                      <div><b>Capacity:</b> 6 people</div>
                      <div><b>Building:</b> Main Library</div>
                      <div><b>Availability:</b> Open now</div>
                      <div><b>Amenities:</b> Whiteboard, projector</div>
                    </dl>
                    <Button variant="solid" onClick={() => navigate('/booking')}>
                      Book now
                    </Button>
                  </Card>
                </div>

                <table className="schedule">
                  <thead>
                    <tr>
                      <th></th>
                      {times.map((t) => (
                        <th key={t}>{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day}>
                        <td>{day}</td>
                        {bookedMap[day].map((isBooked, i) => (
                          <td key={i}>
                            {isBooked ? (
                              <span className="slot-booked">Booked</span>
                            ) : (
                              '—'
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </section>
          </div>

        </main>
      </div>

    {/* Lightbox / Expanded modal */}
      {isViewerOpen && (
        <div 
          className="picture-viewer-modal" 
          onClick={() => setIsViewerOpen(false)}
        >
          <img 
            src={ROOM_IMAGE_SRC} 
            alt="Expanded room preview" 
            className="expanded-image"
          />
          <span className="close-viewer-label">Click anywhere to close</span>
        </div>
      )}

    </div>
  );
}