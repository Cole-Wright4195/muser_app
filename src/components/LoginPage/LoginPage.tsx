"use client"

import { Julius_Sans_One } from 'next/font/google';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './LoginPage.css';

// Import the font with desired options
const julius = Julius_Sans_One({
  subsets: ['latin'],
  weight: '400', // default weight for Julius Sans One
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Submit handler for the login form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Collect form data using FormData API.
    const formData = new FormData(e.currentTarget);
    // We are using 'email' instead of 'username'
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        // If login is successful, the token is set as an HTTP-only cookie.
        // You may store additional session info in state or simply redirect.
        router.push('/eventspage');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`login-page ${julius.className}`}>
      <h1 className="title">MUSER</h1>
      <p className="subtitle">START YOUR GIG MANAGEMENT JOURNEY HERE</p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="label">Email</label>
        <input type="text" name="email" required className="input" />

        <label className="label">Password</label>
        <input type="password" name="password" required className="input" />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="footer">
        <p className="footer-text">
          DON'T HAVE A BAND? START <a href="#" className="footer-link">HERE</a>
        </p>
      </div>
    </section>
  );
}
