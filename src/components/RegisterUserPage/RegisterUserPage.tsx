"use client";
import React, { useState } from 'react';
import { Julius_Sans_One } from 'next/font/google';
import './RegisterUserPage.css';
import { useRouter } from 'next/navigation';

const julius = Julius_Sans_One({
    subsets: ['latin'],
    weight: '400',
});

const roleOptions = [
    "Vocals",
    "Guitar",
    "Bass",
    "Keyboard",
    "Drums",
    "Stage Director",
    "Electronics",
    "Makeup",
    "Dress"
];

interface RegistrationError {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    primaryInstrument?: string;
    backupInstrument?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}


const RegistrationPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [primaryInstrument, setPrimaryInstrument] = useState('');
    const [backupInstrument, setBackupInstrument] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<RegistrationError>({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const router = useRouter();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({}); 

        let validationErrors: RegistrationError = {};

        if (!firstName.trim()) validationErrors.firstName = "First name is required";
        if (!lastName.trim()) validationErrors.lastName = "Last name is required";
        if (!phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required";
        if (!email.trim()) validationErrors.email = "Email is required";
        if (!primaryInstrument.trim()) validationErrors.primaryInstrument = "Primary role is required";
        if (!password.trim()) validationErrors.password = "Password is required";
        if (!confirmPassword.trim()) validationErrors.confirmPassword = "Confirm password is required";
        if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    phoneNumber,
                    primaryInstrument,
                    backupInstrument,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Registration failed: ${response.status}`);
            }

            setRegistrationSuccess(true);

        } catch (error: any) {
            console.error('Registration error:', error);
            setErrors({ general: error.message || 'Registration failed' });
            setRegistrationSuccess(false);
        }
    };

    if (registrationSuccess) {
        return (
            <section className={`login-page ${julius.className}`}>
                <h1 className="title">Registration Successful!</h1>
                <p className="success-message">
                    Thank you for registering with MUSER!
                </p>
                <p className="footer-text">
                    <a href="/login" className="footer-link">
                        LOGIN NOW
                    </a>
                </p>
            </section>
        );
    }


    return (
        <section className={`login-page ${julius.className}`}>
            <h1 className="title">MUSER Registration</h1>
            <p className="subtitle">START YOUR GIG MANAGEMENT JOURNEY HERE</p>

            {errors.general && <p className="error-general">{errors.general}</p>}

            <form className="form" onSubmit={handleSubmit}>
                <label className="label">First Name</label>
                <input
                    type="text"
                    className={`input ${errors.firstName ? 'input-error' : ''}`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <p className="error">{errors.firstName}</p>}

                <label className="label">Last Name</label>
                <input
                    type="text"
                    className={`input ${errors.lastName ? 'input-error' : ''}`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}

                <label className="label">Phone Number</label>
                <input
                    type="tel"
                    className={`input ${errors.phoneNumber ? 'input-error' : ''}`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

                <label className="label">Email</label>
                <input
                    type="email"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <label className="label">Primary Role</label>
                <select
                    className={`input ${errors.primaryInstrument ? 'input-error' : ''}`}
                    value={primaryInstrument}
                    onChange={(e) => setPrimaryInstrument(e.target.value)}
                >
                    <option value="">Select Role</option>
                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                {errors.primaryInstrument && <p className="error">{errors.primaryInstrument}</p>}

                <label className="label">Secondary Role</label>
                <select
                    className="input"
                    value={backupInstrument}
                    onChange={(e) => setBackupInstrument(e.target.value)}
                >
                    <option value="">Select Role (optional)</option>
                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                </select>

                <label className="label">Password</label>
                <input
                    type="password"
                    className={`input ${errors.password ? 'input-error' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}

                <label className="label">Confirm Password</label>
                <input
                    type="password"
                    className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                <button type="submit" className="submit-btn">
                    REGISTER
                </button>
            </form>

            <div className="footer">
                <p className="footer-text">
                    ALREADY HAVE AN ACCOUNT?{' '}
                    <a href="/login" className="footer-link">
                        LOGIN
                    </a>
                </p>
            </div>
        </section>
    );
};

export default RegistrationPage;