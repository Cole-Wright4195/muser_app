"use client";
import React, { useState } from 'react';
import './BandManagement.css'; // Import CSS for styling

interface BandMember {
  id: string;
  name: string;
  role: string;
}

interface Band {
  id: string;
  name: string;
  positions: BandPosition[];
}

interface BandPosition {
  id: string;
  name: string;
  member?: BandMember | null;
}

const DummyBandMembers: BandMember[] = [
    { id: 'mem1', name: 'Member 1', role: 'Guitar' },
    { id: 'mem2', name: 'Member 2', role: 'Vocals' },
    { id: 'mem3', name: 'Member 3', role: 'Drums' },
    { id: 'mem4', name: 'Member 4', role: 'Bass' },
];

const DummyBands: Band[] = [
    {
        id: 'band1', name: 'Rock Titans', positions: [
            { id: 'pos1-1', name: 'Lead Guitar', member: DummyBandMembers[0] },
            { id: 'pos1-2', name: 'Vocals', member: DummyBandMembers[1] },
            { id: 'pos1-3', name: 'Drums', member: null },
        ]
    },
    {
        id: 'band2', name: 'Metalheads United', positions: [
            { id: 'pos2-1', name: 'Guitar', member: DummyBandMembers[2] },
            { id: 'pos2-2', name: 'Vocals', member: DummyBandMembers[3] },
            { id: 'pos2-3', name: 'Bass', member: null },
            { id: 'pos2-4', name: 'Keys', member: null },
        ]
    },
];


