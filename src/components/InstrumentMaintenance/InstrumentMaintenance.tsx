import React from 'react';
import './InstrumentMaintenance.css'; 

interface Instrument {
  name: string;
  status: 'Good' | 'Fair' | 'Needs Repair';
}

interface BandMemberEquipment {
  id: string;
  memberName: string;
  instruments: Instrument[];
}

const EquipmentManagementPage: React.FC = () => {
  const bandEquipmentData: BandMemberEquipment[] = [
    {
      id: '1',
      memberName: 'John Doe',
      instruments: [
        { name: 'Fender Stratocaster', status: 'Good' },
        { name: 'Marshall Amplifier', status: 'Fair' },
        { name: 'Pedalboard', status: 'Good' },
      ],
    },
    {
      id: '2',
      memberName: 'Jane Smith',
      instruments: [
        { name: 'Shure SM58 Microphone', status: 'Good' },
        { name: 'Keyboard Stand', status: 'Good' },
        { name: 'In-Ear Monitors', status: 'Good' },
      ],
    },
    {
      id: '3',
      memberName: 'Peter Jones',
      instruments: [
        { name: 'Drum Kit', status: 'Fair' },
        { name: 'Cymbal Set', status: 'Needs Repair' },
        { name: 'Drum Pedals', status: 'Good' },
      ],
    },
    {
      id: '4',
      memberName: 'Alice Brown',
      instruments: [
        { name: 'Fender Precision Bass', status: 'Good' },
        { name: 'Ampeg Bass Amplifier', status: 'Good' },
        { name: 'Bass Cables', status: 'Good' },
      ],
    },
    {
      id: '5',
      memberName: 'Bob Williams',
      instruments: [
        { name: 'Yamaha Synthesizer', status: 'Fair' },
        { name: 'MIDI Controller', status: 'Good' },
        { name: 'Keyboard Case', status: 'Good' },
      ],
    },
  ];

  const handleAssignMaintenance = (memberName: string, instrumentName: string) => {
    console.log(`Maintenance assigned for ${instrumentName} of ${memberName}`);
    alert(`Maintenance task assigned for ${instrumentName} of ${memberName}`);
  };

  return (
    <div className="equipment-management-container">
      <h1>Equipment Management</h1>
      <div className="band-equipment-grid">
        {bandEquipmentData.map((memberEquipment) => (
          <div key={memberEquipment.id} className="band-equipment-card">
            <h2 className="member-equipment-name">{memberEquipment.memberName}</h2>
            <ul className="instrument-list">
              {memberEquipment.instruments.map((instrument, index) => (
                <li key={index} className="instrument-item">
                  <div className="instrument-info">
                    <h3 className="instrument-name">{instrument.name}</h3>
                    <p className="instrument-status">Status: {instrument.status}</p>
                  </div>
                  <button
                    className="maintenance-button"
                  >
                    Assign Maintenance
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentManagementPage;