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
    <div className="animated-background">
      <div className="form-container">
        <h2>Upload Course</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {['courseName', 'description', 'fees', 'duration', 'teacherName'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
              <input
                type={field === 'fees' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="form-group">
            <label>Course Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default CourseUploadForm;
