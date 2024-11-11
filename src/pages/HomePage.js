import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../assets/css/HomePage.css';
import { FaPowerOff, FaWallet, FaCogs, FaInfoCircle, FaQuestionCircle, FaTimes, FaBars } from 'react-icons/fa';
import { CiMenuKebab } from "react-icons/ci";
import { LuMessageSquarePlus } from "react-icons/lu";
import { MdHome } from "react-icons/md";
import { IoClose } from 'react-icons/io5';
import ChatPage from './ChatPage';
import { QRCodeCanvas } from 'qrcode.react';
import { IoChatboxSharp } from "react-icons/io5";

const bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

const HomePage = ({ account, disconnectWallet }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility
  const [chatAddress, setChatAddress] = useState('');
  const currentChat = searchParams.get('chatwith');
  const [chats, setChats] = useState([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false); // State for wallet modal
  const [balance, setBalance] = useState(0); // Placeholder balance
  const [txnCount, setTxnCount] = useState(0); // Placeholder txn count

  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedAccount');
    if (!account && !savedAccount) {
      setChats([]);
      navigate('/login');
    } 
    
    const savedChats = JSON.parse(localStorage.getItem(`chats_${account}`)) || [];
    setChats(savedChats);
  
  }, [account, navigate]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
      setShowModal(false);
  };

    // Function to toggle wallet modal visibility
    const openWalletModal = () => {
      fetchBalanceAndTxns();
      setIsWalletModalOpen(true);
    };
  
    const closeWalletModal = () => setIsWalletModalOpen(false);

    const getBnbBalance = async (address) => {
      try {
        // Fetch the balance (in Wei)
        const balanceWei = await bscProvider.getBalance(address);
        
        // Convert the balance from Wei to BNB
        const balanceBnb = ethers.utils.formatEther(balanceWei);
        
        return balanceBnb;
      } catch (error) {
        console.error('Error fetching BNB balance:', error);
        return null;
      }
    };    
  
    // Simulate fetching wallet balance and transaction count
    // Updated fetchBalanceAndTxns function
    const fetchBalanceAndTxns = async () => {
      try {
        if (account) {
          const fetchedBalance = await getBnbBalance(account);
          setBalance(fetchedBalance);
          // Replace with actual transaction count fetching if needed
          setTxnCount(0); // Placeholder transaction count
        }
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      }
    };

  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar state:", !isSidebarOpen); // Log state to check toggle
  };

   // Function to close sidebar
   const closeSidebar = () => {
    if (window.innerWidth <= 768) { // Check if on mobile
      setIsSidebarOpen(false);
    }
  };

  const handleStartChat = () => {
    if (chatAddress.trim()) {
      const updatedChats = [...new Set([...chats, chatAddress])]; // Avoid duplicate addresses
      setChats(updatedChats);
      localStorage.setItem(`chats_${account}`, JSON.stringify(updatedChats)); // Save with account context
      setSearchParams({ chatwith: chatAddress });
      setShowModal(false);
    }
  };

  const handleChatItemClick = (chatAddress) => {
    setSearchParams({ chatwith: chatAddress });
  };

  const handleDeleteChat = (chatToDelete) => {
    const updatedChats = chats.filter((chat) => chat !== chatToDelete);
    setChats(updatedChats);
    localStorage.setItem(`chats_${account}`, JSON.stringify(updatedChats)); // Save updated list
    };  

  return (
    <div className="home-container">
        <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''} ${showDropdown ? 'no-scroll' : ''}`}>
            <div className="wallet-header">
              <div className="sidebar-icon waddr" onClick={openWalletModal}>
                <p><FaWallet /> <span className="wallet-addr">{account ? `| ${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}</span></p>
              </div>
            </div>
            <div className="sidebar-content">
              {isSidebarOpen && (
              <div className="sidebar-icon" style={{ backgroundColor: isSidebarOpen ? '#007bff' : 'inherit' }}>
                <button 
                  className={`sidebar-toggle-inside ${isSidebarOpen ? 'open' : ''}`} 
                  onClick={toggleSidebar}
                  >
                    <FaBars />
                </button>
              </div>
              )}
                <div className="sidebar-icon">
                  <a href="/home"><MdHome /></a>
                </div>
                <div className="sidebar-icon">
                  <button className="new-message" onClick={handleOpenModal}><LuMessageSquarePlus /></button>
                </div>
                  <div className="sidebar-icon">
                    <button onClick={toggleDropdown}><CiMenuKebab /></button>
                  </div>
                  <div className="dropdown-container">
                    {showDropdown && (
                        <div className="dropdown-menu">
                          <div className="dropdown-item">
                              <FaCogs className="dropdown-icon" />
                              <span>Settings</span>
                          </div>
                          <div className="dropdown-item">
                              <FaInfoCircle className="dropdown-icon" />
                              <span>About</span>
                          </div>
                          <div className="dropdown-item">
                              <FaQuestionCircle className="dropdown-icon" />
                              <span>Help</span>
                          </div>
                          <div className="dropdown-item">
                            <button className="disconnect-button" onClick={() => {
                              disconnectWallet();
                              navigate('/login');
                            }}><FaPowerOff /> <span>Logout</span></button>
                          </div>
                        </div>
                    )}
                </div>
              </div>
            <div className="chat-list">
              {chats.length > 0 ? (
                chats.map((address, index) => (
                  <div 
                    key={index}
                    className="chat-item"
                    onClick={() => {
                      handleChatItemClick(address); // Handle chat item click
                      closeSidebar(); // Close the sidebar on mobile
                    }}
                  >
                    <IoChatboxSharp className="chat-message-icon"/>
                    
                    <p className="chat-address-sidebar">
                      {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
                    </p>
                    <FaTimes
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the parent click event
                        handleDeleteChat(address);
                      }}
                      title="Delete chat"
                      style={{ marginLeft: 'auto', cursor: 'pointer' }}
                    />
                  </div>
                ))
              ) : (
                <div className="empty-chat">
                  <p className="head-empty-chat">Your chat is empty!</p>
                  <p className="body-empty-chat">Once you start a new conversation, you'll see the address lists here.</p>
                </div>
              )}
            </div>
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                      <h2>Start New Chat</h2>
                      <button className="close-button" onClick={handleCloseModal}>
                          <IoClose />
                      </button>
                  </div>
                  <p>Enter an address (or .bnb name) to start a new chat</p>
                  <input 
                    type="text"
                    placeholder="e.g. 0x... or name.bnb"
                    className="modal-input"
                    value={chatAddress}
                    onChange={(e) => setChatAddress(e.target.value)}                          
                  />
                  <button className="start-chat-button" onClick={() => {
                      handleStartChat(); // Handle chat item click
                      closeSidebar(); // Close the sidebar on mobile
                    }}>
                      <LuMessageSquarePlus /> Start Chatting
                  </button>
              </div>
          </div>
        )}
      {isWalletModalOpen && (
        <div className="wallet-modal-overlay" onClick={closeWalletModal}>
          <div className="wallet-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h2>My Profile</h2>
              <button className="wallet-close-button" onClick={closeWalletModal}>×</button>
            </div>
            <div className="wallet-details">
              <p><strong>Address</strong></p>
              <p className="wallet-address"><FaWallet /> {account}</p>
            </div>
            <div className="wallet-stats">
              <div className="wallet-balance">
                <p>Balance</p>
                <span>{balance} BNB</span>
              </div>
              <div className="wallet-txns">
                <p>Txns Sent</p>
                <span>{txnCount}</span>
              </div>
            </div>
            <div className="qr-code-section">
              <p><strong>Your QR Code address</strong></p>
              <p>(Safe to share with your contacts)</p>
              <QRCodeCanvas value={account} size={128} />
            </div>
          </div>
        </div>
      )}
      <div className="main-content">
      {!isSidebarOpen && (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FaBars /> <span>Menu</span>
          </button>
        )}
      {currentChat ? (
          <ChatPage account={account} />
        ) : (
          <>
            <div className="welcome-card">
              <h2>Welcome to <span className="logo-text">TimeCapsule Chat</span> <span className="beta-tag">Beta</span></h2>
              <p>Built for users that Value their Privacy, TimeCapsule Chat is a messaging platform for users to simply and instantly message each other, wallet-to-wallet.</p>
              <a href="/faqs" className="faq-link">Check out our FAQs for more details.</a>
            </div>
            <div className="important-card">
              <h3>❗ Important!</h3>
              <p>Never share your confidential information, passwords, private keys, or seed phrases with ANYONE! Be extra careful when receiving any external links or online forms. Always keep an eye out for malicious parties in the Dark Forest 👀</p>
            </div>
            <button className="start-conversation-btn" onClick={handleOpenModal}>+ Start new conversation</button>
           </>
        )}
        </div>
    </div>
  );
};

export default HomePage;
