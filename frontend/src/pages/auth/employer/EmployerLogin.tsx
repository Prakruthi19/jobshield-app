import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../../components/auth/logincard/LoginCard";
import "./employer-login.scss";
import { googleLogin, loginUser } from "../../../api/authService";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import SHA256 from "crypto-js/sha256";
import useGoogleScript from "../../../hooks/useGoogleScript";
import type { GoogleAuthResponse } from "../../../types/auth";
const EmployerLogin: React.FC = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  console.log("Login submitted:", { email, password });

  // Hash password before sending
  const hashedPassword = SHA256(password).toString();

  setLoading(true);

  try {
    const res = await loginUser({
      email,
      password: hashedPassword,  // MUST be 'password' key
    });
    console.log("Login response:", res.data);
    toast.success(res.data.message, { duration: 2000 });

    // Store token & user details
    sessionStorage.setItem("accessToken", res.data.token);
    sessionStorage.setItem("userRole", res.data.role);
    sessionStorage.setItem("userId", res.data.userId);
    sessionStorage.setItem("userName", res.data.userName);
    sessionStorage.setItem("userEmail", res.data.userEmail);
     if (res.data.role !== "EMPLOYER") {
      toast.error("Access denied. You must log in as an employer.");
      return;
    }
    // Redirect
    setTimeout(() => {
      navigate("/dashboard/employer");
    }, 1500);

    console.log("Logged in user:", res.data);

  } catch (err: any) {
    console.error("Login error:", err);
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

 const handleCredentialResponse  = async (credentialResponse: any) => {
    try {
     if (!credentialResponse?.credential) {
      toast.error("Google authentication failed");
      return;
    }

  const res: GoogleAuthResponse = await googleLogin(
      credentialResponse.credential,
      "EMPLOYER"
    );
       if (res.role !== "EMPLOYER") {
      toast.error("Access denied. You must log in as an employer.");
      return;
    }
      // Store token & user details
      sessionStorage.setItem("accessToken", res.token);
      sessionStorage.setItem("userRole", res.role);
      sessionStorage.setItem("userId", res.userId);
      sessionStorage.setItem("userName", res.userName);
      sessionStorage.setItem("userEmail", res.userEmail);
       if (!res.profileComplete) {
       toast.success("Welcome! Please complete your profile");
        setTimeout(() => navigate("/dashboard/employer", { state: { activeTab: "profile" } }), 1500);
        return;
    }
      toast.success("User Login Successful");
        setTimeout(() => {
        navigate("/dashboard/employer");
      }, 1500);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

useGoogleScript(import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID || "", handleCredentialResponse);
const handleCustomSignIn = () => {
      if (window.google && window.google.accounts?.id?.prompt) {
        window.google.accounts.id.prompt();
      }
    };

  return (
    <div className="login-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

  <div className="login-container">
    <LoginCard
      title="Employer Login"
      loading={loading}
      username={email}
      password={password}
      onUsernameChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      themeColor="var(--primary-color)"      
      signUpLink="/register/auth/employer/"    />

    <div className="divider">
      <span>or</span>
    </div>
    <div className="google-wrapper">
        <button className="google-btn" onClick={handleCustomSignIn}>
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="google"
      className="google-icon"
    />
    <span>Continue with Google</span>
   </button>
    </div>
  </div>
</div>

  );
};

export default EmployerLogin;
