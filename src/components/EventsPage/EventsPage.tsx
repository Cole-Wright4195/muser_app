"use client";
import React, { useState, useEffect } from 'react';
import './EventsPage.css';

interface Event {
  _id: string;
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

  return (
    <div className="event-list-container">
      <h2 className="event-list-title">YOUR EVENTS</h2>
      {events.map((event) => (
        <div key={event._id} className="event-item">
          <div>
            <div className="event-item-title">REHERSAL: {event.time || '8:00PM'}</div>
            <div className="event-item-location">LOCATION: {event.location || 'ADDRESS'}</div>
          </div>
          <button className="check-in-button">
            CHECK IN
          </button>
        </div>
      ))}
      <div className="event-actions-container">
        <button className="action-button">EDIT EVENT</button>
        <button className="action-button">NEW EVENT</button>
        <button className="action-button">DELETE EVENT</button>
      </div>
    </div>
  );
};

export default EventList;