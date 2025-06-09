import React, { useState, useEffect } from "react";
import axios from "axios";

function LearningPage() {
  // Replace with a real video ID from your backend to avoid 404 errors
  const [videoId, setVideoId] = useState("4dde280c-fe80-4023-9892-be33d0c33d9e");
  const [assignmentUrl, setAssignmentUrl] = useState(null);
  const [loadingAssignment, setLoadingAssignment] = useState(false);
  const [error, setError] = useState("");

  const videoStreamUrl = `http://localhost:8080/api/v1/videos/stream/${videoId}`;

  useEffect(() => {
    // Fetch assignment info when videoId changes
    const fetchAssignment = async () => {
      setLoadingAssignment(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/videos/${videoId}`);
        const assignmentPath = response.data.assignmentPath;

        if (assignmentPath) {
          // Construct full URL for assignment download endpoint
          setAssignmentUrl(`http://localhost:8080/api/v1/videos/download-assignment/${videoId}`);
        } else {
          setAssignmentUrl(null); // no assignment for this video
        }
      } catch (err) {
        setError("Failed to load assignment info.");
        setAssignmentUrl(null);
      }
      setLoadingAssignment(false);
    };

    if (videoId) fetchAssignment();
  }, [videoId]);

  // Handle assignment download
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

  return (
    <div className="flex min-h-screen bg-gray-900 text-white flex-col items-center p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Currently Playing Video</h2>
      
      <div className="relative w-full max-w-4xl pt-[56.25%] mb-6 rounded-lg overflow-hidden border border-gray-700 shadow-md">
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

      {loadingAssignment ? (
        <p>Loading assignment info...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : assignmentUrl ? (
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition"
        >
          Download Assignment
        </button>
      ) : (
        <p>No assignment available for this video.</p>
      )}
    </div>
  );
}

export default LearningPage;
