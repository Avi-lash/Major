// src/pages/LearningPage.jsx
import React, { useState, useEffect } from "react"; // Import useEffect
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBWu4NbRJRpUyJ8yF9iK5oTrQtte-S-aMc";
const genAI = new GoogleGenerativeAI(API_KEY);

function LearningPage() {
  const [videoId, setVideoId] = useState("sample-video-id"); // You can update this to change the video
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMessage, setErrorMessage] = useState("");
  const [answers, setAnswers] = useState([]);

  // State to hold the video title extracted from the H2 tag
  const [videoTitle, setVideoTitle] = useState("Sex"); 
  useEffect(() => {
     }, []); // Empty dependency array means this runs once on mount

  const startQuiz = async () => {
    setStatus("loading");
    setErrorMessage(""); // Clear any previous error messages

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Use the videoTitle state variable in the prompt
      const prompt = `Create 5 multiple-choice quiz questions about "${videoTitle}".
      Format: JSON
      Example: [{"question": "What is 2+2?", "options": ["1", "2", "3", "4"], "answer": "4"}]`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.candidates[0]?.content?.parts[0]?.text;

      // Clean the response by removing markdown code block fences
      const cleanedResponse = responseText.replace(/```json|```/g, "").trim();

      // Attempt to parse the JSON. Add a safety check if parsing fails.
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error("Error parsing JSON from API:", jsonError);
        console.log("Raw API response:", cleanedResponse); // Log raw response for debugging
        setErrorMessage("Failed to parse quiz questions. Invalid format from AI.");
        setStatus("start");
        return; // Exit if parsing fails
      }

      setQuestions(parsedQuestions);
      setScore(0);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswers([]);
      setShowScore(false);
      setStatus("ready");
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      setErrorMessage("Failed to fetch quiz questions. Please check your network or API key.");
      setStatus("start");
    }
  };

  const handleAnswerClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const current = questions[currentQuestion];
      const isCorrect = selectedOption === current.answer;

      setAnswers([
        ...answers,
        { question: current.question, selected: selectedOption, correct: current.answer },
      ]);

      if (isCorrect) setScore(score + 1);

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
      } else {
        setShowScore(true);
      }
    } else {
      alert("Please select an answer.");
    }
  };

  const videoStreamUrl = `http://localhost:8080/api/v1/videos/stream/${videoId}`;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar - Quiz Section */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Quiz Section</h1>
        {/* Display the video title for which the quiz is being generated */}
        <p className="mb-4 text-center text-gray-400">Quiz for: <span className="font-semibold text-white">{videoTitle}</span></p>

        {status === "start" && <button onClick={startQuiz} className="bg-blue-600 px-4 py-2 rounded">Start Quiz</button>}
        {status === "loading" && <p>Loading questions...</p>}
        {errorMessage && <p className="text-red-400">{errorMessage}</p>}

        {showScore ? (
          <div>
            <h2>Your Score: {score} / {questions.length}</h2>
            <ul className="mt-4 space-y-2">
              {answers.map((ans, index) => (
                <li key={index} className="text-sm border-b pb-2">
                  <p><strong>Q:</strong> {ans.question}</p>
                  <p><strong>Correct:</strong> {ans.correct}</p>
                  <p className={ans.selected === ans.correct ? "text-green-400" : "text-red-400"}>
                    Your Answer: {ans.selected}
                  </p>
                </li>
              ))}
            </ul>
            <button onClick={startQuiz} className="mt-4 bg-blue-600 px-4 py-2 rounded">Restart Quiz</button>
          </div>
        ) : (
          status === "ready" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">{questions[currentQuestion]?.question}</h2>
              <div className="space-y-2 mb-4">
                {questions[currentQuestion]?.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerClick(option)}
                    className={`block w-full text-left px-3 py-2 rounded border ${
                      selectedOption === option ? "bg-blue-700" : "bg-gray-800"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextQuestion}
                className="bg-green-600 px-4 py-2 rounded"
                disabled={selectedOption === null}
              >
                Next Question
              </button>
            </div>
          )
        )}
      </div>

      {/* Main Video Player Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* This H2 content is now the source for the quiz topic */}
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">{videoTitle}</h2>
        <div className="relative pt-[56.25%] mb-6 rounded-lg overflow-hidden border border-gray-700 shadow-md">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={videoStreamUrl}
            controls
            autoPlay
            loop
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default LearningPage;