import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CourseUploadForm = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    fees: '',
    duration: '',
    teacherName: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Get teacherId from localStorage
  const teacherData = JSON.parse(localStorage.getItem('teacher'));
  const teacherId = teacherData?.teacherId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { courseName, description, fees, duration, teacherName, image } = formData;

    if (!courseName || !description || !fees || !duration || !teacherName || !image) {
      toast.error("Please fill in all fields and select an image.");
      return;
    }

    if (!teacherId) {
      toast.error("Teacher ID not found. Please log in again.");
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8080/courset/add/${teacherId}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success(res.data.message || "Course added successfully!");
      setFormData({
        courseName: '',
        description: '',
        fees: '',
        duration: '',
        teacherName: '',
        image: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animated-background bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Upload Course</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {['courseName', 'description', 'fees', 'duration', 'teacherName'].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field} className="block text-gray-400 text-sm font-semibold mb-2">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type={field === 'fees' ? 'number' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">
              Course Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"  />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default CourseUploadForm;