import "./about.scss";
import { Link } from "react-router-dom";

const features = [
  "Private event sharing",
  "Face-based photo discovery",
  "Simple host experience",
];

const About = () => {
  return (
    <section className="about-page">
      <div className="about-shell">
        <div className="about-hero">
          <div className="about-copy" data-aos="fade-up">
            <h1>
              A simple way to make event photo sharing feel <span>cleaner and more premium.</span>
            </h1>
            <p>
              Memois helps hosts collect memories in one place and helps guests
              find their own photos faster. The goal is not to feel like another
              social feed. It should feel private, smooth, and easy to use.
            </p>
            <div className="feature-row">
              {features.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="about-visual" data-aos="fade-left">
            <div className="visual-stage">
              <div className="visual-aura"></div>
              <div className="visual-orbit orbit-one"></div>
              <div className="visual-orbit orbit-two"></div>
              <div className="visual-card main-card">
                <div className="card-top">
                  <span className="status-dot"></span>
                  Product Principles
                </div>
                <div className="card-title">
                  Designed to feel private, calm, and premium instead of chaotic after the event ends.
                </div>
                <div className="card-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="visual-card floating-card top-card">
                <span>Calm interface</span>
              </div>
              <div className="visual-card floating-card bottom-card">
                <span>Host-first clarity</span>
              </div>
              <div className="visual-card floating-card side-card">
                <span>Private by design</span>
              </div>
              <div className="visual-pulse"></div>
            </div>
          </div>

          <div className="about-actions hero-actions">
            <Link
              to="/login"
              state={{ redirectToCreateEvent: true }}
              className="primary-action"
            >
              Create Event
            </Link>
            <Link to="/use-for" className="secondary-action">
              Explore Use Cases
            </Link>
          </div>
        </div>

        <div className="about-grid">
          <div className="info-card" data-aos="fade-up">
            <div className="card-label">What it solves</div>
            <h2>Event galleries usually feel messy after the event ends.</h2>
            <p>
              Photos get scattered across chats, drives, and random folders.
              Memois brings that experience back into one polished gallery so
              hosts can share with confidence and guests can browse without
              friction.
            </p>
          </div>

          <div className="info-card compact" data-aos="fade-up" data-aos-delay="80">
            <div className="card-label">What matters</div>
            <ul>
              <li>One event link instead of many albums</li>
              <li>Fast guest discovery through selfie search</li>
              <li>Images and videos in one calm interface</li>
            </ul>
          </div>
        </div>

        <div className="closing-banner" data-aos="fade-up">
          <p>
            Memois is designed for people who want the memory-sharing experience
            to feel as thoughtful as the event itself.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
