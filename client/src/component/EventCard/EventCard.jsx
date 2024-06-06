import React, { useState, useRef, useEffect } from "react";
import "./eventcard.scss";
import { GiLoveLetter } from "react-icons/gi";
import { Link } from "react-router-dom";
const EventCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      setBounds(cardRef.current.getBoundingClientRect());
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getTransformStyles = () => {
    if (!isHovered) return {};
    const leftX = mousePosition.x - bounds.x;
    const topY = mousePosition.y - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    return {
      transform: `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
        )
      `,
      backgroundImage: `
        radial-gradient(
          circle at
          ${center.x * 2 + bounds.width / 2}px
          ${center.y * 2 + bounds.height / 2}px,
          #ffffff55,
          #0000000f
        )
      `,
    };
  };

  useEffect(() => {
    if (isHovered && cardRef.current) {
      setBounds(cardRef.current.getBoundingClientRect());
    }
  }, [isHovered]);

  return (
    <div
      className="event-card"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={getTransformStyles()}
    >
      <div className="event-card-box">
        <Link to="/create-event" className="top">
          <div className="left">
            <div className="title">College</div>
            <div className="top-buttom">
              <div className="amount">50</div>
              <div className="buttom-text">Photos & Videos</div>
            </div>
          </div>
          <div className="right">
            <GiLoveLetter />
          </div>
        </Link>
        <div className="buttom">
          <div className="date">12 June, 2024</div>
          <div className="edit">
            <i
              className="bx bx-dots-vertical-rounded"
              onClick={() => console.log("Click on icon")}
            ></i>
          </div>
        </div>
      </div>
      <div className="glow" />
    </div>
  );
};

export default EventCard;
