import React, { useState } from "react";

const CourseDetailsUploadForm = () => {
  const [formData, setFormData] = useState({
    video: null,
    assignment: null,
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Video File:", formData.video);
    console.log("Assignment File:", formData.assignment);
    alert("Files submitted successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-black rounded-xl shadow-xl text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Course Details</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block mb-2 font-semibold">Upload Course Video:</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-900 text-gray-300 file:text-white file:bg-purple-700 file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Upload Assignment Document:</label>
          <input
            type="file"
            name="assignment"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-900 text-gray-300 file:text-white file:bg-purple-700 file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-md hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseDetailsUploadForm;
