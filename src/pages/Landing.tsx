import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import Footer from '../components/Footer';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { setIsGuest, darkMode, toggleDarkMode } = useApp();

  const handleGetStarted = (mode: 'signin' | 'signup' | 'guest') => {
    if (mode === 'guest') {
      localStorage.setItem('isGuest', 'true');
      setIsGuest(true);
      navigate('/dashboard');
    } else {
      navigate('/auth', { state: { initialTab: mode === 'signup' ? 'signup' : 'login' } });
    }
  };

  return (
    <div className="page-wrapper">
    <div className="landing-container">
      <button className="landing-theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
            <path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z" />
          </svg>
        )}
      </button>

      <div className="landing-bg-gradient"></div>
      
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className={`landing-content visible`}>
        <div className="landing-hero">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Finance Tracker</span>
          </h1>
          <p className="hero-subtitle">
            Take control of your finances with ease. Track expenses, monitor income, and gain insights into your spending habits.
          </p>
        </div>

        <div className="landing-cards">
          <div className="landing-card income" onClick={() => handleGetStarted('signin')}>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h3>Sign In</h3>
            <p>Already have an account? Welcome back to manage your finances!</p>
          </div>

          <div className="landing-card balance" onClick={() => handleGetStarted('signup')}>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-9-2V9H4V7h2V5h2v2h2v2H8v2H6z" />
              </svg>
            </div>
            <h3>Create Account</h3>
            <p>New here? Start tracking your finances and get instant insights!</p>
          </div>

          <div className="landing-card expenses" onClick={() => handleGetStarted('guest')}>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.89 1.97 1.92 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h3>Continue as Guest</h3>
            <p>Just browsing? Explore the app without creating an account!</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}
