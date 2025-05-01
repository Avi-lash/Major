import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">CourseManager</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courselist">Courses</Link>  {/* Updated path */}
        <Link to="/quiz">Quiz</Link>  {/* Updated path */}
        <Link to="/contact">Contact</Link>  {/* Updated path */}
      </div>
    </div>
  );
};

export default Navbar;
