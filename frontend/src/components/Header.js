import React from 'react';
import logo from '../images/logo.png';

function Header() {
  return (
    <header className='create-project-header'>
      <img src={logo} alt='Logo' className='create-project-logo' />
      <h1>Walchand College of Engineering, Sangli</h1>
      <h2>Department Of Electronics Engineering</h2>
      <h3>Project Management Tool</h3>
    </header>
  );
}

export default Header;
