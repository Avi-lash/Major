import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const courseSlides = [
  {
    name: "Full Stack Web Development",
    svg: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="#4f46e5">
        <path d="M4 5h16v12H4z" opacity=".3" />
        <path d="M20 3H4a1 1 0 0 0-1 1v14h7v2H8v2h8v-2h-2v-2h7V4a1 1 0 0 0-1-1zm-1 12H5V5h14v10z" />
      </svg>
    )
  },
  {
    name: "Data Science & ML",
    svg: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="#facc15">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 17.93A8.017 8.017 0 0 1 6.07 13H11v4.93zM13 11V6.07A8.017 8.017 0 0 1 17.93 11zM11 11H6.07A8.017 8.017 0 0 1 11 6.07zm2 1h4.93A8.017 8.017 0 0 1 13 17.93z" />
      </svg>
    )
  },
  {
    name: "Frontend Mastery",
    svg: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="#22d3ee">
        <path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h8v2H4zm0 4h16v2H4z" />
      </svg>
    )
  },
  {
    name: "Backend Development",
    svg: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="#34d399">
        <path d="M12 2C7.03 2 3 6.03 3 11v4h2v-4c0-3.86 3.14-7 7-7s7 3.14 7 7v4h2v-4c0-4.97-4.03-9-9-9z" />
        <path d="M17 12H7v8h10z" opacity=".3" />
        <path d="M17 10H7c-1.1 0-2 .9-2 2v8h14v-8c0-1.1-.9-2-2-2zm0 10H7v-8h10v8z" />
      </svg>
    )
  },
  {
    name: "System Design & DSA",
    svg: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="#f472b6">
        <path d="M3 13h18v2H3zm0-4h18v2H3zm0-4h18v2H3zm0 8h18v2H3zm0 4h18v2H3z" />
      </svg>
    )
  }
];

const popularCourses = [
  {
    id: 1,
    title: "DSA to Development",
    description: "DSA to Development: A Complete Guide",
    learners: "553k+ interested Geeks",
    rating: "4.4",
    level: "Beginner to Advance",
    color: "#00b894",
  },
  {
    id: 2,
    title: "Backend Development",
    description: "JAVA Backend Development – Live",
    learners: "303k+ interested Geeks",
    rating: "4.7",
    level: "Intermediate and Advance",
    color: "#6c5ce7",
  },
  {
    id: 3,
    title: "ML & DS",
    description: "Complete Machine Learning & Data Science Program",
    learners: "420k+ interested Geeks",
    rating: "4.7",
    level: "Beginner to Advance",
    color: "#55efc4",
    seats: "6 seats left",
  },
  {
    id: 4,
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
      setCurrentCourse((prev) => (prev + 1) % courseSlides.length);
    }, 2000);
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
          <Link to="/showcourse" className="cta-button">
            <span className="bold-text">Ultimate</span> programming mastery →
          </Link>
        </div>

        <div className="hero-image-placeholder">
          <div className="slider-svg">{courseSlides[currentCourse].svg}</div>
          <div className="slider-text">{courseSlides[currentCourse].name}</div>
        </div>
      </div>

      <div className="popular-section">
        <div className="popular-header">
          <h2>Popular Now</h2>
        </div>
        <div className="popular-courses">
          {popularCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="card-header" style={{ backgroundColor: course.color }}>
                <h3>{course.title}</h3>
              </div>
              <div className="card-body">
                <p className="learners">{course.learners}</p>
                <p className="rating">⭐ {course.rating}</p>
                <h4>{course.description}</h4>
                <p className="level">{course.level}</p>
                <Link to={`/videoplayer/${course.id}`} className="offer-btn">
                  Watch Video
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-banner">
        CONTACT JOE MAMA <br />
        ON JOE MAMA NUMBER
      </div>
    </div>
  );
};

export default Home;
