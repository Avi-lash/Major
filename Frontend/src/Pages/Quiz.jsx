import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBWu4NbRJRpUyJ8yF9iK5oTrQtte-S-aMc"; // Ensure your actual API key is here
const genAI = new GoogleGenerativeAI(API_KEY);

function LearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation hook

  // Retrieve studentId from location.state
  const studentId = location.state?.studentId;

  const [videoId, setVideoId] = useState(null);
  const [videoTitle, setVideoTitle] = useState("Loading Video...");
  const [videoDescription, setVideoDescription] = useState("");

  const [assignmentUrl, setAssignmentUrl] = useState(null);
  const [loadingAssignment, setLoadingAssignment] = useState(false);
  const [error, setError] = useState(""); // General error for video/assignment loading

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [status, setStatus] = useState("start"); // "start", "loading", "ready" for quiz
  const [errorMessage, setErrorMessage] = useState(""); // Error specifically for quiz generation
  const [answers, setAnswers] = useState([]);

  // --- Fetch videoId, videoTitle, AND videoDescription based on courseId ---
  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }

    const fetchVideoByCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/video`);
        const { videoId: fetchedVideoId, title, description } = response.data;

        setVideoId(fetchedVideoId);
        setVideoTitle(title || "Untitled Video");
        setVideoDescription(description || "");
      } catch (error) {
        console.error("Failed to fetch video for course", error);
        setVideoId(null);
        setVideoTitle("Video Not Found");
        setVideoDescription("");
        setError("Failed to load video info for this course.");
      }
    };

    fetchVideoByCourse();
  }, [courseId]);

  // --- Fetch assignment URL and ensure videoTitle/description are updated from /videos/{videoId} endpoint ---
  useEffect(() => {
    if (!videoId) return;

    const fetchAssignmentAndMetadata = async () => {
      setLoadingAssignment(true);
      // Don't clear main 'error' here, as it might be from initial video fetch
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/videos/${videoId}`);
        const { assignmentPath, title, description } = response.data;

        // Update videoTitle and videoDescription from this response as well for robustness
        if (title) setVideoTitle(title);
        if (description) setVideoDescription(description);

        if (assignmentPath) {
          setAssignmentUrl(`http://localhost:8080/api/v1/videos/download-assignment/${videoId}`);
        } else {
          setAssignmentUrl(null);
        }
      } catch (err) {
        // Specific error for assignment/full metadata
        setError("Failed to load assignment or full video info.");
        setAssignmentUrl(null);
      } finally {
        setLoadingAssignment(false);
      }
    };

    fetchAssignmentAndMetadata();
  }, [videoId]);

  // Memoized video stream URL for efficiency
  const videoStreamUrl = videoId ? `http://localhost:8080/api/v1/videos/stream/${videoId}` : "";

  // Handle assignment download
  const handleDownload = async () => {
    if (!assignmentUrl) {
      alert("No assignment available for download.");
      return;
    }
    try {
      const response = await axios.get(assignmentUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${videoTitle.replace(/[^a-z0-9]/gi, '_')}_assignment.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download assignment.");
      console.error("Download error:", err);
    }
  };

  // --- NEW: Handle navigation to Certificate page ---
  const handleViewCertificate = () => {
    if (!studentId || !courseId) {
      setErrorMessage("Cannot view certificate: student ID or course ID is missing.");
      return;
    }
    navigate('/certificate', {
      state: {
        studentId: studentId,
        courseId: courseId
      }
    });
  };

  // --- Quiz Generation Logic ---
  const startQuiz = async () => {
    setStatus("loading");
    setErrorMessage("");

    if (!videoDescription || videoDescription.trim() === "") {
      setErrorMessage("Video description is not available to generate a quiz. Please ensure the video has a description.");
      setStatus("start");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Create 10 multiple-choice quiz questions based on the following video description:
      "${videoDescription}"
      Ensure the questions are directly relevant to the content described.
      Format the output as a JSON array of objects. Each object must have "question" (string), "options" (array of strings, with at least 2 options), and "answer" (string, which must be one of the options). Example: [{"question": "What is 2+2?", "options": ["1", "2", "3", "4"], "answer": "4"}]`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.candidates[0]?.content?.parts[0]?.text;
      const cleanedResponse = responseText.replace(/```json|```/g, "").trim();

      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        setErrorMessage("Invalid format received from AI. Please try again. AI response: " + cleanedResponse);
        setStatus("start");
        return;
      }

      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        setErrorMessage("AI returned an empty or malformed quiz. Please try again.");
        setStatus("start");
        return;
      }
      const isValidQuiz = parsedQuestions.every(q =>
        typeof q.question === 'string' && q.question.trim().length > 0 &&
        Array.isArray(q.options) && q.options.length >= 2 &&
        q.options.every(opt => typeof opt === 'string' && opt.trim().length > 0) &&
        typeof q.answer === 'string' && q.answer.trim().length > 0 &&
        q.options.includes(q.answer)
      );

      if (!isValidQuiz) {
        console.error("Quiz structure validation failed:", parsedQuestions);
        setErrorMessage("AI returned a quiz with invalid question structure or missing details. Please try again.");
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
      if (error.response && error.response.status === 403) {
        setErrorMessage("Failed to fetch quiz. Check your Google Generative AI API key or its permissions.");
      } else {
        setErrorMessage("Failed to fetch quiz. Check network connection or API service availability.");
      }
      setStatus("start");
    }
  };

  // Handle user answer selection
  const handleAnswerClick = (option) => {
    setSelectedOption(option);
  };

  // Handle moving to the next question or showing score
  const handleNextQuestion = () => {
    if (!selectedOption) {
      alert("Please select an answer before proceeding.");
      return;
    }

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
      {/* Sidebar - Assignment and Quiz */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">ASSIGNMENT AND QUIZ</h1>
        <p className="mb-2 text-center text-gray-400">
          Resources for: <span className="font-semibold text-white">{videoTitle || "Loading..."}</span>
        </p>

        {/* Assignment Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-center">Assignment</h2>
          {loadingAssignment ? (
            <p>Loading assignment info...</p>
          ) : error && error.includes("assignment") ? (
            <p className="text-red-500">{error}</p>
          ) : assignmentUrl ? (
            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            >
              Download Assignment
            </button>
          ) : (
            <p className="text-sm text-gray-400">No assignment available for this video.</p>
          )}
        </div>

        {/* Quiz Section */}
        <div className="border-t border-gray-700 pt-4">
          <h2 className="text-xl font-bold mb-2 text-center">Quiz Section</h2>

          {status === "start" && (
            <button
              onClick={startQuiz}
              className="w-full bg-green-600 px-4 py-2 rounded mb-2"
              disabled={!videoDescription || videoDescription.trim() === "" || status === "loading"}
              title={(!videoDescription || videoDescription.trim() === "") ? "Video description is required to generate quiz" : ""}
            >
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

              {/* NEW: VIEW CERTIFICATE BUTTON */}
              {/* This button appears after the quiz score is shown */}
               {score >= 7 && ( // <--- ADD THIS CONDITION HERE
                <button
                  onClick={handleViewCertificate}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
                  // Optional: Disable if studentId or courseId are missing, though handleViewCertificate checks this
                  disabled={!studentId || !courseId}
                  title={(!studentId || !courseId) ? "Student or Course ID missing for certificate" : ""}
                >
                  VIEW CERTIFICATE
                </button>
              )}
              {score < 7 && questions.length > 0 && ( // Optional: message if score is too low
                <p className="mt-4 text-center text-orange-400">
                  You need a score of 7 or more to view the certificate.
                </p>
              )}
            </div>
          ) : (
            status === "ready" && questions[currentQuestion] && (
              <div>
                <h3 className="text-base font-medium mb-2">{questions[currentQuestion].question}</h3>
                <div className="space-y-2 mb-4">
                  {questions[currentQuestion].options.map((option) => (
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
            <p className="text-center text-gray-400">{error || "Loading video..."}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningPage;