import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="badge">
              AI-Powered Online Learning
            </span>

            <h1>
              Learn Together.
              <br />
              <span>Hear Every Word.</span>
            </h1>

            <p>
              Join online classes with AI-powered background
              noise reduction and clearer voice communication.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-button">
                Get Started
              </Link>

              <Link to="/login" className="secondary-button">
                Join Your Class
              </Link>
            </div>

            <div className="hero-status">
              <span className="status-dot"></span>
              Designed for smarter online classes
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-header">
              <span>● Live Classroom</span>
              <span>AI Audio</span>
            </div>

            <div className="preview-video">
              <div className="avatar">👨‍🏫</div>
              <h3>Computer Engineering</h3>
              <p>Online Learning Session</p>
            </div>

            <div className="audio-panel">
              <div>
                <strong>Noise Cancellation</strong>
                <p>Background noise filtering</p>
              </div>

              <span className="active-label">READY</span>
            </div>

            <div className="audio-panel">
              <div>
                <strong>Voice Enhancement</strong>
                <p>Speech clarity processing</p>
              </div>

              <span className="active-label">READY</span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <span className="badge">KEY FEATURES</span>
            <h2>Everything for a better classroom</h2>
            <p>
              Communication tools combined with intelligent
              audio enhancement.
            </p>
          </div>

          <div className="feature-grid">
            <FeatureCard
              icon="🎙️"
              title="AI Noise Filtering"
              description="Reduce unwanted background noise during online classes."
            />

            <FeatureCard
              icon="🔊"
              title="Voice Clarity"
              description="Enhance speech so participants can hear more clearly."
            />

            <FeatureCard
              icon="📹"
              title="Video Meetings"
              description="Meet your teacher and classmates in a virtual classroom."
            />

            <FeatureCard
              icon="💬"
              title="Live Chat"
              description="Communicate with other participants during class."
            />
          </div>
        </section>
      </main>

      <footer>
        <p>
          © 2026 AI Classroom | Final Year Project
        </p>
      </footer>
    </>
  );
}

export default Home;