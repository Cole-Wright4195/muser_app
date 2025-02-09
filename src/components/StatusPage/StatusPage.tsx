"use client";
import React, { useState, useEffect } from 'react';
import './StatusPage.css'; 

interface BandMember {
  id: string;
  name: string;
  role: string;
  availability: 'green' | 'yellow' | 'red';
  status: string;
}

const StatusPage: React.FC = () => {
  const [bandMembers, setBandMembers] = useState<BandMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBandMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          const mappedMembers: BandMember[] = data.users.map((user: any) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            role: user.primaryInstrument || 'Musician', 
            availability: 'green',
            status: '' 
          }));
          setBandMembers(mappedMembers);
        } else {
          setError(data.error || 'Failed to retrieve band members');
        }
      } catch (e: any) {
        console.error("Fetch error:", e);
        setError(e.message || 'Failed to retrieve band members');
      } finally {
        setLoading(false);
      }
    };

    fetchBandMembers();
  }, []);

  const getAvailabilityIcon = (availability: 'green' | 'yellow' | 'red') => {
    switch (availability) {
      case 'green':
        return <span className="availability-icon green"></span>;
      case 'yellow':
        return <span className="availability-icon yellow"></span>;
      case 'red':
        return <span className="availability-icon red"></span>;
      default:
        return null;
    }
  };

  const handleNudge = (memberId: string) => {
    console.log(`Nudge button clicked for member ID: ${memberId}`);
    alert(`Nudging ${bandMembers.find(member => member.id === memberId)?.name}`);
  };

  if (loading) {
    return <div className="status-page-container">Loading band members...</div>;
  }

  if (error) {
    return <div className="status-page-container">Error loading band members: {error}</div>;
  }

  return (
    <div className="status-page-container">
      <h1>Band Status</h1>
      <div className="band-members-grid">
        {bandMembers.map(member => (
          <div key={member.id} className="band-member-card">
            <div className="member-info">
              <h2 className="member-name">{member.name}</h2>
              <p className="member-role">{member.role}</p>
            </div>
            <div className="member-status">
              <div className="availability-indicator">
                Availability: {getAvailabilityIcon(member.availability)}
              </div>
              <p className="status-text">Status: {member.status}</p>
            </div>
            <button
              className="nudge-button"
              onClick={() => handleNudge(member.id)} 
            >
              Nudge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPage;