import React, { useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";

const FaqQuestion = ({ item }) => {
  const [openId, setOpenId] = useState(item[0]?.id ?? null);

  const toggleCard = (id) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <div className="faq-question" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      {item.map((card) => {
        return (
          <QuestionCard
            card={card}
            key={card.id}
            active={openId === card.id}
            onToggle={() => toggleCard(card.id)}
          />
        );
      })}
    </div>
  );
};

export default FaqQuestion;
