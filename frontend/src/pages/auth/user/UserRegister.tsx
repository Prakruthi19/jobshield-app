"use client";
import UserRegisterCard from "../../../components/auth/registercard/RegisterCard";

const RegisterPage = () => {
  return (
    <div className="register-page">
      <UserRegisterCard 
        title="Create Your Account as a User" 
        subtitle="Join JobShield today and help us detect fake jobs together." 
        themeColor="var(--primary-color)"
        role="JOBSEEKER"
      />
    </div>
  );
};

export default RegisterPage;
