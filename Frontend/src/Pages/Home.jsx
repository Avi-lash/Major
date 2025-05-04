import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const courseNames = [
  "Full Stack Web Development",
  "Data Science & ML",
  "Frontend Mastery",
  "Backend Development",
  "System Design & DSA"
];

const popularCourses = [
  {
    id: 1,  // Added unique ID for each course
    title: "DSA to Development",
    description: "DSA to Development: A Complete Guide",
    learners: "553k+ interested Geeks",
    rating: "4.4",
    level: "Beginner to Advance",
    color: "#00b894",
  },
  {
    id: 2,  // Added unique ID for each course
    title: "Backend Development",
    description: "JAVA Backend Development – Live",
    learners: "303k+ interested Geeks",
    rating: "4.7",
    level: "Intermediate and Advance",
    color: "#6c5ce7",
  },
  {
    id: 3,  // Added unique ID for each course
    title: "ML & DS",
    description: "Complete Machine Learning & Data Science Program",
    learners: "420k+ interested Geeks",
    rating: "4.7",
    level: "Beginner to Advance",
    color: "#55efc4",
    seats: "6 seats left",
  },
  {
    id: 4,  // Added unique ID for each course
    title: "Data Structures & Algorithms",
    description: "Self Paced [Online Course]",
    learners: "1368k+ interested Geeks",
    rating: "4.7",
    level: "Beginner to Advance",
    color: "#0984e3",
  }
];

const Home = () => {
  const [currentCourse, setCurrentCourse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCourse((prev) => (prev + 1) % courseNames.length);
    }, 2000); // changes every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h2>A Platform that helps you</h2>
          <h1>
            <span className="highlight"> LEARN. AND GROW.</span>
          </h1>
          <br />
          <br />
          <Link to="/courses" className="cta-button">
            <span className="bold-text">Ultimate</span> programming mastery →
          </Link>
        </div>

        <div className="hero-image-placeholder">
          <div className="slider-text">{courseNames[currentCourse]}</div>
        </div>
      </div>

      <div className="popular-section">
        <div className="popular-header">
          <h2>Popular Now</h2>
        </div>
        <div className="popular-courses">
          {popularCourses.map((course, idx) => (
            <div className="course-card" key={idx}>
              <div className="card-header" style={{ backgroundColor: course.color }}>
                <h3>{course.title}</h3>
              </div>
              <div className="card-body">
                <p className="learners">{course.learners}</p>
                <p className="rating">⭐ {course.rating}</p>
                <h4>{course.description}</h4>
                <p className="level">{course.level}</p>
                <Link to={`/videoplayer/${course.id}`} className="offer-btn">Watch Video</Link> {/* Link to VideoPage */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-banner">
     
      CONTACT JOE MAMA 

ON JOE MAMA NUMBER
      </div>
    </div>
  );
};

export default Home;
