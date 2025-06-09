import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBWu4NbRJRpUyJ8yF9iK5oTrQtte-S-aMc";
const genAI = new GoogleGenerativeAI(API_KEY);

function LearningPage() {
  const { courseId } = useParams();
  const [videoId, setVideoId] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");

  const [assignmentUrl, setAssignmentUrl] = useState(null);
  const [loadingAssignment, setLoadingAssignment] = useState(false);
  const [error, setError] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMessage, setErrorMessage] = useState("");
  const [answers, setAnswers] = useState([]);

  // Fetch videoId and videoTitle based on courseId
  useEffect(() => {
    if (!courseId) return;

    const fetchVideoByCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/video`);
        const { videoId: fetchedVideoId, title } = response.data;

        setVideoId(fetchedVideoId);
        setVideoTitle(title || "");
      } catch (error) {
        console.error("Failed to fetch video for course", error);
        setVideoId(null);
        setVideoTitle("");
        setError("Failed to load video info.");
      }
    };

    fetchVideoByCourse();
  }, [courseId]);

  // Fetch assignment and metadata when videoId changes
  useEffect(() => {
    if (!videoId) return;

    const fetchAssignment = async () => {
      setLoadingAssignment(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/videos/${videoId}`);
        const { assignmentPath, title } = response.data;

        if (title) setVideoTitle(title);
        if (assignmentPath) {
          setAssignmentUrl(`http://localhost:8080/api/v1/videos/download-assignment/${videoId}`);
        } else {
          setAssignmentUrl(null);
        }
      } catch (err) {
        setError("Failed to load assignment info.");
        setAssignmentUrl(null);
      } finally {
        setLoadingAssignment(false);
      }
    };

    fetchAssignment();
  }, [videoId]);

  const videoStreamUrl = videoId ? `http://localhost:8080/api/v1/videos/stream/${videoId}` : "";

  const handleDownload = async () => {
    try {
      const response = await axios.get(assignmentUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "assignment.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download assignment.");
    }
  };

  const startQuiz = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Create 5 multiple-choice quiz questions about "${videoTitle}". Format: JSON. Example: [{"question": "What is 2+2?", "options": ["1", "2", "3", "4"], "answer": "4"}]`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.candidates[0]?.content?.parts[0]?.text;
      const cleanedResponse = responseText.replace(/```json|```/g, "").trim();

      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        setErrorMessage("Invalid format received from AI.");
        setStatus("start");
        return;
      }

      setQuestions(parsedQuestions);
      setScore(0);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswers([]);
      setShowScore(false);
      setStatus("ready");
    } catch (error) {
      console.error("Quiz generation error:", error);
      setErrorMessage("Failed to fetch quiz. Check network or API key.");
      setStatus("start");
    }
  };

  const handleAnswerClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return alert("Please select an answer.");

    const current = questions[currentQuestion];
    const isCorrect = selectedOption === current.answer;

    setAnswers([
      ...answers,
      { question: current.question, selected: selectedOption, correct: current.answer },
    ]);

    if (isCorrect) setScore(score + 1);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">ASSIGNMENT AND QUIZ</h1>
        <p className="mb-2 text-center text-gray-400">
          Resources for: <span className="font-semibold text-white">{videoTitle || "Loading..."}</span>
        </p>

        {/* Assignment Section */}
        <div className="mb-6">
          {loadingAssignment ? (
            <p>Loading assignment info...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : assignmentUrl ? (
            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            >
              Download Assignment
            </button>
          ) : (
            <p className="text-sm text-gray-400">No assignment available.</p>
          )}
        </div>

        {/* Quiz Section */}
        <div className="border-t border-gray-700 pt-4">
          <h2 className="text-xl font-bold mb-2 text-center">Quiz Section</h2>

          {status === "start" && (
            <button onClick={startQuiz} className="w-full bg-green-600 px-4 py-2 rounded mb-2" disabled={!videoTitle}>
              Start Quiz
            </button>
          )}
          {status === "loading" && <p>Loading questions...</p>}
          {errorMessage && <p className="text-red-400">{errorMessage}</p>}

          {showScore ? (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-center">
                Your Score: {score} / {questions.length}
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {answers.map((ans, index) => (
                  <li key={index} className="border-b pb-2">
                    <p><strong>Q:</strong> {ans.question}</p>
                    <p><strong>Correct:</strong> {ans.correct}</p>
                    <p className={ans.selected === ans.correct ? "text-green-400" : "text-red-400"}>
                      Your Answer: {ans.selected}
                    </p>
                  </li>
                ))}
              </ul>
              <button onClick={startQuiz} className="mt-4 w-full bg-blue-600 px-4 py-2 rounded">
                Restart Quiz
              </button>
            </div>
          ) : (
            status === "ready" && (
              <div>
                <h3 className="text-base font-medium mb-2">{questions[currentQuestion]?.question}</h3>
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
                  className="w-full bg-green-600 px-4 py-2 rounded"
                  disabled={selectedOption === null}
                >
                  Next Question
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Video Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-center">{videoTitle || "Loading Video..."}</h2>
        <div className="flex justify-center items-center w-full">
          {videoStreamUrl ? (
            <video
              className="w-full max-w-4xl h-auto rounded-lg border border-gray-700 shadow-md"
              src={videoStreamUrl}
              controls
              autoPlay
              loop
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-center text-gray-400">Loading video...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningPage;
