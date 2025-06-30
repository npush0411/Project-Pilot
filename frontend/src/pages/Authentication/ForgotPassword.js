import React, { useState } from 'react';
import logo from '../../images/logo.png';
import './Login.css'; // Reusing Login.css for unified design
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ForgotPassword() {
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Password reset instructions sent!');
        navigate('/');
      } else {
        alert(data.error || 'Invalid User ID or server error.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
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
          <label>User ID:</label>
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
        </div>
        <input type="submit" value="Request Reset Link" />
        <div className="forgot-password" style={{ marginTop: '15px' }}>
          <a href="/">Back to Login</a>
        </div>
      </form>
      <footer className="footer">
        © 2025 Walchand College of Engineering, Sangli. All rights reserved.
      </footer>
    </div>
  );
}

export default ForgotPassword;
