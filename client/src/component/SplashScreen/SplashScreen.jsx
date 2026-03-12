import "./splashscreen.scss";
import Logo from "../../assets/logo.png";

const SplashScreen = ({ visible }) => {
  return (
    <div className={`splash-screen ${visible ? "is-visible" : "is-hidden"}`}>
      <div className="splash-backdrop"></div>
      <div className="splash-orb orb-one"></div>
      <div className="splash-orb orb-two"></div>
      <div className="splash-content">
        <div className="wordmark-frame">
          <div className="wordmark-glow"></div>
          <div className="splash-wordmark">
            <span className="word-start">mem</span>
            <span className="word-end">ois</span>
          </div>
        </div>
        <div className="splash-brandline">
          <img src={Logo} alt="Memois" className="splash-logo" />
          <div className="splash-tagline">Event memories, revealed.</div>
        </div>
        <div className="splash-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
