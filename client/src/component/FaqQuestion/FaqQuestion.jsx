import React from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
const FaqQuestion = ({ item }) => {
  return (
    <div className="faq-question" data-aos="fade-up"
    data-aos-anchor-placement="top-bottom">
      {item.map((card) => {
        return <QuestionCard card={card} key={card.id}/>;
      })}
    </div>
  );
};

export default FaqQuestion;
