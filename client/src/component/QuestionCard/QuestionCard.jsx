import React, { useState } from "react";
import "./questioncard.scss";
const QuestionCard = ({ card }) => {
  const [active, setActive] = useState(false);
  const ShowAnswer = () => {
    setActive(!active);
  };
  return (
    <div className="question-card">
      <div className="question" >
        <span onClick={ShowAnswer}>{card.question} </span>
        <i
          className={`bx bx-chevron-down ${active ? "show" : ""}`}
          onClick={ShowAnswer}
        ></i>
      </div>
      <div className={`answer ${active ? "active" : ""}`}>{card.answer}</div>
    </div>
  );
};

export default QuestionCard;
