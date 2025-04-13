import React, { useState } from 'react';
import './css/otpReceiver.css';

const OTPReceiver = () => {
  const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', '']);
  const [mobileOTP, setMobileOTP] = useState(['', '', '', '', '', '']);
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const handleChange = (e, index, type) => {
    const value = e.target.value;
    const otp = type === 'email' ? [...emailOTP] : [...mobileOTP];
    otp[index] = value.slice(0, 1); // Allow only one digit per box

    if (type === 'email') {
      setEmailOTP(otp);
    } else {
      setMobileOTP(otp);
    }

    if (value && index < 5) {
      // Auto-focus next input
      document.getElementById(`${type}-otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailOtpString = emailOTP.join('');
    const mobileOtpString = mobileOTP.join('');

    if (emailOtpString.length !== 6 || mobileOtpString.length !== 6) {
      if (emailOtpString.length !== 6) setEmailError('Please enter a valid 6-digit email OTP');
      if (mobileOtpString.length !== 6) setMobileError('Please enter a valid 6-digit mobile OTP');
    } else {
      // Proceed with OTP verification logic
      alert('OTP Verified Successfully');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify Your OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="otp-field">
            <label>Email OTP</label>
            <div className="otp-box-container">
              {emailOTP.map((digit, index) => (
                <input
                  id={`email-otp-${index}`}
                  key={`email-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e, index, 'email')}
                  maxLength="1"
                  className="otp-box"
                  placeholder="-"
                />
              ))}
            </div>
            {emailError && <p className="error">{emailError}</p>}
          </div>

          <div className="otp-field">
            <label>Mobile OTP</label>
            <div className="otp-box-container">
              {mobileOTP.map((digit, index) => (
                <input
                  id={`mobile-otp-${index}`}
                  key={`mobile-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e, index, 'mobile')}
                  maxLength="1"
                  className="otp-box"
                  placeholder="-"
                />
              ))}
            </div>
            {mobileError && <p className="error">{mobileError}</p>}
          </div>

          <button type="submit" className="primary">Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default OTPReceiver;
