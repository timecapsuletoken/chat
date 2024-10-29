import React from 'react';
import '../assets/css/LoginPage.css';
import metamaskIcon from '../assets/images/logos/metamask.svg';
import coinbaseIcon from '../assets/images/logos/coinbase.svg';

const LoginPage = ({ connectWallet }) => {

  return (
    <div className="login-container">
      <div className="header">
        <h2>Login to Blockscan Chat</h2>
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
      <div className="terms">
        By connecting your wallet and signing a message, you agree to our <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default LoginPage;
