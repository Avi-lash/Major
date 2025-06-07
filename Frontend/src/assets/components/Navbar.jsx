import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

 const handleProfileClick = () => {
  const studentDataStr = localStorage.getItem("student");
  if (studentDataStr) {
    try {
      const studentData = JSON.parse(studentDataStr);
      const studentId = studentData.studentId;
      if (studentId) {
        navigate(`/student/${studentId}`);
        return;
      }
    } catch (err) {
      console.error("Error parsing student data from localStorage", err);
    }
  }
  navigate("/home");
};


  return (
    <div className="navbar">
      <div className="logo">CourseManager</div>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/showcourse">Courses</Link>
       
        <Link to="/contact">Contact</Link>
      </div>
      <div
        className="profile-icon"
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
        title="Profile"
      >
        <FaUserCircle size={30} color="#fff" />
      </div>
    </div>
  );
};

export default Navbar;
