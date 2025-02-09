import { Julius_Sans_One } from 'next/font/google';
import './LoginPage.css';

const julius = Julius_Sans_One({
  subsets: ['latin'],
  weight: '400', 
});

export default function LoginPage() {
  return (
    <section className={`login-page ${julius.className}`}>
      <h1 className="title">MUSER</h1>
      <p className="subtitle">START YOUR GIG MANAGEMENT JOURNEY HERE</p>

      <form className="form">
        <label className="label">Username</label>
        <input type="text" required className="input" />

        <label className="label">Password</label>
        <input type="password" required className="input" />

        <button type="submit" className="submit-btn">
          LOGIN
        </button>
      </form>

      <div className="footer">
        <p className="footer-text">
          DON'T HAVE A BAND? START <a href="#" className="footer-link">HERE</a>
        </p>
      </div>
    </section>
  );
}
