import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h2>A Platform that helps you</h2>
          <h1>
            <span className="highlight"> LEARN. AND GROW.</span>
          </h1>
          <br></br>
          <br></br>
          <Link to="/courses" className="cta-button">
            <span className="bold-text">Ultimate</span> programming mastery  &rarr;
          </Link>
        </div>

        <div className="hero-image-placeholder">
          {/* You can add an image here if needed later */}
        </div>
      </div>

      <div className="footer-banner">
        INDIA'S MOST LOVED CODING COMMUNITY ❤️
      </div>
    </div>
  );
};

export default Home;
