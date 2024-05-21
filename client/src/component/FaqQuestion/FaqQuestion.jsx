import React from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
const FaqQuestion = ({ item }) => {
  return (
    <div className="faq-question">
      {item.map((card) => {
        return <QuestionCard card={card} key={card.id}/>;
      })}
    </div>
  );
};

export default FaqQuestion;
