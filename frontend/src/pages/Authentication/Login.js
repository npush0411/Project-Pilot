import React, { useState, useEffect } from 'react';
import logo from '../../images/logo.png';
import PilotLogo from '../../images/PilotLogo.png';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
 
function Login() {
  const [userID, setuserID] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [homePath, setHomePath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const splash = document.querySelector('.splash-screen');
    const timer = setTimeout(() => {
      if (splash) splash.classList.add('hide');
      setTimeout(() => setIsLoading(false), 800);
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = JSON.stringify({ userID, password });

      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data);
        localStorage.setItem('token', data.token);
        const tokenParam = `?token=${encodeURIComponent(data.token)}`;
        localStorage.setItem('user', JSON.stringify(data.user));
        switch (data.user.role) {
          case 'Admin':
            navigate(`/admin-dashboard${tokenParam}`);
            setHomePath(`/admin-dashboard${tokenParam}`);
            localStorage.setItem('homePath', homePath);
            break;
          case 'Manager':
            navigate(`/manager-dashboard${tokenParam}`);
            setHomePath(`/manager-dashboard${tokenParam}`);
            localStorage.setItem('homePath', homePath);
            break;
          case 'Instructor':
            navigate(`/instructor-dashboard${tokenParam}`);
            setHomePath(`/instructor-dashboard${tokenParam}`);
            localStorage.setItem('homePath', homePath);
            break;
          default:
            navigate(`/student-dashboard${tokenParam}`);
            setHomePath(`/student-dashboard${tokenParam}`);
            localStorage.setItem('homePath', homePath);
            break;
        }
      } else {
        console.log('Login failed:', data);
        navigate('/log-fail');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong. Please try again!');
    }
  };

  // === Splash Screen ===
  if (isLoading) {
    return (
      <div className="splash-screen">
        <img src={PilotLogo} alt="logo" className="splash-logo" />
        {/* <h2 className="splash-text">Project Pilot</h2> */}
        <div className="spinner"></div>
        <div className="splash-footer">
          Designed, Developed & Implemented by Pushkar Nashikkar
        </div>
      </div>
    );
  }

  // === Login Page ===
  return (
    <div className='pr fade-in'>
      <div className='top'>
        <img className='logo1' src={logo} alt='logo' />
        <h1>Walchand College of Engineering, Sangli</h1>
        <h2>Department Of Electronics Engineering</h2>
        <h3>Project Management Tool</h3>
      </div>
      <div>
        <form className='form' onSubmit={handleSubmit}>
          <div className='abc'>
            <label>User ID:</label>
            <input
              type='text'
              value={userID}
              onChange={(e) => setuserID(e.target.value)}
              required
            />
          </div>
          <div className='abc'>
            <label>Password:</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='forgot-password'>
            <a href='/auth/forgot-pass'>Forgot Password?</a>
          </div>

          <input type='submit' value='Login' />
        </form>
      </div>
      <footer className='footer'>
        © 2025 Walchand College of Engineering, Sangli. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;
