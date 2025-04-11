// src/routes/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/landing';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import LoginFailed from '../pages/LogFail'
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/log-fail" element={<LoginFailed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
