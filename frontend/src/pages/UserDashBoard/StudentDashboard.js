import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from './Dashboard';
import './StudentDashboard.css';
import Footer from '../../components/Footer';
function StudentDashboard() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-section">
        <Topbar title="Live Projects" />
        <div className='mstt1'>
          <Dashboard />
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
}

export default StudentDashboard;
