import "./home.scss";
import { Link } from "react-router-dom";
import UseFor from "../UseFor/UseFor";
import HowWork from "../HowWork/HowWork";
import Faq from "../Faq/Faq";
import Testimonial from "../Testimonial/Testimonial";

const Home = () => {
  return (
    <>
      <section className="home-section">
        <div className="grid-glow"></div>
        <div className="home">
          <div className="hero-top-row">
            <div className="home-text-content">
              <div
                className="heading"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
              >
                Event memories should feel <span>beautiful, private, and effortless</span> to share.
              </div>
              <div
                className="sub-heading-text"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
              >
                Memois helps guests discover their photos through a quick selfie
                while hosts manage one elegant gallery instead of a messy chain of links.
              </div>
              <div
                className="facility-button"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
              >
                <button>Privacy first</button>
                <button>Face Recognition</button>
                <button>Premium sharing</button>
              </div>
            </div>

            <div className="image-content" data-aos="fade-left">
              <div className="hero-visual">
                <div className="visual-orbit orbit-one"></div>
                <div className="visual-orbit orbit-two"></div>
                <div className="visual-card main-card">
                  <div className="card-top">
                    <span className="dot"></span>
                    Guest Discovery
                  </div>
                  <div className="card-title">
                    Guests use one selfie to discover the right moments inside a private gallery.
                  </div>
                  <div className="card-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="visual-card floating-card top-card">
                  <span>Private gallery</span>
                </div>
                <div className="visual-card floating-card bottom-card">
                  <span>Selfie-based search</span>
                </div>
                <div className="visual-card floating-card side-card">
                  <span>Instant guest access</span>
                </div>
                <div className="visual-pulse"></div>
              </div>
            </div>
          </div>

          <div className="hero-bottom-row">
            <div className="home-create-event">
              <Link
                to="/login"
                state={{ redirectToCreateEvent: true }}
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
              >
                Create Event
              </Link>
              <Link to="/about" className="secondary-action">
                Know More
              </Link>
            </div>

            <div className="trust-row" data-aos="fade-up">
              <div className="trust-item">
                <strong>Fast guest discovery</strong>
                <span>Selfie-based search in seconds</span>
              </div>
              <div className="trust-item">
                <strong>Host-ready sharing</strong>
                <span>Cleaner delivery for guests, teams, and organizers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UseFor compact />
      <HowWork />
      <Faq />
      <Testimonial />
    </>
  );
};

export default Home;
