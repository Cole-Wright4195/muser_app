"use client";
import React, { useState, useEffect } from 'react';
import './EventsPage.css';

interface Event {
  _id: string;
  name?: string;
  title?: string;
  time?: string;
  location?: string;
}

interface ApiResponse {
  success: boolean;
  events?: Event[];
  error?: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [newEventData, setNewEventData] = useState<{name: string, location: string, date: string,}>({
    name: '',
    location: '',
    date: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        if (data.success) {
          setEvents(data.events || []);
        } else {
          setError(data.error || 'Failed to fetch events');
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const openCreateEventPopup = () => { setIsVisible(true); }

  const closeCreateEventPopup = () => {
    setIsVisible(false);
    setNewEventData({name: '', location: '', date: ''});
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEventData({ ...newEventData, [name]: value });
  };

    const handleAddEvent = async () => {
        try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEventData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        if (data.success) {
            setEvents([...events, data.events![0]]);
            closeCreateEventPopup();
        } else {
            setError(data.error || 'Failed to add event');
        }
        } catch (e: any) {
        setError(e.message || 'Failed to add event');
        }
    }

  return (
    <div className="event-list-container">
      <h2 className="event-list-title">YOUR EVENTS</h2>
      {events.map((event) => (
        <div key={event._id} className="event-item">
          <div>
            <div className="event-item-title">{event.name}: {event.time || '8:00PM'}</div>
            <div className="event-item-location">LOCATION: {event.location || 'ADDRESS'}</div>
          </div>
          <button className="check-in-button">
            CHECK IN
          </button>
        </div>
      ))}
      <div className="event-actions-container">
        <button className="action-button">EDIT EVENT</button>
        <button className="action-button" onClick={openCreateEventPopup}>NEW EVENT</button>
        <button className="action-button">DELETE EVENT</button>
      </div>
      {
        isVisible && (
            <div className="event-modal-overlay">
          <div className="event-modal">
            <h3 className="event-modal-title">Add New Event</h3>
            <div className="event-modal-content">
              <div className="input-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newEventData.name}
                  onChange={handleInputChange}
                  className="modal-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newEventData.location}
                  onChange={handleInputChange}
                  className="modal-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date" 
                  id="date"
                  name="date"
                  value={newEventData.date}
                  onChange={handleInputChange}
                  className="modal-input"
                />
              </div>
            </div>
            <div className="event-modal-actions">
              <button className="modal-button modal-button-primary" onClick={handleAddEvent}>Add Event</button>
              <button className="modal-button modal-button-secondary" onClick={closeCreateEventPopup}>Cancel</button>
            </div>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default EventList;