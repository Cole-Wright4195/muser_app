"use client";
import React, { useState, useEffect } from 'react';
import './BandManagement.css'; // Import CSS for styling

// -- Interfaces -----------------------------------------------------
export interface BandMember {
  id: string;
  name: string;
  role: string;
  firstName: string; // Add firstName
  lastName: string;  // Add lastName
}

export interface BandPosition {
  id: string;
  name: string;
  member: BandMember | null; // Updated to BandMember | null
}

export interface Band {
  _id: string; // API returns _id, not id
  bandName: string; // API expects bandName
  bandCode: string; // Returned from API
  manager: string; // Manager's ID as returned from API
  mandatoryPositions: {
    _id: string;
    position: string;
    filledBy?: string | null; // filledBy is user ID string or null from API
  }[]; // API response - filledBy is string (User ID) or null
  members: string[]; // Array of User IDs
  positions?: BandPosition[]; // Optional: extra positions info for display
}

// -- Component ------------------------------------------------------
const BandManagementPage: React.FC = () => {
  // State for the list of bands (real data from the API)
  const [bands, setBands] = useState<Band[]>([]);
  // State for session (manager ID)
  const [managerId, setManagerId] = useState<string>('');
  // Modal controls for viewing band members and creating a new band
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState<boolean>(false);
  const [viewingBandMembers, setViewingBandMembers] = useState<Band | null>(null);
  const [isViewBandCreationOpen, setIsViewBandCreationOpen] = useState<boolean>(false);
  // State for band creation form: positions and error message
  const [bandPositions, setBandPositions] = useState<string[]>(['']);
  const [bandCreationError, setBandCreationError] = useState<string | null>(null);
  // State to store fetched user data for band members in the modal
  const [bandMemberDetails, setBandMemberDetails] = useState<{ [userId: string]: BandMember }>({});

  // -- Fetch Session Info ------------------------------------------------
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.success && data.userId) {
          setManagerId(data.userId);
        } else {
          console.error('Session retrieval failed:', data.message);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    }
    fetchSession();
  }, []);

  // -- Fetch Bands -------------------------------------------------------
  useEffect(() => {
    if (!managerId) return;
    async function fetchBands() {
      try {
        const res = await fetch(`/api/bands?managerId=${managerId}`);
        const data = await res.json();
        if (data.success) {
          setBands(data.bands);
        } else {
          console.error('Error fetching bands:', data.message);
        }
      } catch (error) {
        console.error('Error fetching bands:', error);
      }
    }
    fetchBands();
  }, [managerId]);

  

  // -- Handlers ----------------------------------------------------------
  const handleEditBand = (bandId: string) => {
    console.log(`Edit band ${bandId}`);
    alert(`Edit band functionality for band ID: ${bandId} (Not implemented yet)`);
  };

  const handleDeleteBand = async (bandId: string) => {
    console.log(`Delete band ${bandId}`);
    try {
      const res = await fetch(`/api/bands/${bandId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        // Remove the deleted band from state
        setBands(bands.filter(band => band._id !== bandId));
        alert(`Band ID: ${bandId} deleted successfully.`);
      } else {
        alert(`Error deleting band: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting band:', error);
    }
  };

  const handleViewBandMembers = async (band: Band) => {
    console.log(`View members of band ${band._id}`);
    setViewingBandMembers(band);
    setIsViewMembersModalOpen(true);

    // Fetch user details for each filled position
    const memberDetails: { [userId: string]: BandMember } = {};
    for (const position of band.mandatoryPositions) {
      if (position.filledBy !== null) {
        try {
          const res = await fetch(`/api/users/${position._id}`);
          if (!res.ok) {
            console.error(`Failed to fetch user details for ID: ${position._id}`);
            continue; // Skip to the next user if fetch fails
          }
          const userData = await res.json();
          if (userData.success && userData.user !== null) {
            memberDetails[userData._id] = {
              id: userData.user._id,
              name: `${userData.user.firstName} ${userData.user.lastName}`,
              role: userData.user.primaryInstrument || 'Musician', // Or determine role based on position?
              firstName: userData.user.firstName, // Add firstName
              lastName: userData.user.lastName,   // Add lastName
            };
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    }
    setBandMemberDetails(memberDetails);
  };

  const closeViewMembersModal = () => {
    setIsViewMembersModalOpen(false);
    setViewingBandMembers(null);
    setBandMemberDetails({}); // Clear user details when modal closes
  };

  const handleViewBandCreation = () => {
    setIsViewBandCreationOpen(true);
    setBandPositions(['']); // Reset positions when opening modal
    setBandCreationError(null);
  };

  const closeBandCreationModal = () => {
    setIsViewBandCreationOpen(false);
    setBandCreationError(null);
  };

  const handleAddPositionInput = () => {
    setBandPositions([...bandPositions, '']);
  };

  const handlePositionInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newPositions = [...bandPositions];
    newPositions[index] = event.target.value;
    setBandPositions(newPositions);
  };

  const handleCreateBandSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBandCreationError(null);

    const bandNameInput = ((event.target as HTMLFormElement).elements.namedItem('band-name') as HTMLInputElement).value;

    if (!bandNameInput.trim()) {
      setBandCreationError("Band name cannot be empty.");
      return;
    }

    if (bandPositions.every(pos => !pos.trim())) {
      setBandCreationError("At least one band position must be specified.");
      return;
    }

    try {
      const response = await fetch('/api/bands/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bandName: bandNameInput,
          managerId: managerId,
          mandatoryPositions: bandPositions.filter(pos => pos.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean, band: Band } = await response.json();
      if (data.success) {
        // Add the newly created band to the state
        setBands([...bands, data.band]);
        setIsViewBandCreationOpen(false);
        alert(`Band "${bandNameInput}" created successfully!`);
      } else {
        setBandCreationError('Band creation failed');
      }
    } catch (error: any) {
      console.error('Band creation error:', error);
      setBandCreationError(error.message || 'Failed to create band.');
    }
  };

  // -- Render Helpers -----------------------------------------------------
  const renderBandMembersPopup = () => {
    if (!isViewMembersModalOpen || !viewingBandMembers) return null;

    return (
      <div className="band-members-modal-overlay">
        <div className="band-members-modal">
          <h3 className="band-members-modal-title">
            Band Members: {viewingBandMembers.bandName}
          </h3>
          <ul className="band-member-list">
            {viewingBandMembers.mandatoryPositions.map((position) => (
              <li key={position._id} className="band-member-item">
                <span className="band-member-position">{position.position}:</span>
                <span className="band-member-name">
                  {position.filledBy
                    ? `${position.filledBy.firstName} ${position.filledBy.lastName}`
                    : 'Vacant'}
                </span>
              </li>
            ))}
          </ul>
          <div className="band-members-modal-actions">
            <button
              className="modal-button modal-button-secondary"
              onClick={closeViewMembersModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  

  const renderBandCreationPopup = () => {
    if (!isViewBandCreationOpen) return null;
    return (
      <div className="band-creation-modal-overlay">
        <div className="band-creation-modal">
          <h3 className="band-creation-modal-title">Create Band</h3>
          {bandCreationError && <p className="error-message">{bandCreationError}</p>}
          <form className="band-creation-form" onSubmit={handleCreateBandSubmit}>
            <label htmlFor="band-name">Band Name:</label>
            <input type="text" id="band-name" name="band-name" />

            <label htmlFor="band-positions">Band Positions:</label>
            <div className="band-positions-inputs-container">
              {bandPositions.map((position, index) => (
                <div key={index} className="band-position-input-group">
                  <input
                    type="text"
                    id={`band-positions-${index}`}
                    name={`band-positions-${index}`}
                    value={position}
                    placeholder={`Position ${index + 1}`}
                    className="band-position-input"
                    onChange={(event) => handlePositionInputChange(index, event)}
                  />
                </div>
              ))}
              <button type="button" className="add-position-button" onClick={handleAddPositionInput}>
                +
              </button>
            </div>
            <div className="band-creation-form-actions">
              <button type="button" className="modal-button modal-button-secondary" onClick={closeBandCreationModal}>Cancel</button>
              <button type="submit" className="modal-button modal-button-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // -- Main Render --------------------------------------------------------
  return (
    <div className="band-management-page-container">
      <h1 className="band-management-title">Band Management</h1>
      <div className="band-cards-grid">
        {bands.map(band => (
          <div key={band._id} className="band-card">
            <h2 className="band-name">{band.bandName}</h2>
            <p className="band-code">Band Code: {band.bandCode}</p>
            <div className="band-actions">
              <button className="action-button edit" onClick={() => handleEditBand(band._id)}>Edit</button>
              <button className="action-button delete" onClick={() => handleDeleteBand(band._id)}>Delete</button>
              <button className="action-button view-members" onClick={() => handleViewBandMembers(band)}>View Members</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className="action-button add-band" onClick={handleViewBandCreation}>Add Band</button>
      </div>
      {renderBandCreationPopup()}
      {renderBandMembersPopup()}
    </div>
  );
};

export default BandManagementPage;