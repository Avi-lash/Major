import "./Quiz.css";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBWu4NbRJRpUyJ8yF9iK5oTrQtte-S-aMc"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

const startQuiz = async (topic, setQuestions, setStatus, setErrorMessage) => {
  setStatus("loading");

  try {
    // Updated model for Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Constructing the prompt
    const prompt = `
      Create 5 multiple-choice quiz questions about Spring.
      Format: JSON
      Example: [{"question": "What is 2+2?", "options": ["1", "2", "3", "4"], "answer": "4"}]
    `;

    // Sending request to Gemini 2.0 Flash
    const result = await model.generateContent(prompt);

    // Accessing the response text
    const responseText = result.response.candidates[0]?.content?.parts[0]?.text;

    // Log the raw response text to inspect it
    console.log("Raw Response Text:", responseText);

    // Clean the response to remove markdown (e.g., ` ```json `)
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();

    // Log the cleaned response text to see the format
    console.log("Cleaned Response Text:", cleanedResponse);

    // Parsing the cleaned response into JSON
    const parsedQuestions = JSON.parse(cleanedResponse);

    // Updating state with the quiz questions
    setQuestions(parsedQuestions);
    setStatus("ready");

  } catch (error) {
    // Log and handle the error
    console.error("Error fetching quiz questions:", error.response || error);
    setErrorMessage("Failed to fetch quiz questions.");
    setStatus("start");
  }
};


function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMessage, setErrorMessage] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleStartQuiz = () => {
    startQuiz("General Knowledge", setQuestions, setStatus, setErrorMessage);
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setAnswers([]);
  };

  const handleAnswerClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const isCorrect = selectedOption === questions[currentQuestion]?.answer;
      setAnswers([...answers, { question: questions[currentQuestion]?.question, selected: selectedOption, correct: questions[currentQuestion]?.answer }]);
      if (isCorrect) {
        setScore(score + 1);
      }
      setSelectedOption(null);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    } else {
      alert("Please select an answer.");
    }
  };

  return (
    <div className="quiz-container">
      {status === "start" && <button onClick={handleStartQuiz}>Start Quiz</button>}
      {status === "loading" && <h2>Loading questions...</h2>}
      {errorMessage && <h2>Error: {errorMessage}</h2>}
      {showScore ? (
        <div>
          <h2>Your Score: {score} / {questions.length}</h2>
          <ul className="answer-key">
            {answers.map((answer, index) => (
              <li key={index}>
                <p><strong>Correct Answer:</strong> {answer.correct}</p>
                {answer.selected === answer.correct ? (
                  <span className="correct">Correct</span>
                ) : (
                  <span className="incorrect">Incorrect</span>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleStartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        status === "ready" && (
          <div>
            <h2>{questions[currentQuestion]?.question}</h2>
            <div className="options">
              {questions[currentQuestion]?.options.map((option) => (
                <button
                  key={option}
                  className={selectedOption === option ? "selected" : ""}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
            >
              Next Question
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Quiz;