import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSmile, FaPaperPlane } from 'react-icons/fa';
import '../assets/css/ChatPage.css';
import { IoChatboxSharp } from "react-icons/io5";

const ChatPage = ({ account }) => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatAddress = params.get('chatwith');

  useEffect(() => {
    if (!chatAddress) {
      console.warn('No chat address provided');
    }
  }, [chatAddress]);

  const handleSendMessage = () => {
    // Logic for sending a message can be added here
    setMessage('');
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div className="chat-address-info">
            <IoChatboxSharp />
          <p className="chat-address">
            {chatAddress ? `${chatAddress.slice(0, 6)}...${chatAddress.slice(-4)}` : 'No Address'}
            <br /> 
            <span className="status">offline</span>
          </p>
        </div>
        <button className="chat-options">...</button>
      </div>
      <div className="chat-body">
        <p className="start-chat-message">... Your new conversation starts here ...</p>
      </div>
      <div className="chat-input-container">
        <FaSmile className="emoji-icon" />
        <input
          type="text"
          className="chat-input"
          placeholder="Your Message Goes in Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-message-btn" onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
      <p className="input-hint">
        <span>Enter</span> To send, <span>Shift + Enter</span> To add a New line
      </p>
    </div>
  );
};

export default ChatPage;
