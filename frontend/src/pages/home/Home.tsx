import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt
} from "react-icons/fa";
import {
  FiUser,
  FiBriefcase
} from "react-icons/fi";
import {
  HiOutlineSparkles
} from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";

import "./Home.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect((): void => {
    document.title = "JobShield - Home";
  }, []);

  return (
    <div className="home-page">
      <div className="bg-gradient" />
      <div className="bg-pattern" />

      <div className="content-wrapper">
        {/* Header */}
       

        {/* Hero */}
        <main className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Protect Your</span>
              <span className="title-line highlight">Career Journey</span>
            </h1>

            <p className="hero-subtitle">
              AI-powered platform that detects fraudulent job postings and
              safeguards job seekers from scams
            </p>

            {/* Features */}
            <div className="features-grid">
              <div className="feature-item">
                <BsLightningCharge className="feature-icon" />
                <span>Real-time Detection</span>
              </div>

              <div className="feature-item">
                <HiOutlineSparkles className="feature-icon" />
                <span>AI-Powered Analysis</span>
              </div>

              <div className="feature-item">
                <MdVerified className="feature-icon" />
                <span>Verified Employers</span>
              </div>
            </div>

            {/* Login */}
            <div className="login-section">
              <h2 className="login-heading">Get Started</h2>

              <div className="login-options">
                <button
                  className="login-card user-card"
                  onClick={() => navigate("/login/auth/user/")}
                >
                  <div className="card-icon">
                    <FiUser />
                  </div>

                  <div className="card-content">
                    <h3>Job Seeker</h3>
                    <p>Find verified opportunities</p>
                  </div>

                  <div className="card-arrow">→</div>
                </button>

                <button
                  className="login-card employer-card"
                  onClick={() => navigate("/login/auth/employer/")}
                >
                  <div className="card-icon">
                    <FiBriefcase />
                  </div>

                  <div className="card-content">
                    <h3>Employer</h3>
                    <p>Post verified positions</p>
                  </div>

                  <div className="card-arrow">→</div>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer stats */}
        <footer className="footer-stats">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Jobs Verified</div>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Protection</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
