import React from 'react';
import '../assets/css/LoginNavbar.css';
import TCALogo from '../assets/images/logos/logo.png';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginNavbar = ({ onConnect }) => {
    const navigate = useNavigate();
  
  return (
    <nav className="login-navbar">
      <div className="login-navbar-left">
        <img src={TCALogo} alt="Logo" className="logo" />
        <span className="app-name">TimeCapsule</span>
        <span className="beta-tag">Beta</span>
      </div>
      <Button 
        variant="outlined" 
        startIcon={<FaArrowLeft />} 
        onClick={() => navigate('/')} // Correct usage of navigate
        sx={{
          color: '#a001f2', // Text color
          borderColor: '#a001f2', // Border color 
          '&:hover': {
            color: '#1ccad8', // Border color on hover
            borderColor: '#1ccad8', // Background color on hover
          },
        }}      
      >
        Home
      </Button>
    </nav>
  );
};

export default LoginNavbar;
