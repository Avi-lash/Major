// src/components/VideoUpload.jsx
import React, { useState } from "react";
import videoLogo from "../assets/video-posting.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function VideoUpload({ onUploadSuccess, courseId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [meta, setMeta] = useState({ title: "", description: "" });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function handlePdfChange(event) {
    setSelectedPdf(event.target.files[0]);
  }

  function formFieldChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  }

  function handleForm(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!selectedFile) {
      setMessage("Please select a video file to upload!");
      setIsError(true);
      return;
    }

    saveVideoToServer(selectedFile, selectedPdf, meta);
  }

  function resetForm() {
    setMeta({ title: "", description: "" });
    setSelectedFile(null);
    setSelectedPdf(null);
    setUploading(false);
    setProgress(0);
  }

  async function saveVideoToServer(video, pdf, videoMetaData) {
    setUploading(true);
    setMessage("Uploading file...");
    setIsError(false);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", video); // Main video file
formData.append("course_id", courseId);
      if (pdf) {
        formData.append("assignment", pdf); // Assignment PDF
      }

      const response = await axios.post("http://localhost:8080/api/v1/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      const uploadedVideoId = response.data.videoId;
      toast.success("File uploaded successfully!");
      setMessage(`Uploaded successfully! Video ID: ${uploadedVideoId}`);
      setUploading(false);
      resetForm();

      if (onUploadSuccess && uploadedVideoId) {
        onUploadSuccess(uploadedVideoId);
        navigate("/teacherpanel");
      }
    } catch (err) {
  console.error("Upload error:", err);

  if (err.response) {
    console.error("Backend error data:", err.response.data);
    console.error("Backend error status:", err.response.status);
    console.error("Backend error headers:", err.response.headers);
  } else if (err.request) {
    console.error("No response received:", err.request);
  } else {
    console.error("Error setting up request:", err.message);
  }

  setMessage("Error in uploading file. Please try again.");
  toast.error("File not uploaded!");
  setIsError(true);
  setUploading(false);
  setProgress(0);
}
  }
   const handleGenerateAssignmentClick = () => {
    // This will create a URL like: http://localhost:5173/generate-assignment?courseId=123
    navigate(`/generate-assignment?courseId=${courseId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-xl max-w-lg mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-6">Upload Your Video</h1>

      <form onSubmit={handleForm} className="w-full flex flex-col space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="video-title" className="block text-sm font-medium text-gray-300 mb-2">
            Video Title
          </label>
          <input
            type="text"
            id="video-title"
            name="title"
            value={meta.title}
            onChange={formFieldChange}
            placeholder="Enter video title"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="video-description" className="block text-sm font-medium text-gray-300 mb-2">
            Video Description
          </label>
          <textarea
            id="video-description"
            name="description"
            value={meta.description}
            onChange={formFieldChange}
            placeholder="Describe the video..."
            rows={4}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          ></textarea>
        </div>

        {/* Video Upload */}
        <div className="flex items-center space-x-5 justify-center">
          <img className="h-16 w-16 object-cover rounded-full border-2 border-gray-600" src={videoLogo} alt="Video thumbnail" />
          <label className="block flex-grow">
            <input
              key={selectedFile?.name}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-violet-500 file:text-white hover:file:bg-violet-600"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-400">
                Selected video: <span className="font-medium text-white">{selectedFile.name}</span>
              </p>
            )}
          </label>
        </div>

        {/* PDF Upload */}
        <div className="flex items-center space-x-5 justify-center mt-4">
          <img className="h-16 w-16 object-cover rounded-full border-2 border-gray-600" src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF icon" />
          <label className="block flex-grow">
            <input
              key={selectedPdf?.name}
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-red-500 file:text-white hover:file:bg-red-600"
            />
            {selectedPdf && (
              <p className="mt-2 text-sm text-gray-400">
                Selected PDF: <span className="font-medium text-white">{selectedPdf.name}</span>
              </p>
            )}
          </label>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-sm text-gray-300 mt-2 text-center">{`Uploading: ${progress}%`}</p>
          </div>
        )}

        {/* Alert */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-center justify-between ${
              isError ? "bg-red-600" : "bg-green-500"
            } text-white`}
            role="alert"
          >
            <span className="font-medium">{isError ? "Error!" : "Success!"}</span> {message}
            <button onClick={() => setMessage("")} className="ml-auto rounded-full p-2 hover:bg-opacity-20">
              ✕
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 px-6 rounded-md text-lg font-semibold transition-colors duration-200 ${
              uploading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? `Uploading (${progress}%)` : "Submit Video"}
          </button>
            <button onClick={handleGenerateAssignmentClick}>
      Go to Assignment Generator
    </button>
        </div>
      </form>
    </div>
  );
}

export default VideoUpload;
