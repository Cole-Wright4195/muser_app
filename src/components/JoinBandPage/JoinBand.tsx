"use client";
import React, { useState, useEffect } from 'react';
import './JoinBand.css';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

const JoinBand: React.FC = () => {
    const [bandCode, setBandCode] = useState('');
    const [joinError, setJoinError] = useState<string | null>(null);
    const [joinSuccess, setJoinSuccess] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchSession() {
          try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            if (data.success && data.userId) {
              setUserId(data.userId);
            } else {
              console.error('Session retrieval failed:', data.message);
            }
          } catch (error) {
            console.error('Error fetching session:', error);
          }
        }
        fetchSession();
      }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setJoinError(null);
        setJoinSuccess(false);

        if (!bandCode.trim()) {
            setJoinError("Please enter a band code.");
            return;
        }

        if (!userId) {
            setJoinError("User ID not found. Please ensure you are logged in.");
            return;
        }

        try {
            const response = await fetch('/api/bands/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    bandCode: bandCode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to join band: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setJoinSuccess(true);
                alert(`Successfully joined band! Band Code: ${bandCode}`);
                router.push('/bandmanagement');

            } else {
                setJoinError(data.message || 'Failed to join band.');
            }

        } catch (error: any) {
            console.error('Join band error:', error);
            setJoinError(error.message || 'Failed to join band.');
            setJoinSuccess(false);
        }
    };

    if (joinSuccess) {
        return (
            <section className="join-band-page">
                <h1 className="title">Successfully Joined Band!</h1>
                <p className="subtitle">You are now a member of the band.</p>
                <p>
                    <a href="/band-management" className="footer-link">
                        Go to Band Management
                    </a>
                </p>
            </section>
        );
    }


    return (
        <section className="join-band-page">
            <h1 className="title">Join a Band</h1>
            <p className="subtitle">ENTER THE CODE PROVIDED BY YOUR BAND LEADER</p>

            <div className="join-band-card">
                <h3 className="join-band-card-title">Enter Band Code</h3>
                {joinError && <p className="error-message">{joinError}</p>}
                <form className="join-band-form" onSubmit={handleSubmit}>
                    <label className="join-band-form label">Band Code</label>
                    <input
                        type="text"
                        required
                        className="join-band-form input"
                        value={bandCode}
                        onChange={(e) => setBandCode(e.target.value)}
                        placeholder="Enter band code here"
                    />

                    <div className="join-band-form-actions">
                        <button type="submit" className="join-band-button join-band-button-primary">
                            JOIN BAND
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default JoinBand;