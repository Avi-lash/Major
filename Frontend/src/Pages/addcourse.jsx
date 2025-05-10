import React, { useState } from 'react';
import axios from 'axios';

const CourseUploadForm = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    fees: '',
    duration: '',
    teacherName: '',
    image: null,
  });

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
    const form = new FormData();
    form.append('courseName', formData.courseName);
    form.append('description', formData.description);
    form.append('fees', formData.fees);
    form.append('duration', formData.duration);
    form.append('teacherName', formData.teacherName);
    form.append('image', formData.image);

    try {
      const response = await axios.post('/api/courses', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Course uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload course.');
    }
  };

  return (
    <div>
      <style>{`
        body {
          margin: 0;
        }

        .animated-background {
          min-height: 100vh;
          background: linear-gradient(270deg,rgb(29, 6, 75),rgb(101, 3, 93),rgb(21, 2, 21));
          background-size: 600% 600%;
          animation: gradientAnimation 15s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 0;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .form-container {
          max-width: 500px;
          width: 100%;
          margin: auto;
          padding: 30px;
          border-radius: 10px;
          background-color: #444;
          box-shadow: 0 0 15px rgba(0,0,0,0.4);
          font-family: Arial, sans-serif;
          color: white;
        }

        .form-container h2 {
          text-align: center;
          margin-bottom: 25px;
          color: white;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: bold;
          color: white;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          color: black;
        }

        .form-group input[type="file"] {
          padding: 3px;
          background-color: white;
        }

        .submit-button {
          width: 100%;
          padding: 12px;
          background-color: #00bfff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #009acd;
        }
      `}</style>

      <div className="animated-background">
        <div className="form-container">
          <h2>Upload Course</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Fees</label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teacher Name</label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseUploadForm;
