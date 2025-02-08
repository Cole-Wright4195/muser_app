import React from 'react';
import './StatusPage.css'; // Import CSS for styling

interface BandMember {
  id: string;
  name: string;
  role: string;
  availability: 'green' | 'yellow' | 'red';
  status: string;
}

const StatusPage: React.FC = () => {
  // Dummy data for band members
  const bandMembers: BandMember[] = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Guitarist',
      availability: 'green',
      status: 'Practicing solos'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Vocals',
      availability: 'yellow',
      status: 'Warming up vocals'
    },
    {
      id: '3',
      name: 'Peter Jones',
      role: 'Drummer',
      availability: 'red',
      status: 'Setting up drums, taking a while...'
    },
    {
      id: '4',
      name: 'Alice Brown',
      role: 'Bassist',
      availability: 'green',
      status: 'Ready to jam'
    },
    {
      id: '5',
      name: 'Bob Williams',
      role: 'Keyboardist',
      availability: 'yellow',
      status: 'Troubleshooting keyboard settings'
    },
  ];

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