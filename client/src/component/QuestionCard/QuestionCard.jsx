import React from "react";
import "./questioncard.scss";

const QuestionCard = ({ card, active, onToggle }) => {
  return (
    <div className="question-card">
      <div className="question">
        <span onClick={onToggle}>{card.question} </span>
        <i
          className={`bx bx-chevron-down ${active ? "show" : ""}`}
          onClick={onToggle}
        ></i>
      </div>
      <div className={`answer ${active ? "active" : ""}`}>{card.answer}</div>
    </div>
  );
};

export default QuestionCard;
