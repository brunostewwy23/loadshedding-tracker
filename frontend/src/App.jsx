import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3002/api';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('loadshedding_favorites');
    if (saved) setFavorites(JSON.parse(saved));
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API}/status`);
      setStatus(res.data.status);
    } catch (error) {
      console.error('Status error:', error);
    }
  };

  const searchAreas = async () => {
    if (searchQuery.length < 2) return;
    try {
      const res = await axios.get(`${API}/search`, { params: { query: searchQuery } });
      setSearchResults(res.data.areas || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectArea = async (area) => {
    setSelectedArea(area);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/schedule`, { params: { areaId: area.id } });
      setSchedule(res.data.schedule);
    } catch (error) {
      console.error('Schedule error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = () => {
    if (!selectedArea) return;
    if (!favorites.find(f => f.id === selectedArea.id)) {
      const newFavs = [...favorites, selectedArea];
      setFavorites(newFavs);
      localStorage.setItem('loadshedding_favorites', JSON.stringify(newFavs));
    }
  };

  const removeFavorite = (areaId) => {
    const newFavs = favorites.filter(f => f.id !== areaId);
    setFavorites(newFavs);
    localStorage.setItem('loadshedding_favorites', JSON.stringify(newFavs));
  };

  const getStageClass = (stage) => {
    const num = parseInt(stage);
    if (isNaN(num)) return 'stage-0';
    if (num === 0) return 'stage-0';
    if (num <= 2) return 'stage-1';
    if (num <= 4) return 'stage-2';
    if (num <= 6) return 'stage-3';
    return 'stage-4';
  };

  // Generate full week schedule
  const getFullWeekSchedule = () => {
    if (!selectedArea) return [];
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const currentHour = today.getHours();
    const weekSchedule = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = days[date.getDay()];
      const dayNum = date.getDay();
      
      // Generate schedule based on area ID and day
      const areaNum = parseInt(selectedArea.id);
      const baseHour = (areaNum * 2 + dayNum * 3) % 24;
      const stage = status?.stage || 2;
      
      let slots = [];
      if (stage > 0) {
        const slotCount = Math.min(stage, 4);
        for (let s = 0; s < slotCount; s++) {
          let slotHour = (baseHour + s * 4) % 24;
          slots.push({
            start: `${slotHour.toString().padStart(2, '0')}:00`,
            end: `${(slotHour + 2).toString().padStart(2, '0')}:30`
          });
        }
      }
      
      // Mark if currently happening
      const isToday = i === 0;
      const isHappeningNow = isToday && slots.some(slot => {
        const startHour = parseInt(slot.start.split(':')[0]);
        const endHour = parseInt(slot.end.split(':')[0]);
        return currentHour >= startHour && currentHour < endHour;
      });
      
      weekSchedule.push({
        day: dayName,
        date: date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
        slots: slots,
        isToday: isToday,
        isHappeningNow: isHappeningNow
      });
    }
    
    return weekSchedule;
  };

  const weekSchedule = getFullWeekSchedule();

  return (
    <div className="container">
      <div style={{ textAlign: 'center' }}>
        <h1>⚡ LOADSHEDDING TRACKER</h1>
        <div className="subtitle">Know when the lights go out | South Africa</div>
      </div>

      {/* Current Stage */}
      {status && (
        <div className="stage-card">
          <div className="stage-label">CURRENT LOADSHEDDING STAGE</div>
          <div className={`stage-value ${getStageClass(status.stage)}`}>
            Stage {status.stage}
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.8 }}>
            📢 {status.note}
          </div>
          {status.nextUpdate && (
            <div style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.6 }}>
              Next update: {status.nextUpdate}
            </div>
          )}
        </div>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="favorites">
          {favorites.map(fav => (
            <button key={fav.id} className="fav-btn" onClick={() => selectArea(fav)}>
              ⭐ {fav.name}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="🔍 Search your suburb or area... (e.g. Sandton, Cape Town, Pretoria)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setTimeout(() => searchAreas(), 300);
          }}
        />
        {searchResults.length > 0 && (
          <div className="results-dropdown">
            {searchResults.slice(0, 10).map(area => (
              <div key={area.id} className="result-item" onClick={() => selectArea(area)}>
                <strong>{area.name}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{area.region}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Area Info */}
      {selectedArea && (
        <div className="schedule-card">
          <div className="schedule-title">
            📍 {selectedArea.name}
            <span>{selectedArea.region}</span>
            <button
              onClick={addFavorite}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              {favorites.find(f => f.id === selectedArea.id) ? '★' : '☆'}
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading schedule... ⚡</div>
          ) : schedule ? (
            <>
              {/* Today's Schedule */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>📅 TODAY'S SCHEDULE</div>
                  {weekSchedule[0]?.isHappeningNow && (
                    <div style={{ background: '#ff6b6b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
                      🔴 HAPPENING NOW
                    </div>
                  )}
                </div>
                {schedule.events && schedule.events.length > 0 ? (
                  <div className="times-grid">
                    {schedule.events.map((slot, idx) => (
                      <div key={idx} className="time-slot">
                        <div className="time-slot.time">
                          ⚡ {slot.start} - {slot.end}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(72,219,251,0.1)', borderRadius: '16px' }}>
                    ✅ No loadshedding scheduled for today in {selectedArea.name}
                  </div>
                )}
              </div>

              {/* Full Week Schedule */}
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px' }}>
                  📆 7-DAY FORECAST
                </div>
                {weekSchedule.map((day, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      marginBottom: '12px', 
                      padding: '15px', 
                      background: day.isToday ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.05)', 
                      borderRadius: '16px',
                      border: day.isToday ? '1px solid rgba(255,107,107,0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '1rem' }}>{day.day}</strong>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '10px' }}>{day.date}</span>
                      </div>
                      {day.isToday && <span style={{ fontSize: '0.7rem', background: '#ff6b6b', padding: '2px 8px', borderRadius: '12px' }}>TODAY</span>}
                    </div>
                    {day.slots.length > 0 ? (
                      <div className="times-grid" style={{ marginTop: '8px' }}>
                        {day.slots.map((slot, slotIdx) => (
                          <div key={slotIdx} className="time-slot" style={{ padding: '8px' }}>
                            {slot.start} - {slot.end}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem', opacity: 0.6, padding: '8px 0' }}>
                        ✅ No loadshedding
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', opacity: 0.5, paddingBottom: '20px' }}>
        ⚡ Real-time loadshedding schedule | Data simulated for demo
        <br />
        Stage changes throughout the day to demonstrate functionality
      </div>
    </div>
  );
}

export default App;
