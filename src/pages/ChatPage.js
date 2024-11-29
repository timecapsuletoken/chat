import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import gun from '../utils/gunSetup';
import ChatOptionsMenu from '../components/HomePage/ChatOptionsMenu'; // Adjust path as necessary
import { FaSmile, FaPaperPlane } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react'; // Import the Emoji Picker
import '../assets/css/ChatPage.css';
import TCACoin from '../assets/images/logos/logo.png';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { RiBnbLine } from "react-icons/ri";
import {
  Avatar,
} from '@mui/material';
import { generateJazzicon } from '../utils/jazzAvatar';

// Binance Smart Chain provider and TCA token setup
const bscProvider = new ethers.providers.JsonRpcProvider(`https://bsc-dataseed.binance.org/?_=${Date.now()}`);
const TCA_TOKEN_ADDRESS = '0x31aab810b51f499340fc1e1b08716d2bc92c7a56';
const BEP20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const tcaTokenContract = new ethers.Contract(TCA_TOKEN_ADDRESS, BEP20_ABI, bscProvider);

const ChatPage = ({ account, toggleBlockedModal, handleDeleteChat, formatNumber }) => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatAddress = params.get('chatwith');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to control emoji picker visibility
  const navigate = useNavigate();
  const [isWalletInfoModalOpen, setIsWalletInfoModalOpen] = useState(false);
  const [balance, setBalance] = useState(0); // Placeholder balance
  const [tcaBalance, setTcaBalance] = useState(0); // TCA token balance
  const [blockedAddresses, setBlockedAddresses] = useState([]);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!account) return;

    const fetchBlockedAddresses = async () => {
        console.log("Fetching blocked addresses for account:", account);

        const addresses = [];
        const blockedAddressesNode = gun.get(account).get('blockedAddresses');

        // Fetch the blocked addresses
        blockedAddressesNode.map().once((data, key) => {
            if (data === true) {
                addresses.push(key);
            }
        });

        // Ensure state update after all data is fetched
        setTimeout(() => {
            console.log("Blocked addresses fetched:", addresses);
            setBlockedAddresses([...addresses]);
        }, 100); // Slight delay to allow map() to complete
    };

    fetchBlockedAddresses();
}, [account]);

useEffect(() => {
  if (chatAddress && avatarRef.current) {
    generateJazzicon(chatAddress, avatarRef.current, 40); // Generate a Jazzicon with a diameter of 40px
  }
}, [chatAddress]);

  const isAddressBlocked = blockedAddresses.includes(chatAddress);

  const handleSendMessage = () => {
    // Logic for sending a message can be added here
    setMessage('');
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

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
        setBalance(parseFloat(fetchedBalance));

        // Fetch TCA balance
        const tcaTokenBalance = await getTcaBalance(chatAddress);
        setTcaBalance(parseFloat(tcaTokenBalance));

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
        <Avatar
            className="chatroom-icon"
            ref={avatarRef}
          />
          <p className="chat-address">
            {chatAddress.length > 10 ? `${chatAddress.slice(0, 6)}...${chatAddress.slice(-4)}` : chatAddress}
            <br /> 
            <span className="status">{isAddressBlocked === true ? `Address is Blocked` : 'Ready to Talk'}</span>
          </p>
        </div>
        <ChatOptionsMenu
          account={account}
          chatAddress={chatAddress}
          blockedAddresses={blockedAddresses}
          setBlockedAddresses={setBlockedAddresses}
          gun={gun}
          handleDeleteChat={handleDeleteChat}
          handleWalletInfo={handleWalletInfo}
          toggleBlockedModal={toggleBlockedModal}
          navigate={navigate}
        />
      </div>
      <div className="chat-body">
        <p className="start-chat-message">... Your new conversation is empty ...</p>
      </div>
      <div className="chat-input-container">
      <FaSmile className="emoji-icon" onClick={toggleEmojiPicker} disabled={isAddressBlocked} />
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
          disabled={isAddressBlocked}
        />
        <button className="send-message-btn" onClick={handleSendMessage}>
          <FaPaperPlane disabled={isAddressBlocked} />
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
                  <p>BNB Balance:</p>
                  <span className="coins-data">{formatNumber(balance)} <RiBnbLine className="bnb-coin-logo"/></span>
                </div>
                <div className="wallet-txns">
                  <p>TCA Balance:</p>
                  <span className="coins-data">{formatNumber(tcaBalance)} <img src={TCACoin} alt="TCA Coin" className="tca-coin-logo"/></span>
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
