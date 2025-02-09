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
  useEffect(() => {
    if (!managerId) return;

    const fetchBandMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the band where managerId is the band's manager
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
          // Find the role for this member in `mandatoryPositions`
          const position = mandatoryPositions.find(
            (pos: any) => pos.filledBy && pos.filledBy._id === member._id
          );

          return {
            id: member._id,
            name: `${member.firstName} ${member.lastName}`,
            role: position ? position.position : "Musician", // Assign role if found
            availability: 'green', // Default availability
            status: '' // Default status
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

    fetchBandMembers();
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
