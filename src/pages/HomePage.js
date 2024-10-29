import React from 'react';

const HomePage = ({ account, connectWallet, disconnectWallet }) => {
  return (
    <div className="home-container">
      <h2>Welcome to Blockscan Chat</h2>

      {account ? (
        <div className="wallet-info">
          <p>Connected Account: <strong>{account}</strong></p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <div className="connect-prompt">
          <p>No wallet connected.</p>
          <button onClick={() => connectWallet('MetaMask')}>Connect MetaMask</button>
          <button onClick={() => connectWallet('CoinbaseWallet')}>Connect Coinbase Wallet</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
