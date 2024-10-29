import React from 'react';
import '../assets/css/Navbar.css';
import TCALogo from '../assets/images/logos/logo.png';

const Navbar = ({ onConnect }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={TCALogo} alt="Logo" className="logo" />
        <span className="app-name">TimeCapsule</span>
        <span className="beta-tag">Beta</span>
      </div>
      <a className="connect-button" href='/login'>
        Connect Wallet
      </a>
    </nav>
  );
};

export default Navbar;
