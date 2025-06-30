import React, { useState } from 'react';
import logo from '../../images/logo.png';
import './Login.css'; // Reuse for unified styling
import './ResetPassword.css';
import { useNavigate, useLocation } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // ✅ Get token from query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Password has been reset successfully!');
        navigate('/');
      } else {
        alert(data.error || 'Token expired or invalid.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pr fade-in">
      <div className="top">
        <img className="logo1" src={logo} alt="logo" />
        <h1>Walchand College of Engineering, Sangli</h1>
        <h2>Department Of Electronics Engineering</h2>
        <h3>Project Management Tool</h3>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="abc">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="abc">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <input type="submit" value="Reset Password" />
      </form>

      <footer className="footer">
        © 2025 Walchand College of Engineering, Sangli. All rights reserved.
      </footer>
    </div>
  );
}

export default ResetPassword;
