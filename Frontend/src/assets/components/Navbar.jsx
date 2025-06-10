import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import logo from '../../assets/small.jpg'; 
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname;

  // Exact match routes where Navbar should be hidden
  const hideExactRoutes = [
    "/", "/login", "/signup", "/forgot-password",
    "/update-password", "/verify-otp",
    "/admin", "/studentadmin", "/teacheradmin", "/courseadmin",
    "/teacherpanel", "/teacherprofile"
  ];

  // Prefix match routes
  const hidePrefixRoutes = [
    "/admin", "/teacher"
  ];

  const shouldHideNavbar =
    hideExactRoutes.includes(path) ||
    hidePrefixRoutes.some(route => path.startsWith(route));

  if (shouldHideNavbar) return null;


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
      <div className="navbar-logo">
        <Link to="/">
    <img src={logo} alt="Logo" className="h-15 w-auto" />
    </Link>
  </div>
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
