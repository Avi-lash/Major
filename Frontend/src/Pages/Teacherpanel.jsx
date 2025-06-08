import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const TeacherHomePanel = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={styles.body}>
      <style>
        {`
          .animated-card {
            background: linear-gradient(135deg, #3b82f6, #9333ea);
            transition: background 0.8s ease;
          }
          .animated-card:hover {
            background: linear-gradient(-45deg,rgb(255, 0, 157),rgb(17, 17, 201),rgb(106, 6, 160),rgb(37, 0, 93));
            background-size: 300% 300%;
            animation: gradientMove 4s ease infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Menu</h2>
        <div style={styles.sidebarItem} onClick={() => setShowDropdown(!showDropdown)}>
          Teacher Profile ⯆
        </div>
        {showDropdown && (
          <div style={styles.dropdown}>
            <div
              style={styles.dropdownItem}
              onClick={() => navigate('/teacherprofile')}
            >
              View Profile
            </div>
            <div
              style={styles.dropdownItem}
              onClick={() => navigate('/edit_profile')}
            >
              Edit Profile
            </div>
            <div style={styles.dropdownItem}>Logout</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        <h1 style={styles.header}>Teacher Home Panel</h1>
        <div style={styles.grid}>
          <Link to="/courseupload" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <div className="animated-card" style={styles.card}>Add Course</div>
          </Link>
          <Link to="/viewcourse" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <div className="animated-card" style={styles.card}>View Added Course</div>
          </Link>
          <div className="animated-card" style={styles.card}>Doubts</div>
          <div className="animated-card" style={styles.card}>Student Details</div>
          <div className="animated-card" style={styles.card}>Feedbacks</div>
          <div
            className="animated-card"
            style={styles.card}
            onClick={() => navigate('/teacherprofile')}
          >
            Teacher Profile
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    display: 'flex',
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#1f1f1f',
    padding: '20px',
    boxShadow: '2px 0 8px rgba(0,0,0,0.5)',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: '20px',
    marginBottom: '15px',
    borderBottom: '1px solid #555',
    paddingBottom: '5px',
  },
  sidebarItem: {
    cursor: 'pointer',
    padding: '10px 0',
    borderBottom: '1px solid #333',
    color: '#ccc',
  },
  dropdown: {
    marginTop: '5px',
    paddingLeft: '10px',
  },
  dropdownItem: {
    padding: '6px 0',
    color: '#aaa',
    cursor: 'pointer',
  },
  container: {
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#00eaff',
    textShadow: '0 0 10px #00eaff, 0 0 20px #00eaff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    width: '100%',
    maxWidth: '1000px',
    justifyItems: 'center',
  },
  card: {
    padding: '60px 20px',
    borderRadius: '16px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  },
};

export default TeacherHomePanel;
