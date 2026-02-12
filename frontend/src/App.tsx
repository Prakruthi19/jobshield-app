import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home';
import UserLogin from './pages/auth/user/UserLogin';
import UserRegister from './pages/auth/user/UserRegister'
import UserDashboard from './pages/dashboard/user/UserDashboard';
import EmployerLogin from './pages/auth/employer/EmployerLogin';
import EmployerRegister from './pages/auth/employer/EmployerRegister';
import EmployerDashboard from './pages/dashboard/employer/EmployerDashboard';
import JobDetailsPage from './pages/dashboard/user/jobs/JobDetailsPage';


const App = () => {
  return (
<BrowserRouter>
      <Toaster position="top-center" />

      {/* Wrap either all routes or just login route with GoogleOAuthProvider */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Option 1: Wrap just the login page */}
        <Route
          path="/login/auth/user/"
          element={
            <GoogleOAuthProvider clientId={import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              <UserLogin />
            </GoogleOAuthProvider>
          }
        />

        <Route path="/register/auth/user/" element={<UserRegister />} />
        <Route
          path="/login/auth/employer/"
          element={
            <GoogleOAuthProvider clientId={import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              <EmployerLogin />
            </GoogleOAuthProvider>
          }
        />
        <Route path="/register/auth/employer/" element={<EmployerRegister />} />
        <Route path="/dashboard/user/" element={<UserDashboard />} />
        <Route path="/dashboard/employer/" element={<EmployerDashboard />} />
        <Route
            path="/dashboard/user/jobs/JobDetails/:id"
            element={<JobDetailsPage />}
          />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