const BandManagementPage: React.FC = () => {
  const [bands, setBands] = useState<Band[]>(DummyBands); // Using dummy data for bands
  const [isNewBandModalOpen, setIsNewBandModalOpen] = useState<boolean>(false);
  const [selectedBandMembers, setSelectedBandMembers] = useState<BandMember[]>(DummyBandMembers); // Using dummy members
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState<boolean>(false);
  const [viewingBandMembers, setViewingBandMembers] = useState<Band | null>(null);


  const handleEditBand = (bandId: string) => {
    console.log(`Edit band ${bandId}`);
    alert(`Edit band functionality for band ID: ${bandId} (Not implemented yet)`);
  };

  const handleDeleteBand = (bandId: string) => {
    console.log(`Delete band ${bandId}`);
    // In real app, implement delete logic, update state
    const updatedBands = bands.filter(band => band.id !== bandId);
    setBands(updatedBands);
    alert(`Band ID: ${bandId} deleted (Simulated)`);
  };

  const handleViewBandMembers = (band: Band) => {
    console.log(`View members of band ${band.id}`);
    setViewingBandMembers(band);
    setIsViewMembersModalOpen(true);
  };

  const openNewBandModal = () => {
    setIsNewBandModalOpen(true);
  };

  const closeNewBandModal = () => {
    setIsNewBandModalOpen(false);
  };

  const closeViewMembersModal = () => {
    setIsViewMembersModalOpen(false);
    setViewingBandMembers(null);
  };


  const renderBandMembersPopup = () => {
    if (!isViewMembersModalOpen || !viewingBandMembers) return null;

    return (
        <div className="band-members-modal-overlay">
            <div className="band-members-modal">
                <h3 className="band-members-modal-title">Band Members: {viewingBandMembers.name}</h3>
                <ul className="band-member-list">
                    {viewingBandMembers.positions.map((position) => (
                        <li key={position.id} className="band-member-item">
                            <span className="band-member-position">{position.name}:</span>
                            <span className="band-member-name">{position.member ? position.member.name : 'Vacant'}</span>
                        </li>
                    ))}
                </ul>
                <div className="band-members-modal-actions">
                    <button className="modal-button modal-button-secondary" onClick={closeViewMembersModal}>Close</button>
                </div>
            </div>
        </div>
    );
  };


  const renderNewBandModal = () => {
    if (!isNewBandModalOpen) return null;

    const [newBandName, setNewBandName] = useState('');
    const [positions, setPositions] = useState<BandPosition[]>([{ id: `pos-0`, name: 'Position 1', member: null }]); // Start with one position

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewBandName(e.target.value);
    };

    const addPosition = () => {
      const newPositionId = `pos-${positions.length}`;
      setPositions([...positions, { id: newPositionId, name: `Position ${positions.length + 1}`, member: null }]);
    };

    const handlePositionNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedPositions = positions.map((pos, posIndex) =>
        posIndex === index ? { ...pos, name: e.target.value } : pos
      );
      setPositions(updatedPositions);
    };

    const handleAssignMember = (positionIndex: number, memberId: string) => {
        const selectedMember = selectedBandMembers.find(mem => mem.id === memberId) || null;
        const updatedPositions = positions.map((pos, posIndex) =>
            posIndex === positionIndex ? { ...pos, member: selectedMember } : pos
        );
        setPositions(updatedPositions);
    };


    const handleCreateNewBand = () => {
      if (!newBandName.trim()) {
        alert("Band name cannot be empty.");
        return;
      }

      const nextBandId = `band${bands.length + 1}`;
      const newBand: Band = {
        id: nextBandId,
        name: newBandName,
        positions: positions,
      };

      setBands([...bands, newBand]);
      setIsNewBandModalOpen(false);
      alert(`Band "${newBandName}" created! (Simulated)`);
      // In real app, send newBand data to backend and handle response
    };


    return (
      <div className="new-band-modal-overlay">
        <div className="new-band-modal">
          <h3 className="new-band-modal-title">Create New Band</h3>

          <div className="new-band-form-group">
            <label htmlFor="bandName" className="new-band-label">Band Name:</label>
            <input
              type="text"
              id="bandName"
              className="new-band-input"
              value={newBandName}
              onChange={handleNameChange}
              placeholder="Enter band name"
            />
          </div>

          <h4 className="positions-title">Band Positions</h4>
          <div className="positions-container">
              {positions.map((position, index) => (
                  <div key={position.id} className="position-input-group">
                      <label htmlFor={`positionName-${index}`} className="position-label">Position {index + 1} Name:</label>
                      <input
                          type="text"
                          id={`positionName-${index}`}
                          className="position-name-input"
                          value={position.name}
                          onChange={(e) => handlePositionNameChange(index, e)}
                          placeholder={`Position ${index + 1} Name`}
                      />
                       <label htmlFor={`member-${index}`} className="position-label">Assign Member:</label>
                       <select
                            id={`member-${index}`}
                            className="assign-member-select"
                            onChange={(e) => handleAssignMember(index, e.target.value)}
                            value={position.member ? position.member.id : ''}
                        >
                            <option value="">-- Select Member --</option>
                            {selectedBandMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                            ))}
                        </select>
                  </div>
              ))}
          </div>
          <button className="add-position-button" onClick={addPosition}>+ Add Position</button>


          <div className="new-band-modal-actions">
            <button className="modal-button modal-button-primary" onClick={handleCreateNewBand}>Create Band</button>
            <button className="modal-button modal-button-secondary" onClick={closeNewBandModal}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="band-management-page-container">
      <h1 className="band-management-title">Band Management</h1>
      <div className="band-cards-grid">
        {bands.map(band => (
          <div key={band.id} className="band-card">
            <h2 className="band-name">{band.name}</h2>
            <div className="band-actions">
              <button className="action-button edit" onClick={() => handleEditBand(band.id)}>Edit</button>
              <button className="action-button delete" onClick={() => handleDeleteBand(band.id)}>Delete</button>
              <button className="action-button view-members" onClick={() => handleViewBandMembers(band)}>View Members</button>
            </div>
          </div>
        ))}
      </div>
      <div className="band-actions-container">
        <button className="action-button new-band" onClick={openNewBandModal}>New Band</button>
      </div>

      {renderNewBandModal()}
      {renderBandMembersPopup()}
    </div>
  );
};

export default BandManagementPage;