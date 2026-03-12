import "./comingsoon.scss";

const ComingSoon = ({ title, description }) => {
  return (
    <section className="coming-soon">
      <div className="coming-soon-card">
        <div className="coming-soon-badge">Coming soon</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default ComingSoon;
