import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseControlPanel = () => {
  const [courses, setCourses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const dropdownRefs = useRef({});

  const teacherData = JSON.parse(localStorage.getItem('teacher'));
  const teacherId = teacherData?.teacherId;

  useEffect(() => {
    if (!teacherId) return;
    axios
      .get(`http://localhost:8080/courset/teacher/${teacherId}`, { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [teacherId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(e.target)
      );
      if (isOutside) setDropdownOpen(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadClick = (courseId) => {
    navigate(`/upload/${courseId}`);
    setDropdownOpen(null);
  };

  const handleViewStudentsClick = (courseId) => {
    navigate('/coursestudents', { state: { courseId } });
    setDropdownOpen(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1
        style={{
          color: '#00ffea',
          textShadow: '0 0 8px #00ffea',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        🎓 Your Added Courses
      </h1>

      {courses.length === 0 ? (
        <p style={{ color: '#ccc', textAlign: 'center' }}>No courses uploaded yet.</p>
      ) : (
        courses.map((course) => (
          <div key={course.courseId} style={styles.card}>
            <img
              src={`http://localhost:8080/courset/image/${course.courseId}`}
              alt={course.courseName}
              style={styles.image}
            />
            <div style={styles.courseInfo}>
              <h2 style={styles.courseName}>Course Name: {course.courseName}</h2>
              <p>Description: {course.description}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Fees:</strong> ₹{course.fees}</p>
            </div>

            <div
              style={styles.dropdownContainer}
              ref={(el) => (dropdownRefs.current[course.courseId] = el)}
            >
              <button
                onClick={() =>
                  setDropdownOpen((prev) => (prev === course.courseId ? null : course.courseId))
                }
                style={styles.dropdownButton}
              >
                ⋮
              </button>

              {dropdownOpen === course.courseId && (
                <div style={styles.dropdownMenu}>
                  <div
                    onClick={() => handleUploadClick(course.courseId)}
                    style={styles.dropdownItem}
                  >
                    Upload Details
                  </div>
                  <div
                    onClick={() => handleViewStudentsClick(course.courseId)}
                    style={styles.dropdownItem}
                  >
                    View Student Details
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    marginBottom: '30px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)',
  },
  image: {
    width: '180px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '20px',
    border: '2px solid #00ffea',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    margin: '0 0 10px 0',
    fontSize: '22px',
    background: 'linear-gradient(to right, #00f0ff, #ff00f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    zIndex: 10,
  },
  dropdownButton: {
    background: 'none',
    border: '2px solid white',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '24px',
    padding: '2px 10px',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '35px',
    right: 0,
    backgroundColor: '#333',
    borderRadius: '6px',
    boxShadow: '0 0 10px rgba(0,0,0,0.7)',
    width: '160px',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '10px 14px',
    fontSize: '14px',
    borderBottom: '1px solid #555',
    cursor: 'pointer',
    color: '#00ffea',
  },
};

export default CourseControlPanel;
