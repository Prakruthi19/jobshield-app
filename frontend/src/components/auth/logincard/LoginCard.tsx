import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./logincard.scss";
import { Eye, EyeOff } from "lucide-react";

interface LoginCardProps  {
  title: string;
  themeColor?: string;
  loading?: boolean;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  signUpLink?: string;
};


const LoginCard: React.FC<LoginCardProps> = ({
  title,
  themeColor = "var(--primary-color)",
  loading = false,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  signUpLink = "/register/auth/user/",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={(e) => {
      e.preventDefault(); // prevent default form submit
      onSubmit();
    }} className="login-form">
      <h2 className="login-title" style={{ color: themeColor }}>
        {title}
      </h2>

      <input
        name="email"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        type="email"
        placeholder="Email"
        className="login-input"
        required
      />

     <div className="password-wrapper">
          <input
            name="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            required
          />

          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

      <button
        type="submit"
        disabled={loading}
        className="login-button"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="login-links">
        <Link to="/reset-password" style={{ color: themeColor }}>
          Forgot password?
        </Link>
      </div>

      <div className="signup-text">
        Don't have an account?{' '}
        <Link to={signUpLink} style={{ color: themeColor }}>
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default LoginCard;
