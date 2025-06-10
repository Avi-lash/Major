import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { useSearchParams, useNavigate } from 'react-router-dom';

const API_KEY = "AIzaSyBWu4NbRJRpUyJ8yF9iK5oTrQtte-S-aMc"; // Use your Gemini API key here
const genAI = new GoogleGenerativeAI(API_KEY);

function AssignmentGeneratorPage() {
  const [searchParams] = useSearchParams();
  const initialCourseIdFromUrl = searchParams.get('courseId');
 const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseIdFromUrl || "");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [generatedAssignment, setGeneratedAssignment] = useState("");
  const [status, setStatus] = useState("idle"); // "idle", "loading", "ready", "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [hasGeneratedInitially, setHasGeneratedInitially] = useState(false); // Flag to prevent re-generating on initial load

  // 1. Fetch all courses for the dropdown (still useful for manual selection)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setErrorMessage("Failed to load courses.");
      }
    };
    fetchCourses();
  }, []);

  // 2. Fetch description for the selected course (or initial course from URL)
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseDescription("");
      setCourseTitle("");
      setGeneratedAssignment("");
      setErrorMessage("");
      setStatus("idle");
      return;
    }

    const fetchCourseDetails = async () => {
      setStatus("loading"); // Set status to loading while fetching details
      setErrorMessage("");
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/courses/${selectedCourseId}`);
        setCourseTitle(response.data.name || "N/A");
        setCourseDescription(response.data.description || "No description available.");
        setStatus("idle"); // Reset status after fetching details
      } catch (error) {
        console.error("Error fetching course description:", error);
        setCourseDescription("Failed to load course description.");
        setCourseTitle("Error");
        setErrorMessage("Failed to load course details. Please try another course.");
        setStatus("error");
      }
    };
    fetchCourseDetails();
  }, [selectedCourseId]);

  // 3. Auto-generate assignment once course description is available and not already generated
  useEffect(() => {
    // Check if we have a description, if we are idle (not already loading/ready/error),
    // and if we haven't already generated for this initial load from URL AND the current selection matches the initial URL selection.
    // This last check ensures auto-generation only happens for the initially loaded course.
    if (courseDescription && status === "idle" && !hasGeneratedInitially && selectedCourseId === initialCourseIdFromUrl) {
      const timer = setTimeout(() => {
        handleGenerateAssignment();
        setHasGeneratedInitially(true); // Mark as generated for this initial load
      }, 100); // Small delay to allow UI to update

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [courseDescription, status, hasGeneratedInitially, selectedCourseId, initialCourseIdFromUrl]);


  // 4. Handle assignment generation with Gemini
  const handleGenerateAssignment = async () => {
    setStatus("loading");
    setErrorMessage("");
    setGeneratedAssignment(""); // Clear previous generation

    if (!selectedCourseId || !courseDescription || courseDescription.trim() === "") {
      setErrorMessage("Please select a course with a valid description to generate an assignment.");
      setStatus("error");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Generate a detailed assignment for a course with the following description: "${courseDescription}".
      The assignment should have questions and answers to pass a quiz based on the topic and so that they can be certified
       Format the entire output as **plain text only**, without any Markdown syntax (e.g., no asterisks for bolding, no hash symbols for headers, no dashes for bullet points). 
    Use clear, descriptive headings on their own lines (e.g., "ASSIGNMENT TITLE", "Learning Objectives:", "Instructions:") to structure the content. Use numbered lists (1., 2., 3.) instead of bullet points where appropriate.
    Ensure generous use of newlines to create clear paragraphs and sections for readability in a PDF document.
    
      Include:
      - A clear title for the assignment.
      - 15 questions from the topic that can be asked for certification exams
      - clean one word/sentence answers  
      - Assignment description (clear instructions and tasks).
      - Estimated time to complete.
      - a disclaimer at the end that the certificate of completion will only be generated after completing quiz on the page
      Format the output as plain text or Markdown for easy readability.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.candidates[0]?.content?.parts[0]?.text;

      if (responseText) {
        setGeneratedAssignment(responseText);
        setStatus("ready");
      } else {
        setErrorMessage("AI did not return any content. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Assignment generation error:", error);
      if (error.response && error.response.status === 403) {
        setErrorMessage("Failed to generate assignment. Check your Google Generative AI API key or its permissions.");
      } else {
        setErrorMessage("Failed to generate assignment. Check network connection or API service availability.");
      }
      setStatus("error");
    }
  };

  // 5. Handle PDF download using jsPDF - UPDATED FOR MULTI-PAGE
  const handleDownloadPdf = () => {
    if (!generatedAssignment) {
      alert("No assignment to download. Generate one first!");
      return;
      
    }

    const doc = new jsPDF();

    // Define page dimensions and margins (A4 in mm)
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15; // All side margin in mm
    const contentWidth = pageWidth - (2 * margin);

    let currentY = margin; // Start from top margin

    // Add Title to the first page
    doc.setFontSize(18);
    doc.text(`Assignment for: ${courseTitle}`, margin, currentY);
    currentY += 10; // Move Y down after the title

    doc.setFontSize(12);
    // Determine line height based on font size. A good heuristic is 1.2 * fontSize (in points).
    // jsPDF text method uses 'pt' (points) by default if no unit is specified in constructor.
    // However, if you add 'mm' in constructor like new jsPDF('p', 'mm', 'a4'), it's 'mm'.
    // Let's assume default units (points) for font size, and convert line height to mm.
    // A standard 12pt font is roughly 4.23mm. We'll use a slightly larger lineHeight for spacing.
    const fontSize = 12;
    const lineHeightPt = fontSize * 1.2; // 1.2 times font size for line spacing in points
    const lineHeightMm = lineHeightPt * 0.3528; // Convert points to mm (1pt = 0.3528mm)

    // Split the entire generated assignment text into lines that fit the content width
    const textLines = doc.splitTextToSize(generatedAssignment, contentWidth);

    // Iterate through lines and add them to PDF, adding new pages as needed
    textLines.forEach(line => {
        // Check if adding the current line would exceed the page height
        if (currentY + lineHeightMm > pageHeight - margin) {
            doc.addPage(); // Add a new blank page
            currentY = margin; // Reset Y position for the new page (top margin)
            // Optional: You can add repeated headers for continuation pages here if desired
            // doc.setFontSize(10);
            // doc.text(`Assignment for: ${courseTitle} (continued)`, margin, currentY);
            // currentY += 5;
            doc.setFontSize(12); // Reset font size to default content size
        }

        // Add the current line of text
        doc.text(line, margin, currentY);
        currentY += lineHeightMm; // Move Y down for the next line

        
    });

    doc.save(`${courseTitle.replace(/[^a-z0-9]/gi, '_')}_Assignment.pdf`); // Sanitize filename
    navigate(`/upload/courseId=${selectedCourseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Generate Course Assignment</h1>

      {/* Course Selection - RE-ADDED THIS BLOCK */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Select Course</h2>
        <div className="mb-4">
          <label htmlFor="course-select" className="block text-gray-400 text-sm font-bold mb-2">
            Choose a Course:
          </label>
          <select
            id="course-select"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setHasGeneratedInitially(false); // Reset this flag if user manually changes course
            }}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        {selectedCourseId && (
          <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900">
            <p className="font-semibold text-lg">{courseTitle}</p>
            <p className="text-gray-400 text-sm mt-2">{courseDescription}</p>
          </div>
        )}
      </div>

      {/* Assignment Generation and Display */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Assignment Generator</h2>

        <button
          onClick={handleGenerateAssignment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
          disabled={status === "loading" || !selectedCourseId || !courseDescription || courseDescription.trim() === ""}
          title={(!selectedCourseId || !courseDescription || courseDescription.trim() === "") ? "Select a course with a description to generate" : ""}
        >
          {status === "loading" ? "Generating Assignment..." : "Generate Assignment"}
        </button>

        {errorMessage && <p className="text-red-400 mt-4 text-center">{errorMessage}</p>}

        {status === "loading" && !errorMessage && (
          <p className="text-center text-gray-400 mt-4">Generating assignment, please wait...</p>
        )}

        {status === "ready" && (
          <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded">
            <h3 className="text-lg font-semibold mb-3">Generated Assignment:</h3>
            <div className="whitespace-pre-wrap text-gray-300">
              {generatedAssignment}
            </div>
            <button
              onClick={handleDownloadPdf}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
            >
              Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentGeneratorPage;