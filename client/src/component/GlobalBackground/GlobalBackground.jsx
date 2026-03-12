import "./globalbackground.scss";

const GlobalBackground = () => {
  return (
    <div className="global-background" aria-hidden="true">
      <div className="background-gradient"></div>
      <div className="background-grid"></div>
      <span className="bubble bubble-one"></span>
      <span className="bubble bubble-two"></span>
      <span className="bubble bubble-three"></span>
      <span className="bubble bubble-four"></span>
      <span className="bubble bubble-five"></span>
    </div>
  );
};

export default GlobalBackground;
