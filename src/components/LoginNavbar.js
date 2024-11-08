import React from 'react';
import '../assets/css/LoginNavbar.css';
import TCALogo from '../assets/images/logos/logo.png';
import { FaArrowLeft } from "react-icons/fa";

const LoginNavbar = ({ onConnect }) => {
  return (
    <nav className="login-navbar">
      <div className="login-navbar-left">
        <img src={TCALogo} alt="Logo" className="logo" />
        <span className="app-name">TimeCapsule</span>
        <span className="beta-tag">Beta</span>
      </div>
      <a className="connect-button" href='/'>
      <span><FaArrowLeft /></span> Home
      </a>
    </nav>
  );
};

export default LoginNavbar;
