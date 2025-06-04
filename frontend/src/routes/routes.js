import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/landing';
import SignUp from '../pages/SignUp';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import LoginFailed from '../pages/LogFail';
import SignSuc from '../pages/signSuc';
import SignFail from '../pages/signFail';
import PageNotFound from '../pages/PageNotFound';
import UnderConstruction from '../pages/UnderConstruction';
import CreateProject from '../pages/CreateProject';
import ManagerDashboard from '../pages/ManagerDashboard';
import InstructorDashboard from '../pages/InstructorDashboard';
import ManControls from '../pages/ManControls';
import FailurePage from '../pages/FailurePage';
import SuccessPage from '../pages/SuccessPage';
import ProjectsAssociated from '../pages/ProjectsAssociated';
import PrivateRoutes from './PrivateRoutes';
import StudentDashboard from '../pages/UserDashBoard/StudentDashboard';
import CreateTeam from '../pages/UserDashBoard/CreateTeam/CreateTeam';

const AppRoutes = () => {
  return (  
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/log-fail" element={<LoginFailed />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-suc" element={<SignSuc />} />
      <Route path="/sign-fail" element={<SignFail />} />
      
      {/* Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoutes>
            <AdminDashboard />
          </PrivateRoutes>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <PrivateRoutes>
            <StudentDashboard />
          </PrivateRoutes>
        }
      />

      <Route
        path="/manager-dashboard"
        element={
          <PrivateRoutes>
            <ManagerDashboard />
          </PrivateRoutes>
        }
      />

      <Route
        path="/instructor-dashboard"
        element={
          <PrivateRoutes>
            <InstructorDashboard />
          </PrivateRoutes>
        }
      />

      <Route
        path="/create-project"
        element={
          <PrivateRoutes>
            <CreateProject />
          </PrivateRoutes>
        }
      />

      <Route path='/create-team' element={
        <PrivateRoutes>
          <CreateTeam/>
        </PrivateRoutes>
      }
      />

      <Route
        path="/project-fail"
        element={
          <PrivateRoutes>
            <FailurePage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/project-success"
        element={
          <PrivateRoutes>
            <SuccessPage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/projects"
        element={
          <PrivateRoutes>
            <ProjectsAssociated />
          </PrivateRoutes>
        }
      />

      <Route
        path="/update-project"
        element={
          <PrivateRoutes>
            <UnderConstruction />
          </PrivateRoutes>
        }
      />

      <Route
        path="/man-controls"
        element={
          <PrivateRoutes>
            <ManControls />
          </PrivateRoutes>
        }
      />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
