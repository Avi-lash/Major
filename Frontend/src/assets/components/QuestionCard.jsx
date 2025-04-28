import React from "react";

const QuestionCard = ({ question, options, onSelect }) => {
  return (
    <div className="question-card">
      <h2>{question}</h2>
      <div className="options">
        {options.map((option, index) => (
          <button key={index} onClick={() => onSelect(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
