import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import gun from '../utils/gunSetup';
import 'gun/lib/webrtc'; // Real-time peer connections (if needed)
import { encryptMessage, decryptMessage } from '../utils/cryptographer';
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

const ChatPage = ({ account, toggleBlockedModal, deleteChat, formatNumber }) => {
  const [messages, setMessages] = useState([]); // All chat messages
  const [message, setMessage] = useState(''); // Current input message

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
  const chatBodyRef = useRef(null); // Reference for the chat-body container
  const processedMessageIds = useRef(new Set()); // Use ref to track processed messages
  const isAddressBlocked = blockedAddresses.includes(chatAddress);

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
    if (!chatAddress || !account) return;

    console.log('Subscribing to messages for chatAddress:', chatAddress);

    // Clear messages and processed IDs when switching chats
    setMessages([]);
    processedMessageIds.current.clear();

    if (chatAddress && avatarRef.current) {
        generateJazzicon(chatAddress, avatarRef.current, 40); // Generate Jazzicon for the chat
    }

    const chatNode = gun.get(`chats/${account}/messages`); // Sender's messages
    const receiverNode = gun.get(`chats/${chatAddress}/messages`); // Receiver's messages

    const processMessage = async (message, id, source) => {
        if (!message || processedMessageIds.current.has(id)) return; // Skip duplicates
        processedMessageIds.current.add(id);

        try {
            // Ensure message belongs to the current chat
            if (
                (source === 'receiver' && message.sender !== account) ||
                (source === 'sender' && message.sender !== chatAddress)
            ) {
                return; // Ignore messages not related to the current chat
            }

            const decryptedContent = decryptMessage(
                message.content,
                message.sender,
                message.sender === account ? chatAddress : account
            );
            const processedMessage = { ...message, content: decryptedContent || '[Unable to decrypt]', id };

            console.log(`[DEBUG] Processed message from ${source}:`, processedMessage);
            setMessages((prev) =>
                [...prev, processedMessage].sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp
            );
        } catch (error) {
            console.error(`[DEBUG] Decryption failed for message ID: ${id}`, error);
            setMessages((prev) =>
                [...prev, { ...message, content: '[Unable to decrypt]', id }].sort((a, b) => a.timestamp - b.timestamp)
            );
        }
    };

    const fetchMessages = async () => {
        // Fetch messages for the current chat from both sender and receiver nodes
        const senderMessages = await gun.get(`chats/${account}/messages`).once();
        const receiverMessages = await gun.get(`chats/${chatAddress}/messages`).once();

        // Combine and process fetched messages
        Object.entries(senderMessages || {}).forEach(([id, message]) =>
            processMessage(message, id, 'sender')
        );
        Object.entries(receiverMessages || {}).forEach(([id, message]) =>
            processMessage(message, id, 'receiver')
        );
    };

    fetchMessages();

    const senderListener = chatNode.map().on((message, id) => processMessage(message, id, 'sender'));
    const receiverListener = receiverNode.map().on((message, id) => processMessage(message, id, 'receiver'));

    return () => {
        senderListener.off();
        receiverListener.off();
    };
  }, [account, chatAddress]);
  
  useEffect(() => {
    if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    console.log('[DEBUG] Sending message:', message);

    const encryptedMessage = encryptMessage(message);
    console.log('[DEBUG] Encrypted message:', encryptedMessage);

    const newMessage = {
        sender: account,
        content: encryptedMessage,
        timestamp: Date.now(),
    };

    // Save the encrypted message to Gun.js
    gun.get(`chats/${chatAddress}/messages`).set(newMessage);

    // Clear the input field
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
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent default behavior of Enter
        handleSendMessage(); // Send the message
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // Prevent default behavior
        setMessage((prevMessage) => `${prevMessage}\n`); // Add a new line
      }
    };    
    
    const adjustHeight = (e) => {
      const element = e.target;
      element.style.height = "40px"; // Reset height
      element.style.height = `${element.scrollHeight}px`; // Adjust to content
    };

    const reversedMessages = [...messages].reverse();

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
          deleteChat={deleteChat}
          handleWalletInfo={handleWalletInfo}
          toggleBlockedModal={toggleBlockedModal}
          navigate={navigate}
        />
      </div>
      <div className="chat-container">
      <div className="chat-body" ref={chatBodyRef}>
        {reversedMessages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender === account ? 'sent-wrapper' : 'received-wrapper'}`}>
            <div
              className="message-avatar"
              ref={(el) => {
                if (el) generateJazzicon(msg.sender, el, 20); // Generate avatar for each sender/receiver
              }}
            />
            <div className={`message ${msg.sender === account ? 'sent' : 'received'}`}>
              <p>{msg.content}</p>
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
      </div>
      <div className="chat-input-container">
      <FaSmile className="emoji-icon" onClick={toggleEmojiPicker} disabled={isAddressBlocked} />
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
         <textarea
          className="chat-input"
          placeholder="Your Message Goes in Here"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustHeight(e);
          }}      
          onKeyDown={(e) => handleKeyDown(e)}
          disabled={isAddressBlocked}
        />
        <button className="send-message-btn" onClick={handleSendMessage}>
          <FaPaperPlane disabled={isAddressBlocked} />
        </button>
      </div>
      <p className="input-hint">
        <span>Decentralized Communication</span> (<span>BETA</span>) v1.00.0
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
