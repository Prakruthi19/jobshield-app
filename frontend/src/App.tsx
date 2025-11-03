import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home';
import UserLogin from './pages/auth/user/UserLogin';
import UserRegister from './pages/auth/user/UserRegister'
import UserDashboard from './pages/auth/dashboard/UserDashboard';

const App = () => {
  return (
     <BrowserRouter>
        <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/auth/user/" element={<UserLogin />} />
         <Route path="/register/auth/user/" element={<UserRegister />} />
          <Route path="/dashboard/user/" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

