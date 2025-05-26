// src/routes/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/landing';
import SignUp from '../pages/SignUp';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import LoginFailed from '../pages/LogFail'
import SignSuc from '../pages/signSuc'
import SignFail from '../pages/signFail'
import PageNotFound from '../pages/PageNotFound';
import UnderConstruction from '../pages/UnderConstruction';
import CreateProject from '../pages/CreateProject';
import ManagerDashboard from '../pages/ManagerDashboard';
import InstructorDashboard from '../pages/InstructorDashboard';
import ManControls from '../pages/ManControls';
import FailurePage from '../pages/FailurePage';
import SuccessPage from '../pages/SuccessPage';
import ProjectsAssociated from '../pages/ProjectsAssociated';
const AppRoutes = () => {
  return (
    <Routes>

      //Home Page
      <Route path="/" element={<Landing />} />

      //Login
      <Route path="/log-fail" element={<LoginFailed />} />

      //SignUp Sequence
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-suc" element={<SignSuc />} />
      <Route path="/sign-fail" element={<SignFail />} />

      //All Screens After Login !
      
      //1st Page after Login
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard/>} />
      <Route path="/manager-dashboard" element={<ManagerDashboard/>} />
      <Route path='/instructor-dashboard' element={<InstructorDashboard/>}/>
      //Under Construction pages
      <Route path="/create-project" element={<CreateProject/>}/>
      <Route path="/project-fail" element={<FailurePage/>}/>
      <Route path="/project-success" element={<SuccessPage/>}/>
      <Route path="/projects" element={<ProjectsAssociated/>}/>
      <Route path="/update-project" element={<UnderConstruction/>}/>
      <Route path="/man-controls" element={<ManControls/>}/>
      //Undefined Page
      <Route path="*" element={<PageNotFound/>} />
    </Routes>
  );
};

export default AppRoutes;
