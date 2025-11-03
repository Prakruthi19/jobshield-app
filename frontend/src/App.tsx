import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home';
import UserLogin from './pages/auth/user/UserLogin';

const App = () => {
  return (
     <BrowserRouter>
        <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/user/UserLogin" element={<UserLogin />} />
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;

