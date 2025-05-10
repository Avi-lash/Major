import React, { useState } from 'react';

const CourseControlPanel = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [docFile, setDocFile] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleDocUpload = (event) => {
    const file = event.target.files[0];
    if (file) setDocFile(file);
  };

  return (
    <div style={styles.wrapper}>
      {/* Glowing Header */}
      <h1 style={styles.glowingHeader}>Your Added Courses</h1>

      {/* Course Card */}
      <div style={styles.topBar}>
        <h2 style={styles.courseName}>Course Name: React Basics</h2>
        <div style={styles.dropdownContainer}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} style={styles.dropdownButton}>
            ⋮
          </button>
          {dropdownOpen && (
            <div style={styles.dropdownMenu}>
              <label style={styles.dropdownItem}>
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  style={styles.hiddenInput}
                  onChange={handleVideoUpload}
                />
              </label>
              <label style={styles.dropdownItem}>
                Upload Assignment
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  style={styles.hiddenInput}
                  onChange={handleDocUpload}
                />
              </label>
              <div style={styles.dropdownItem}>
                View Student Details
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Info */}
      <div style={styles.uploadInfo}>
        {videoFile && <p>📹 Uploaded Video: {videoFile.name}</p>}
        {docFile && <p>📄 Uploaded Document: {docFile.name}</p>}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000', // black background
    minHeight: '100vh',
    color: '#fff',
  },
  glowingHeader: {
    fontSize: '36px',
    color: '#0ff',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#2f2f2f', // grey card
    color: '#fff',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '10px',
  },
  courseName: {
    margin: 0,
    fontSize: '24px',
    background: 'linear-gradient(to right, #00f0ff, #ff00f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '28px',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '12px 16px',
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
    marginTop: '30px',
    fontSize: '16px',
    color: '#ccc',
  },
};

export default CourseControlPanel;
