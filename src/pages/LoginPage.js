import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from 'animated-backgrounds';
import { motion } from 'framer-motion';
import '../assets/css/LoginPage.css';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import metamaskIcon from '../assets/images/logos/metamask.svg';
import coinbaseIcon from '../assets/images/logos/coinbase.svg';

const LoginPage = ({ connectWallet, account }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (account) {
      localStorage.setItem('connectedAccount', account);
      localStorage.getItem('providerType');      
      navigate('/home');
    }
  }, [account, navigate]);

    // Handler for connecting wallets
    const handleConnectWallet = async (providerType) => {
      setLoading(true); // Set loading state to true
      try {
        await connectWallet(providerType); // Call the connectWallet function
      } catch (error) {
        console.error('Error connecting wallet:', error);
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
      <div className="login-container">
      <AnimatedBackground animationName="quantumField" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }} />
        <div className="header">
          <h2>Login to TimeCapsule Chat</h2>
          <p>Connect with your web3 based wallet and sign-in</p>
        </div>
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
          <Typography variant="body2" color="info" style={{ marginTop: '8px' }}>
            <strong>Note:</strong> Ensure Binance Smart Chain is enabled in your wallet. If not, you will be prompted to add it.
          </Typography>
          <Typography variant="body2" color="gray">
            By connecting your wallet and signing a message, you agree to our{' '}
            <Link href="#terms" underline="hover">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="#privacy" underline="hover">
              Privacy Policy
            </Link>.
          </Typography>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LoginPage;
