import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';

const TeacherHomePanel = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={styles.body}>
      <style>
        {`
          .animated-card {
            background: linear-gradient(135deg,#6441A5, #2a0845);
            transition: background 0.8s ease;
          }
          .animated-card:hover {
            background: linear-gradient(-45deg,#2a0845,#2a0840,#6441A5,#6441A0);
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
<div className="w-64 bg-purple-900 text-white flex flex-col items-center py-8">
        <h2 className="text-white text-xl mb-4 border-b border-[#555] pb-[5px]">
          Menu
        </h2>
        <div
          className="cursor-pointer py-2.5 border-b border-[#333] text-gray-300"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Teacher Profile ⯆
        </div>
        {showDropdown && (
          <div className="mt-2.5 bg-purple-900 rounded-md p-2.5">
            <div
              className="flex items-center gap-2 cursor-pointer py-2 text-white border-b border-[#444] last:border-b-0"
              onClick={() => navigate('/teacherprofile')}
            >
              <FaUser /> View Profile
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer py-2 text-white border-b border-[#444] last:border-b-0"
              onClick={() => navigate('/edit_profile')}
            >
              <FaTachometerAlt /> Edit Profile
            </div>
            <div className="flex items-center gap-2 cursor-pointer py-2 text-white border-b border-[#444] last:border-b-0">
              <FaSignOutAlt /> Logout
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        <h1 style={styles.header}>TEACHER HOME PANEL</h1>
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
    fontFamily: 'Tahoma, sans-serif',
  },
  sidebar: {
      width: '220px',
      backgroundColor: '#6441A5',
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
      marginTop: '10px',
      backgroundColor: '#6441A0',
      borderRadius: '5px',
      padding: '10px',
    },
    dropdownItem: {
      cursor: 'pointer',
      padding: '8px 0',
      color: '#fff',
      borderBottom: '1px solid #444',
      
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
    color: '#6441A5',
    fontWeight: '100px',
    fontFamily: 'Tahoma, sans-serif' 
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
