import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseControlPanel = () => {
  const [courses, setCourses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [uploads, setUploads] = useState({});
  const navigate = useNavigate();

  const teacherData = JSON.parse(localStorage.getItem('teacher'));
  const teacherId = teacherData?.teacherId;

  useEffect(() => {
    if (!teacherId) {
      console.error('No teacherId in localStorage');
      return;
    }

    axios
      .get(`http://localhost:8080/courset/teacher/${teacherId}`, { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, [teacherId]);

  const handleVideoUpload = (courseId, file) => {
    setUploads((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], video: file },
    }));
  };

  const handleDocUpload = (courseId, file) => {
    setUploads((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], document: file },
    }));
  };

  const handleUploadClick = (courseId) => {
    navigate('/detailsupload', { state: { courseId } });
    setDropdownOpen(null);
  };

  const handleViewStudentsClick = (courseId) => {
    navigate('/coursestudents', { state: { courseId } });
    setDropdownOpen(null);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.glowingHeader}>🎓 Your Added Courses</h1>

      {courses.length === 0 ? (
        <p style={{ color: '#ccc' }}>No courses uploaded yet.</p>
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

            <div style={styles.dropdownContainer}>
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === course.courseId ? null : course.courseId)
                }
                style={styles.dropdownButton}
              >
                ⋮
              </button>

              {dropdownOpen === course.courseId && (
                <div style={styles.dropdownMenu}>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleUploadClick(course.courseId)}
                  >
                    Upload Details
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleViewStudentsClick(course.courseId)}
                  >
                    View Student Details
                  </div>
                </div>
              )}
            </div>

            <div style={styles.uploadInfo}>
              {uploads[course.courseId]?.video && (
                <p>📹 Video: {uploads[course.courseId].video.name}</p>
              )}
              {uploads[course.courseId]?.document && (
                <p>📄 Document: {uploads[course.courseId].document.name}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000',
    minHeight: '100vh',
    color: '#fff',
  },
  glowingHeader: {
    fontSize: '36px',
    color: '#0ff',
    textAlign: 'center',
    marginBottom: '30px',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff',
  },
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
  },
  dropdownButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '35px',
    right: 0,
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #ccc',
    borderRadius: '6px',
    zIndex: 1,
    minWidth: '180px',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '10px 14px',
    fontSize: '14px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
  },
  hiddenInput: {
    display: 'none',
  },
  uploadInfo: {
    marginTop: '10px',
    color: '#ccc',
    fontSize: '14px',
  },
};

export default CourseControlPanel;
