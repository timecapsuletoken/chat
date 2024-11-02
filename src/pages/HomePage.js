import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/HomePage.css';
import { FaPowerOff,FaWallet } from 'react-icons/fa';
import { MdFormatListBulleted } from "react-icons/md";

const HomePage = ({ account, disconnectWallet }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedAccount');
    if (!account && !savedAccount) {
      navigate('/login');
    }
  }, [account, navigate]);

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="wallet-header">
          <p><FaWallet /> <span className="wallet-addr">{account ? `| ${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}</span></p>
          <div className="wallet-controls">
            <button onClick={() => {
              disconnectWallet();
              navigate('/login');
            }}><FaPowerOff /></button>
            <button><MdFormatListBulleted /></button>
          </div>
        </div>
        <div className="chat-list">
          {/* Add placeholder for empty chat */}
          <div className="empty-chat">
            <p className="head-empty-chat">Your chat is empty!</p>
            <p className="body-empty-chat">Once you start a new conversation, you'll see the address lists here.</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="welcome-card">
          <h2>Welcome to <span className="logo-text">TimeCapsule Chat</span> <span className="beta-tag">Beta</span></h2>
          <p>Built for Etherscan users, Blockscan Chat is a messaging platform for users to simply and instantly message each other, wallet-to-wallet.</p>
          <a href="/faqs" className="faq-link">Check out our FAQs for more details.</a>
        </div>
        
        <div className="important-card">
          <h3>❗ Important!</h3>
          <p>Never share your confidential information, passwords, private keys, or seed phrases with ANYONE! Be extra careful when receiving any external links or online forms. Always keep an eye out for malicious parties in the Dark Forest 👀</p>
        </div>

        <button className="start-conversation-btn">+ Start new conversation</button>
      </div>
    </div>
  );
};

export default HomePage;
