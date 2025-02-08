"use client";
import React, { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);  // State to hold events data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null);  // Error handling state

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        } else {
          setError('Failed to load events');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
        setLoading(false);
      });
  }, []); 

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-item">
            <h2>{event.title}</h2>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
