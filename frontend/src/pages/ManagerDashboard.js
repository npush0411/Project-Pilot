import React from 'react';
import './css/ManagerDashboard.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { FiSearch } from 'react-icons/fi';

const ManagerDashboard = () => {
  const features = [
    { name: 'Projects Associated', path: '/projects' },
    { name: 'Create Project', path: '/create-project' },
    { name: 'Update Project', path: '/update-project' },
  ];

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="user-dashboard">
      {/* Navbar */}
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <h3>Welcome to Project Pilot  </h3>
        <div className="nav-buttons">
          {features.map((feature, index) => (
            <button
              key={index}
              className="nav-button"
              onClick={() => handleNavigation(feature.path)}
            >
              {feature.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Section (Centered) */}
      <div className="search-section">
        <div className="search-bar-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        © 2025 Walchand College of Engineering, Sangli. All rights reserved.
      </footer>
    </div>
  );
};

export default ManagerDashboard;
