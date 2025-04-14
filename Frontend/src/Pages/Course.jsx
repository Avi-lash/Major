import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Courseform.css';

function Course() {
  const [courseData, setCourseData] = useState({
    courseName: '',
    courseFees: '',
    timeRequired: '',
    teacherName: '',
    rating: 3, // Default to middle value
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/course/add', courseData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    .then(response => {
      console.log('✅ Course added successfully!', response);
      alert('Course added successfully!');
      setCourseData({
        courseName: '',
        courseFees: '',
        timeRequired: '',
        teacherName: '',
        rating: 3, // Reset to middle
      });

      // Redirect to /courselist after successful submission
      navigate('/courselist');
    })
    .catch(error => {
      console.error('❌ Error adding course:', error);
      alert('Error adding course!');
    });
  };

  return (
    <div className="course-form-page">
      <div className="course-form-container">
        <h2 className="form-title">📘 Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseName">Course Name</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseFees">Course Fees</label>
            <input
              type="number"
              id="courseFees"
              name="courseFees"
              value={courseData.courseFees}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeRequired">Time Required (hours)</label>
            <input
              type="number"
              id="timeRequired"
              name="timeRequired"
              value={courseData.timeRequired}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="teacherName">Teacher Name</label>
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              value={courseData.teacherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group rating-group">
            <label htmlFor="rating" className="rating-label">
              Rating: {`⭐`.repeat(courseData.rating)} ({courseData.rating})
            </label>
            <input
              type="range"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={courseData.rating}
              onChange={handleChange}
              className="rating-slider"
            />
          </div>

          <button type="submit" className="submit-btn">Add Course</button>
        </form>
      </div>
    </div>
  );
}

export default Course;
