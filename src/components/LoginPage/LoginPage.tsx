"use client"

import { Julius_Sans_One } from 'next/font/google';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './LoginPage.css';

const julius = Julius_Sans_One({
  subsets: ['latin'],
  weight: '400', 
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

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
        try {
          const res = await fetch('/api/auth/session');
          const data = await res.json();
          const person = await fetch(`/api/users/${data.userId}`);
          const personData = await person.json();
          console.log(personData);
          if (personData.user.band === undefined) {
            router.push('/joinband');
          } else {
            router.push('/eventspage');
          }
        } catch (error) {
          console.error('Error fetching session:', error);
        }
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
