import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from 'animated-backgrounds';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { Box, Link, Typography, Stack, Avatar, Button } from '@mui/material';
import metamaskIcon from '../assets/images/logos/metamask.svg';
import coinbaseIcon from '../assets/images/logos/coinbase.svg';
import TCALogo from '../assets/images/logos/logo.png';
import { FaArrowLeft } from "react-icons/fa";
import '../assets/css/LoginNavbar.css';
import '../assets/css/LoginPage.css';

const LoginPage = ({ connectWallet, account }) => {
  //const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) return; // Only navigate if account is set
    const storedAccount = localStorage.getItem('connectedAccount');
    
    if (storedAccount && storedAccount === account) {
      localStorage.setItem('connectedAccount', account);
      localStorage.getItem('providerType');      
      // Navigate only if the stored account matches the current account
      //navigate('/home');
    }
  }, [account]);  

    // Handler for connecting wallets
    const handleConnectWallet = async (providerType) => {
      setLoading(true); // Set loading state to true
      try {
        await connectWallet(providerType); // Call the connectWallet function
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error connecting wallet:', error);
        }
      } finally {
        setLoading(false); // Reset loading state
      }
    };  

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login - TimeCapsule Chat</title>
        <meta name="description" content="Log in to TimeCapsule Chat and experience secure, decentralized communication. Connect your Web3 wallet to start chatting." />
        <meta name="keywords" content="TimeCapsule Chat login, Web3 wallet login, secure decentralized chat" />
        <meta name="author" content="TimeCapsule Team" />        
      </Helmet>
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
      <div className="login-container">
      <AnimatedBackground animationName="starryNight" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }} />
        <Box
          sx={{
            textAlign: 'center', // Centers the content horizontally
            padding: 2, // Adds padding around the header
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h6" color="white">
              Login to
            </Typography>
            <Avatar alt="TimeCapsule Chat" src={TCALogo} />
            <Typography variant="h6" color="white">
              <Typewriter
                words={['Decentralized', 'TimeCapsule Chat']}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            color="white"
            sx={{ marginTop: 1 }} // Adds spacing between the stack and the text
          >
            Connect with your web3-based wallet and sign-in
          </Typography>
        </Box>
        {loading ? (
          // Show loading spinner when loading
          <motion.div
            className="loading-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          >
            <div className="spinner-circle"></div>
          </motion.div>
        ) : (
          <div className="wallet-options">
            <button onClick={() => handleConnectWallet('MetaMask')} className="wallet-option">
              <img src={metamaskIcon} alt="MetaMask" />
              <div className='wallet-texts'>
                <h3 className="wallet-title">MetaMask</h3>
                <p>Connect using a browser plugin or mobile app. Best supported on Chrome or Firefox.</p>
              </div>
            </button>
            <button onClick={() => handleConnectWallet('CoinbaseWallet')} className="wallet-option">
              <img src={coinbaseIcon} alt="Coinbase" />
              <div className='wallet-texts'>
                <h3 className="wallet-title">Coinbase Wallet</h3>
                <p>Connect with Coinbase Wallet browser extension or mobile app. Best supported on Chrome.</p>
              </div>
            </button>
          </div>
        )}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Typography variant="body2" color="gray">
            By connecting your wallet and signing a message, you agree to our{' '}
            <Link target="_blank" href="/terms-and-conditions" underline="hover">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link target="_blank" href="/privacy-policy" underline="hover">
              Privacy Policy
            </Link>.
          </Typography>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LoginPage;
