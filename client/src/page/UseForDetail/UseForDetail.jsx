import "./usefordetail.scss";
import { Link, useParams } from "react-router-dom";
import useforData from "../../data/usefor-data";

const UseForDetail = () => {
  const { slug } = useParams();
  const item = useforData.find((entry) => entry.slug === `/use-for/${slug}`);

  if (!item) {
    return (
      <section className="use-for-detail">
        <div className="detail-shell not-found">
          <h1>Use case not found.</h1>
          <p>The page you tried to open does not exist.</p>
          <Link to="/use-for" className="back-link">
            Back to Use Cases
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="use-for-detail">
      <div className="detail-shell">
        <div className="detail-hero">
          <div className="detail-copy" data-aos="fade-up">
            <div className="breadcrumb">
              <Link to="/use-for">Use Cases</Link>
              <span>&gt;</span>
              <span>{item.title}</span>
            </div>
            <h1>{item.content.title}</h1>
            <p>{item.content.description}</p>
            <div className="detail-actions">
              <Link to="/login" state={{ redirectToCreateEvent: true }}>
                Create Event
              </Link>
              <Link to="/use-for" className="secondary-action">
                Back to Use Cases
              </Link>
            </div>
          </div>

          <div className="detail-visual" data-aos="fade-left">
            <div className="visual-stage">
              <div className="visual-orbit orbit-one"></div>
              <div className="visual-orbit orbit-two"></div>
              <div className="visual-card main-card">
                <div className="card-top">
                  <span className="dot"></span>
                  {item.title}
                </div>
                <div className="card-title">{item.description}</div>
                <div className="card-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="visual-card floating-card top-card">
                <span>{item.title}</span>
              </div>
              <div className="visual-card floating-card bottom-card">
                <span>Private sharing</span>
              </div>
              <div className="visual-card floating-card side-card">
                <span>Guest discovery</span>
              </div>
              <div className="visual-pulse"></div>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card" data-aos="fade-up">
            <div className="card-label">Why it fits</div>
            <ul>
              {item.content.points?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="detail-card" data-aos="fade-up" data-aos-delay="80">
            <div className="card-label">Outcome</div>
            <p>{item.content.outcome}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseForDetail;
