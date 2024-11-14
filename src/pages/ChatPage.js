import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import gun from '../utils/gunSetup';
import { FaSmile, FaPaperPlane } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react'; // Import the Emoji Picker
import '../assets/css/ChatPage.css';
import { IoChatboxSharp } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import TCACoin from '../assets/images/logos/logo.png';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { RiBnbLine } from "react-icons/ri";

// Binance Smart Chain provider and TCA token setup
const bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const TCA_TOKEN_ADDRESS = '0x31aab810b51f499340fc1e1b08716d2bc92c7a56';
const BEP20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const tcaTokenContract = new ethers.Contract(TCA_TOKEN_ADDRESS, BEP20_ABI, bscProvider);

const ChatPage = ({ account, toggleBlockedModal, handleDeleteChat, openWalletModal, setChatAddress }) => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatAddress = params.get('chatwith');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to control emoji picker visibility
  const [showChatOptions, setShowChatOptions] = useState(false);
  const navigate = useNavigate();
  const [isWalletInfoModalOpen, setIsWalletInfoModalOpen] = useState(false);
  const [balance, setBalance] = useState(0); // Placeholder balance
  const [tcaBalance, setTcaBalance] = useState(0); // TCA token balance

  useEffect(() => {
    if (!chatAddress) {
      console.warn('No chat address provided');
    }
  }, [chatAddress]);

  const handleSendMessage = () => {
    // Logic for sending a message can be added here
    setMessage('');
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const toggleChatOptions = () => setShowChatOptions((prev) => !prev);

  // Updated emoji selection handler
  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };  

  const getBnbBalance = async (chatAddress) => {
    try {
      // Fetch the balance (in Wei)
      const balanceWei = await bscProvider.getBalance(chatAddress);
      
      // Convert the balance from Wei to BNB
      const balanceBnb = ethers.utils.formatEther(balanceWei);
      
      return balanceBnb;
    } catch (error) {
      console.error('Error fetching BNB balance:', error);
      return null;
    }
  };

  // Function to fetch TCA token balance
  const getTcaBalance = async (chatAddress) => {
    try {
      const balance = await tcaTokenContract.balanceOf(chatAddress);
      const decimals = await tcaTokenContract.decimals();
      return ethers.utils.formatUnits(balance, decimals); // Convert balance to readable format
    } catch (error) {
      console.error('Error fetching TCA token balance:', error);
      return null;
    }
  };

  // Simulate fetching wallet balance and transaction count
  // Updated fetchBalanceAndTxns function
  const fetchBalanceAndTxns = async () => {
    try {
      if (chatAddress) {
        const fetchedBalance = await getBnbBalance(chatAddress);
        setBalance(fetchedBalance);

        // Fetch TCA balance
        const tcaTokenBalance = await getTcaBalance(chatAddress);
        setTcaBalance(tcaTokenBalance);

      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

    // Function to toggle wallet modal visibility
    const handleWalletInfo = () => {
      fetchBalanceAndTxns();
      setIsWalletInfoModalOpen(true);
    };

    const closeinfoWalletModal = () => setIsWalletInfoModalOpen(false);
  

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div className="chat-address-info">
            <IoChatboxSharp className="chat-message-icon"/>
          <p className="chat-address">
            {chatAddress.length > 10 ? `${chatAddress.slice(0, 6)}...${chatAddress.slice(-4)}` : chatAddress}
            <br /> 
            <span className="status">offline</span>
          </p>
        </div>
        <button className="chat-options" onClick={toggleChatOptions}><CiMenuKebab /></button>
        {showChatOptions && (
          <div className="chat-options-popup">
            <button onClick={() => {
              setChatAddress(chatAddress); // Pre-fill the chat address
              // Automatically block the chat address by saving to Gun.js
              gun.get(account).get('blockedAddresses').set(chatAddress, (ack) => {
                if (ack.err) {
                  console.error("Failed to block address:", ack.err);
                } else {
                  console.log("Address blocked successfully:", chatAddress);
                }
              });
              toggleBlockedModal(); // Open the block modal
            }}>Block user</button>
            
            <button onClick={() => {
              handleDeleteChat(chatAddress); // Delete the chat
              navigate('/home'); // Redirect to /home after deletion
            }}>Delete Chat</button>
            
            <button onClick={handleWalletInfo}>Wallet info</button>
          </div>
        )}
      </div>
      <div className="chat-body">
        <p className="start-chat-message">... Your new conversation starts here ...</p>
      </div>
      <div className="chat-input-container">
      <FaSmile className="emoji-icon" onClick={toggleEmojiPicker} />
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
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
      {isWalletInfoModalOpen && (
        <div className="wallet-modal-overlay" onClick={() => setIsWalletInfoModalOpen(false)}>
          <div className="wallet-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-info-modal" onClick={(e) => e.stopPropagation()}>
              <div className="wallet-modal-header">
                <h2>My Profile</h2>
                <button className="wallet-close-button" onClick={closeinfoWalletModal}>×</button>
              </div>
              <div className="wallet-details wallet-addr-details">
                <p><strong>Address</strong></p>
                <p className="wallet-address">
                  <a href={`https://bscscan.com/address/${chatAddress}`} target="_blank" rel="noopener noreferrer" className="grdntclr">
                    {chatAddress}
                  </a>
                  <FaExternalLinkAlt className="wallet-address-extlink" />
                </p>
              </div>
              <div className="wallet-stats">
                <div className="wallet-balance">
                  <p>BNB Balance</p>
                  <span className="coins-data">{balance} <RiBnbLine className="bnb-coin-logo"/></span>
                </div>
                <div className="wallet-txns">
                  <p>TCA Balance</p>
                  <span className="coins-data">{tcaBalance} <img src={TCACoin} alt="TCA Coin" className="tca-coin-logo"/></span>
                </div>
              </div>
              <div className="qr-code-section">
                <p><strong>Your QR Code address</strong></p>
                <p>(Safe to share with your contacts)</p>
                <QRCodeCanvas value={chatAddress} size={128} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
