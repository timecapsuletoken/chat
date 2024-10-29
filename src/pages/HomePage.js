import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ account, disconnectWallet }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      navigate('/login');
    }
  }, [account, navigate]);

  return (
    <div className="home-container">
      <h2>Welcome to Blockscan Chat</h2>

      {account && (
        <div className="wallet-info">
      <p>Connected Wallet Address: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}</p>
      <button onClick={() => { 
        disconnectWallet(); 
        navigate('/login'); 
        }}>
          Disconnect Wallet
      </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
