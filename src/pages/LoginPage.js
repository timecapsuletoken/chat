import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from 'animated-backgrounds';
import '../assets/css/LoginPage.css';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import metamaskIcon from '../assets/images/logos/metamask.svg';
import coinbaseIcon from '../assets/images/logos/coinbase.svg';

const LoginPage = ({ connectWallet, account }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      localStorage.setItem('connectedAccount', account);
      const savedProvider = localStorage.getItem('providerType');
      console.log('LoginPage Provider:', savedProvider);
      navigate('/home'); // Redirect to /home when account is connected
    }
  }, [account, navigate]);

  return (
    <div className="login-container">
    <AnimatedBackground animationName="quantumField" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }} />
      <div className="header">
        <h2>Login to TimeCapsule Chat</h2>
        <p>Connect with your web3 based wallet and sign-in</p>
      </div>
      <div className="wallet-options">
        <button onClick={() => connectWallet('MetaMask')} className="wallet-option">
          <img src={metamaskIcon} alt="MetaMask" />
          <div className='wallet-texts'>
            <h3 className="wallet-title">MetaMask</h3>
            <p>Connect using a browser plugin or mobile app. Best supported on Chrome or Firefox.</p>
          </div>
        </button>
        <button onClick={() => connectWallet('CoinbaseWallet')} className="wallet-option">
          <img src={coinbaseIcon} alt="Coinbase" />
          <div className='wallet-texts'>
            <h3 className="wallet-title">Coinbase Wallet</h3>
            <p>Connect with Coinbase Wallet browser extension or mobile app. Best supported on Chrome.</p>
          </div>
        </button>
      </div>
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
  );
};

export default LoginPage;
