import { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowCourse.css';

function CourseList() {
  const [courses, setCourses] = useState([]);

  // Helper: Random color generator
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Store random colors for each course
  const [cardColors, setCardColors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/course/getcourse', {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
    .then(response => {
      setCourses(response.data);
      setCardColors(response.data.map(() => getRandomColor()));
    })
    .catch(error => {
      console.error('Failed to fetch courses:', error);
    });
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="logo">CourseManager</div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Courses</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div className="course-list-page">
        <div className="course-list-container">
          <h2 className="title">📚 All Courses</h2>
          {courses.length === 0 ? (
            <p className="empty-msg">No courses available 😢</p>
          ) : (
            <div className="courses-grid">
              {courses.map((course, index) => {
                const borderColor = cardColors[index] || '#6366f1';
                return (
                  <div 
                    key={course.id || index} 
                    className="course-card" 
                    style={{
                      borderLeft: `5px solid ${borderColor}`,
                      boxShadow: `0 4px 20px ${borderColor}55` // transparent shadow
                    }}
                  >
                    <h3>{course.courseName || 'Unnamed Course'}</h3>
                    <p><strong>Fees:</strong> ₹{course.courseFees || 'N/A'}</p>
                    <p><strong>Duration:</strong> {course.timeRequired || 'N/A'} hrs</p>
                    <p><strong>Teacher:</strong> {course.teacherName || 'Unknown'}</p>
                    <p><strong>Rating:</strong> ⭐ {course.rating || '0'} / 5</p>
                    <button 
                      className="buy-now-button"
                      style={{ backgroundColor: borderColor }}
                    >
                      Buy Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CourseList;
