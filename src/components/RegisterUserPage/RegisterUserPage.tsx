import { Julius_Sans_One } from 'next/font/google';
import './RegisterUserPage.css'; // or './RegistrationPage.css' if you want a separate file

// Import the font with desired options
const julius = Julius_Sans_One({
  subsets: ['latin'],
  weight: '400',
});

export default function RegistrationPage() {
  return (
    <section className={`login-page ${julius.className}`}>
      <h1 className="title">MUSER Registration</h1>
      <p className="subtitle">START YOUR GIG MANAGEMENT JOURNEY HERE</p>

      <form className="form">
        <label className="label">First Name</label>
        <input type="text" required className="input" />

        <label className="label">Last Name</label>
        <input type="text" required className="input" />

        <label className="label">Phone Number</label>
        <input type="tel" required className="input" />

        <label className="label">Email</label>
        <input type="email" required className="input" />

        <label className="label">Primary Role</label>
        <select className="input" required>
          <option value="">Select Role</option>
          <option value="Vocals">Vocals</option>
          <option value="Guitar">Guitar</option>
          <option value="Bass">Bass</option>
          <option value="Keyboard">Keyboard</option>
          <option value="Drums">Drums</option>
          <option value="Stage Director">Stage Director</option>
          <option value="Electronics">Electronics</option>
          <option value="Makeup">Makeup</option>
          <option value="Dress">Dress</option>
        </select>

        <label className="label">Secondary Role</label>
        <select className="input">
          <option value="">Select Role (optional)</option>
          <option value="Vocals">Vocals</option>
          <option value="Guitar">Guitar</option>
          <option value="Bass">Bass</option>
          <option value="Keyboard">Keyboard</option>
          <option value="Drums">Drums</option>
          <option value="Stage Director">Stage Director</option>
          <option value="Electronics">Electronics</option>
          <option value="Makeup">Makeup</option>
          <option value="Dress">Dress</option>
        </select>

        <label className="label">Password</label>
        <input type="password" required className="input" />

        <label className="label">Confirm Password</label>
        <input type="password" required className="input" />

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
}
