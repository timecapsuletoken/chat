import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../assets/css/HomePage.css';
import { FaPowerOff, FaWallet, FaCogs, FaInfoCircle, FaQuestionCircle, FaTimes, FaBars, FaExternalLinkAlt } from 'react-icons/fa';
import { CiMenuKebab } from "react-icons/ci";
import { LuMessageSquarePlus } from "react-icons/lu";
import { MdHome } from "react-icons/md";
import { IoClose } from 'react-icons/io5';
import ChatPage from './ChatPage';
import { QRCodeCanvas } from 'qrcode.react';
import { IoChatboxSharp } from "react-icons/io5";
import { RiBnbLine } from "react-icons/ri";
import gun from '../utils/gunSetup';
import TCACoin from '../assets/images/logos/logo.png';

// Binance Smart Chain provider and TCA token setup
const bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const TCA_TOKEN_ADDRESS = '0x31aab810b51f499340fc1e1b08716d2bc92c7a56';
const BEP20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const tcaTokenContract = new ethers.Contract(TCA_TOKEN_ADDRESS, BEP20_ABI, bscProvider);


const HomePage = ({ account, disconnectWallet }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility
  const [chatAddress, setChatAddress] = useState('');
  const currentChat = searchParams.get('chatwith');
  const [chats, setChats] = useState([]);
  const [balance, setBalance] = useState(0); // Placeholder balance
  const [tcaBalance, setTcaBalance] = useState(0); // TCA token balance
  const [isHovered, setIsHovered] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false); // State for wallet modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(false);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false);
  const [blockedAddresses, setBlockedAddresses] = useState([]);

  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  const fetchSettings = useCallback(() => {
    if (account) {
      console.log("Fetching settings for account:", account);
  
      // Attempt to fetch data with a retry mechanism
      const attemptFetch = (retry = 0) => {
        gun.get(account).once((data) => {
          if (data && Object.keys(data).length > 1) {
            console.log("Fetched data from Gun:", data);
  
            setNotificationsEnabled(data.notificationsEnabled || false);
            setSoundAlertsEnabled(data.soundAlertsEnabled || false);
            setDesktopNotificationsEnabled(data.desktopNotificationsEnabled || false);
  
            const blockedArray = data.blockedAddresses ? Object.keys(data.blockedAddresses) : [];
            console.log("Blocked addresses loaded:", blockedArray);
            setBlockedAddresses(blockedArray);
          } else {
            console.log("No data found for this account in Gun.");
  
            // Retry fetching if data is empty, up to 3 attempts
            if (retry < 3) {
              console.log(`Retrying fetch attempt ${retry + 1}...`);
              setTimeout(() => attemptFetch(retry + 1), 1000); // Retry after 1 second
            }
          }
        });
      };
  
      attemptFetch();
    }
  }, [account]);  

  const handleSaveSettings = () => {
    const settings = {
      notificationsEnabled,
      soundAlertsEnabled,
      desktopNotificationsEnabled,
      blockedAddresses: blockedAddresses.reduce((acc, addr) => {
        acc[addr] = true; // Convert array to object for Gun
        return acc;
      }, {}),
    };
  
    console.log("Attempting to save settings:", settings);
  
    gun.get(account).put(settings, (ack) => {
      if (ack.err) {
        console.error("Failed to save settings:", ack.err);
      } else {
        console.log("Settings saved successfully:", settings);
      }
    });
  };  

  const handleToggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const handleToggleSoundAlerts = () => setSoundAlertsEnabled((prev) => !prev);
  const handleToggleDesktopNotifications = () => setDesktopNotificationsEnabled((prev) => !prev);

  const handleBlockAddress = (address) => {
    if (address && !blockedAddresses.includes(address)) {
      const updatedBlockedAddresses = [...blockedAddresses, address];
      setBlockedAddresses(updatedBlockedAddresses);
    }
  };
  
  const handleUnblockAddress = (address) => {
    const updatedBlockedAddresses = blockedAddresses.filter(a => a !== address);
    setBlockedAddresses(updatedBlockedAddresses);
  };  

  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedAccount');

    if (!account && !savedAccount) {
      setChats([]);
      navigate('/login');
    } 
    
    if (account)
    {
      fetchSettings();
    }

    const savedChats = JSON.parse(localStorage.getItem(`chats_${account}`)) || [];
    setChats(savedChats);
    
  }, [account, navigate, fetchSettings]);

  const toggleBlockedModal = () => {
    setIsBlockedModalOpen(!isBlockedModalOpen);
    setIsSettingsModalOpen(false);
  };  

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

    // Function to fetch TCA token balance
    const getTcaBalance = async (address) => {
      try {
        const balance = await tcaTokenContract.balanceOf(address);
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
        if (account) {
          const fetchedBalance = await getBnbBalance(account);
          setBalance(fetchedBalance);

          // Fetch TCA balance
          const tcaTokenBalance = await getTcaBalance(account);
          setTcaBalance(tcaTokenBalance);

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
            <div 
              className="wallet-header"
              style={{
                background: isHovered ? 'linear-gradient(90deg, #ce00fc, #f7c440, #20d0e3)' : '#333'
              }}
            >
              <div 
                className="sidebar-icon waddr"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={openWalletModal}
              >
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
                          <div className="dropdown-item" onClick={toggleSettingsModal}>
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
            <div className="wallet-details wallet-addr-details">
              <p><strong>Address</strong></p>
              <p className="wallet-address">
                <a href={`https://bscscan.com/address/${account}`} target="_blank" rel="noopener noreferrer" className="grdntclr">
                  {account}
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
              <QRCodeCanvas value={account} size={128} />
            </div>
          </div>
        </div>
      )}
      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="modal-overlay" onClick={toggleSettingsModal}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-title">Settings</h2>
            <button className="close-button" onClick={toggleSettingsModal}>×</button>
            <div className="settings-sections">
              <div className="notification_settings">
                <h3>Notification Settings</h3>
                <label>
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled} 
                    onChange={handleToggleNotifications} 
                  />
                  Enable Notifications
                  <span>When "Unchecked", you won't receive notifications. (Note: Chrome's Autoplay Policy blocks sound notifications until you have interacted with the page via a click, tap, etc.)</span>
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={soundAlertsEnabled} 
                    onChange={handleToggleSoundAlerts} 
                  />
                  Enable Sound Alerts
                  <span>By subscribing to Progressive Web APP (PWA) notifications, you will receive notifications even when the app is closed. Note: this feature only applies for Android devices.</span>
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={desktopNotificationsEnabled} 
                    onChange={handleToggleDesktopNotifications} 
                  />
                  Enable Desktop Notifications
                  <span>Only accept new chat conversations from wallets which have sent at least one transaction on Ethereum (applicable before the start of a new conversation)</span>
                </label>
              </div>
              <div className="privacy_settings">
                <h3>Privacy Settings</h3>
                <button className="manage-blocked-btn" onClick={toggleBlockedModal}>
                  Manage Blocked Addresses
                </button>
              </div>
              <div className="save_settings_btn">
                <button onClick={() => {
                  handleSaveSettings();
                  //toggleSettingsModal();
                }}>Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isBlockedModalOpen && (
        <div className="modal-overlay" onClick={toggleBlockedModal}>
          <div className="blocked-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Blocked Addresses</h2>
              <button className="close-button" onClick={toggleBlockedModal}>×</button>
            </div>

            <div className="blocked-list">
              <ul>
                {blockedAddresses.length > 0 ? (
                  blockedAddresses.map(address => (
                    <li key={address}>
                      <span className="blocked-address">{address}</span>
                      <button className="unblock-button" onClick={() => handleUnblockAddress(address)}>
                        Unblock
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="no-blocked-addresses">No addresses are currently blocked.</p>
                )}
              </ul>
            </div>

            <div className="block-input-container">
              <input 
                type="text" 
                placeholder="Enter address to block" 
                className="block-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBlockAddress(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button className="add-block-button" onClick={() => handleBlockAddress(document.querySelector('.block-input').value)}>
                Block Address
              </button>
            </div>

            <div className="modal-footer">
              <button className="save-blocked-btn" onClick={() => {
                handleSaveSettings();
                toggleBlockedModal();
              }}>Save Changes</button>
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
