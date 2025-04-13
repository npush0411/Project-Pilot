import React, { useState } from 'react';
import logo from '../images/logo.png';
import './css/land.css';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [userID, setuserID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data to be sent in request body
      const bodyData = JSON.stringify({
        userID,
        password
      });

      const res = await fetch("http://localhost:4000/api/v1/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure Content-Type is correct
        },
        body: bodyData, // Pass data here
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        localStorage.setItem('token', data.token);
        if (data.user.role === 'Admin') {
          navigate('/admin-dashboard');
        } else if(data.user.role == 'Manager'){
          navigate('/manager-dashboard');
        }else if(data.user.role == 'Instructor'){
          navigate('/instructor-dashboard');
        }else{
          navigate('/user-dashboard');
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

  return (
    <div className='pr'>
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
          <input type='submit' value='Login' />
        </form>
      </div>
      <footer className='footer'>
        © 2025 Walchand College of Engineering, Sangli. All rights reserved.
      </footer>
    </div>
  );
}
export default Landing;