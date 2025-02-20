"use client";
import React, { useState, useEffect } from 'react';
import './StatusPage.css'; 

interface BandMember {
  id: string;
  name: string;
  role: string;
  availability: 'yellow' | 'green' | 'red';
  status: string;
}

const StatusPage: React.FC = () => {
  const [bandMembers, setBandMembers] = useState<BandMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string | null>(null);

  // Step 1: Fetch Manager ID from Session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.success && data.userId) {
          setManagerId(data.userId);
        } else {
          throw new Error("Failed to get manager session.");
        }
      } catch (error: any) {
        console.error("Session fetch error:", error);
        setError(error.message);
      }
    };

    fetchSession();
  }, []);

  // Step 2: Fetch Band Members & Assign Roles
  const fetchBandMembers = async () => {
    if (!managerId) return;

    setLoading(true);
    setError(null);
    try {
      const bandResponse = await fetch(`/api/bands?managerId=${managerId}`);
      if (!bandResponse.ok) throw new Error("Failed to fetch band.");
      const bandData = await bandResponse.json();

      if (!bandData.success || bandData.bands.length === 0) {
        throw new Error("No band found for this manager.");
      }

      const band = bandData.bands[0]; // Assuming manager only has one band
      const members = band.members; // Already populated members array
      const mandatoryPositions = band.mandatoryPositions; // Get role info

      // Map members into the correct format for the UI
      const formattedMembers: BandMember[] = members.map((member: any) => {
        const position = mandatoryPositions.find(
          (pos: any) => pos.filledBy && pos.filledBy._id === member._id
        );

        return {
          id: member._id,
          name: `${member.firstName} ${member.lastName}`,
          role: position ? position.position : "Musician", 
          availability: member.availability || 'yellow', // Default is yellow
          status: ''
        };
      });

      setBandMembers(formattedMembers);
    } catch (e: any) {
      console.error("Fetch error:", e);
      setError(e.message || 'Failed to retrieve band members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBandMembers();
    const interval = setInterval(fetchBandMembers, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [managerId]);

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

  const handleNudge = async (memberId: string) => {
    const member = bandMembers.find(member => member.id === memberId);
    if (!member) return;
  
    try {
      const response = await fetch('/api/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId, bandName: "Your Band Name" })
      });
  
      const data = await response.json();
      if (data.success) {
        alert(`Nudge sent to ${member.name}!`);
      } else {
        alert(`Failed to nudge ${member.name}: ${data.message}`);
      }
    } catch (error) {
      console.error("Error nudging user:", error);
    }
  };

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
