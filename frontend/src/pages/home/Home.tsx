import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();
   // Set page title
  useEffect(() => {
    document.title = "JobShield Application";
  }, []);

  return (
    <div className="home-page">
       <h1 className="home-title">JobShield Application</h1>
    
      <p className="home-subtitle">
        AI-Powered Platform that Detects Fake Jobs and Safeguards Job Seekers
      </p>

      <div className="login-options">
        <div className="login-card" onClick={() => navigate("/login/user/UserLogin")}>
          Login as User
        </div>
        <div className="login-card" onClick={() => navigate("/login/employer/EmployerLogin")}>
          Login as Employer
        </div>
      </div>
    </div>
  );
};

export default Home;
