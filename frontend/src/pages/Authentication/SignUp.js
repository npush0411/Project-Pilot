import React, { useState } from 'react';
import logo from '../../images/logo.png';
import './signup.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
 
function SignUp() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const passingYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userID: '',
    contactNumber: '',
    email: '',
    password: '',
    cPassword: '',
    accountType: '',
    batch: '',
    passingYear: '',
    academicYear: '',
    otp: ''
  });

  const [error, setError] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'accountType' && value !== 'Student') {
      setFormData((prev) => ({
        ...prev,
        accountType: value,
        batch: '',
        passingYear: '',
        academicYear: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }
    console.log(BASE_URL);
    try {
      const res = await fetch(`${BASE_URL}/auth/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const result = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setShowOtpInput(true);
        setError('');
      } else {
        setError(result.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Something went wrong while sending OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/sign-suc');
      } else {
        navigate('/sign-fail');
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  return (
    <div className='signup-container'>
      <header className='signup-header'>
        <img src={logo} alt='Logo' className='signup-logo' />
        <h1>Walchand College of Engineering, Sangli</h1>
        <h2>Department Of Electronics Engineering</h2>
        <h3>Project Management Tool</h3>
      </header>

      <form className='signup-form' onSubmit={handleSubmit}>
        {[{ label: 'First Name', name: 'firstName', type: 'text' },
          { label: 'Last Name', name: 'lastName', type: 'text' },
          { label: 'User ID', name: 'userID', type: 'number' },
          { label: 'Contact Number', name: 'contactNumber', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Confirm Password', name: 'cPassword', type: 'password' }
        ].map((field) => (
          <div className='form-group' key={field.name}>
            <label>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className='form-group'>
          <label>Account Type:</label>
          <select name='accountType' value={formData.accountType} onChange={handleChange} required>
            <option value=''>-- Select Role --</option>
            <option value='Student'>Student</option>
            <option value='Instructor'>Instructor</option>
            <option value='Admin'>Admin</option>
            <option value='Manager'>Manager</option>
          </select>
        </div>

        {formData.accountType === 'Student' && (
          <>
            <div className='form-group'>
              <label>Batch (EN-):</label>
              <select name='batch' value={formData.batch} onChange={handleChange} required>
                <option value=''>-- Select Batch --</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={`EN-${num}`}>{`EN-${num}`}</option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Passing Year:</label>
              <select name='passingYear' value={formData.passingYear} onChange={handleChange} required>
                <option value=''>-- Select Year --</option>
                {passingYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Academic Year:</label>
              <select name='academicYear' value={formData.academicYear} onChange={handleChange} required>
                <option value=''>-- Select Academic Year --</option>
                {[1, 2, 3, 4].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {showOtpInput && (
  <>
    <p className='otp-success-msg'>OTP sent successfully! Please check your email.</p>
    <div className='form-group'>
      <label>Enter OTP:</label>
      <input
        type='text'
        name='otp'
        maxLength='6'
        value={formData.otp}
        onChange={handleChange}
        className='otp-input-box'
        placeholder='6-character OTP'
        required
      />
    </div>
  </>
)}


        {error && <p className='error-text'>{error}</p>}

        {!otpSent ? (
          <button type='button' className='signup-button' onClick={handleSendOTP}>
            Verify Email
          </button>
        ) : (
          <input type='submit' value='Verify & Register' className='signup-button' />
        )}
      </form>

      <footer className='signup-footer'>
        © 2025 Walchand College of Engineering, Sangli. All rights reserved.
      </footer>
    </div>
  );
}

export default SignUp;
