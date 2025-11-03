import React from "react";
import "./logincard.scss";

type Props = {
  form: { email: string; password: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  themeColor: string;
  title: string;
};

const LoginCard: React.FC<Props> = ({ title, form, onChange, onSubmit, loading, themeColor }) => {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <h2 className="login-title" style={{ color: themeColor }}>
        {title}
      </h2>

      <input
        name="email"
        value={form.email}
        onChange={onChange}
        type="email"
        placeholder="Email"
        className="login-input"
        required
      />

      <input
        name="password"
        value={form.password}
        onChange={onChange}
        type="password"
        placeholder="Password"
        className="login-input"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="login-button"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="login-links">
        <a href="/reset-password" style={{ color: themeColor }}>
          Forgot password?
        </a>
      </div>

      <div className="signup-text">
        Don't have an account?{" "}
        <a href="/register/auth/user/" style={{ color: themeColor }}>
          Sign Up
        </a>
      </div>
    </form>
  );
};

export default LoginCard;
