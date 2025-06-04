import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from './Dashboard';
import './StudentDashboard.css';
    
function StudentDashboard() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-section">
        <Topbar title="Live Projects" />
        <Dashboard />
      </div>
    </div>
  );
}

export default StudentDashboard;
