"use client";
import React, { useState } from 'react';
import './BandManagement.css'; // Import CSS for styling

interface BandMember {
    id: string;
    name: string;
    role: string;
}

interface Band {
    _id: string; // Important: API returns _id, not id
    bandName: string; // Important: API expects bandName, not name
    bandCode: string; // Add bandCode as it's returned from API
    manager: string; // Add manager as it's returned from API
    mandatoryPositions: { _id: string; position: string }[]; // Adjust to match API response
    members: string[]; // Adjust to match API response
    positions: BandPosition[]; // Keep positions for frontend display - may need adjustment based on final backend design
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
        _id: 'band1', bandName: 'Rock Titans', bandCode: 'RT1234', manager: 'manager1', mandatoryPositions: [{ _id: 'mp1', position: 'Lead Guitar' }, { _id: 'mp2', position: 'Vocals' }, { _id: 'mp3', position: 'Drums' }], members: ['manager1'],
        positions: [ // Keep positions for frontend, adjust as needed
            { id: 'pos1-1', name: 'Lead Guitar', member: DummyBandMembers[0] },
            { id: 'pos1-2', name: 'Vocals', member: DummyBandMembers[1] },
            { id: 'pos1-3', name: 'Drums', member: null },
        ]
    },
    {
        _id: 'band2', bandName: 'Metalheads United', bandCode: 'MU5678', manager: 'manager2', mandatoryPositions: [{ _id: 'mp4', position: 'Guitar' }, { _id: 'mp5', position: 'Vocals' }, { _id: 'mp6', position: 'Bass' }, { _id: 'mp7', position: 'Keys' }], members: ['manager2'],
        positions: [ // Keep positions for frontend, adjust as needed
            { id: 'pos2-1', name: 'Guitar', member: DummyBandMembers[2] },
            { id: 'pos2-2', name: 'Vocals', member: DummyBandMembers[3] },
            { id: 'pos2-3', name: 'Bass', member: null },
            { id: 'pos2-4', name: 'Keys', member: null },
        ]
    },
];


const BandManagementPage: React.FC = () => {
    const [bands, setBands] = useState<Band[]>(DummyBands); // Using dummy data for bands
    const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState<boolean>(false);
    const [viewingBandMembers, setViewingBandMembers] = useState<Band | null>(null);
    const [isViewBandCreationOpen, setIsViewBandCreationOpen] = useState<boolean>(false);
    const [bandPositions, setBandPositions] = useState<string[]>(['']); // Initialize with one position input
    const [bandCreationError, setBandCreationError] = useState<string | null>(null); // State for error message

    // Placeholder for managerId - in real app, get from authentication context
    const managerId = 'userManager123';

    const handleEditBand = (bandId: string) => {
        console.log(`Edit band ${bandId}`);
        alert(`Edit band functionality for band ID: ${bandId} (Not implemented yet)`);
    };

    const handleDeleteBand = (bandId: string) => {
        console.log(`Delete band ${bandId}`);
        // In real app, implement delete logic, update state
        const updatedBands = bands.filter(band => band._id !== bandId); // Use _id for filtering
        setBands(updatedBands);
        alert(`Band ID: ${bandId} deleted (Simulated)`);
    };

    const handleViewBandMembers = (band: Band) => {
        console.log(`View members of band ${band._id}`); // Use _id
        setViewingBandMembers(band);
        setIsViewMembersModalOpen(true);
    };


    const closeViewMembersModal = () => {
        setIsViewMembersModalOpen(false);
        setViewingBandMembers(null);
    };

    const handleViewBandCreation = () => {
        setIsViewBandCreationOpen(true);
        setBandPositions(['']); // Reset band positions when opening creation modal
        setBandCreationError(null); // Clear any previous errors
    };

    const closeBandCreationModal = () => {
        setIsViewBandCreationOpen(false);
        setBandCreationError(null); // Clear error on close
    };

    const handleAddPositionInput = () => {
        setBandPositions([...bandPositions, '']); // Add a new empty input field
    };

    const handlePositionInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newPositions = [...bandPositions];
        newPositions[index] = event.target.value;
        setBandPositions(newPositions);
    };

    const handleCreateBandSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setBandCreationError(null); // Clear any previous errors

        const bandNameInput = ((event.target as HTMLFormElement).elements.namedItem('band-name') as HTMLInputElement).value;

        if (!bandNameInput.trim()) {
            setBandCreationError("Band name cannot be empty.");
            return;
        }

        if (bandPositions.every(pos => !pos.trim())) { // Check if all positions are empty
            setBandCreationError("At least one band position must be specified.");
            return;
        }

        try {
            const response = await fetch('/api/bands/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                setBands([...bands, data.band]); // Add the newly created band to the state
                setIsViewBandCreationOpen(false);
                alert(`Band "${bandNameInput}" created successfully!`);
                // Optionally re-fetch band list to ensure up-to-date data
                // fetchBands();
            } else {
                setBandCreationError('Band creation failed');
            }


        } catch (error: any) {
            console.error('Band creation error:', error);
            setBandCreationError(error.message || 'Failed to create band.');
        }
    };


    const renderBandMembersPopup = () => {
        if (!isViewMembersModalOpen || !viewingBandMembers) return null;

        return (
            <div className="band-members-modal-overlay">
                <div className="band-members-modal">
                    <h3 className="band-members-modal-title">Band Members: {viewingBandMembers.bandName}</h3> {/* Use bandName from API response */}
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

    return (
        <div className="band-management-page-container">
            <h1 className="band-management-title">Band Management</h1>
            <div className="band-cards-grid">
                {bands.map(band => (
                    <div key={band._id} className="band-card"> {/* Use band._id as key */}
                        <h2 className="band-name">{band.bandName}</h2> {/* Use band.bandName */}
                        <div className="band-actions">
                            <button className="action-button edit" onClick={() => handleEditBand(band._id)}>Edit</button> {/* Use band._id */}
                            <button className="action-button delete" onClick={() => handleDeleteBand(band._id)}>Delete</button> {/* Use band._id */}
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