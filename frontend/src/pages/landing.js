import React, { useState } from 'react';
import logo from '../images/logo.png';
import './css/land.css';
import {useNavigate} from 'react-router-dom';
// require('dotenv').config();
function Landing() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await fetch("http://localhost:5000/api/login", {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                userId, password
            })
        });

        const data = await res.json();

        if(res.ok){
            localStorage.setItem('token', data.token);
            if(data.role == 'admin')
                navigate('/admin-dashboard');
            else
                navigate('/user-dashboard');
        }
        else
            navigate('/log-fail');
        
    }catch(error){
        console.log(error);
        console.log('Something went wrong');
    }
    console.log('User ID:', userId);
    console.log('Password:', password);
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
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
