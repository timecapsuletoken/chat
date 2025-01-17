import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Components from your project
import SidebarAccount from '../Sidebar/SidebarAccount';

import { markMessagesAsRead, fetchNicknameFromWallet } from '../../../utils/gunHelpers';

// Material-UI components
import { Skeleton, Tooltip, Divider } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Icons from react-icons
import { FaCogs, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import SettingsIcon from '@mui/icons-material/Settings';
import { LuMessageSquarePlus } from 'react-icons/lu';
import { MdHome } from 'react-icons/md';

// Avatar
import jazzicon from '@metamask/jazzicon';

const generateJazziconSVG = (address, diameter = 40) => {
  if (!address) return null;

  // Create a numeric seed based on the wallet address
  const seed = parseInt(address.slice(2, 10), 16);
  const icon = jazzicon(diameter, seed);

  // Extract the SVG from the generated Jazzicon
  const serializer = new XMLSerializer();
  return serializer.serializeToString(icon);
};

const Sidebar = ({
  account,
  disconnectWallet,
  switchAccount,
  switchToBSC,
  providerType,
  gun,
  isSidebarOpen,
  showDropdown,
  chats,
  setChats,
  unreadChats,
  nickname,
  setNickname,
  showSnackBar,
  loading,
  isHovered,
  toggleSidebar,
  closetoggleSidebar,
  toggleDropdown,
  setIsHovered,
  openWalletModal,
  handleOpenModal,
  handleChatItemClick,
  deleteChat,
  handleClearChatHistory,
  navigate,
  setShowAboutModal,
  setShowHelpModal,
  toggleSettingsModal,
  closeSidebar,
}) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [chatNicknames, setChatNicknames] = useState({}); // State to store nicknames
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Simulate a loading delay for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false when data is ready
    }, 3000); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (process.env.NODE_ENV !== 'production') {
          console.log("[DEBUG] Click detected outside sidebar. Toggling sidebar.");
        }
        closetoggleSidebar(); // Run the function when clicking outside the sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closetoggleSidebar]);

    // Fetch nicknames for chats
    useEffect(() => {
      const fetchNicknames = async () => {
        if (!chats || chats.length === 0) return;
  
        const nicknames = {};
        for (const chatAddress of chats) {
          try {
            const nickname = await fetchNicknameFromWallet(chatAddress);
            nicknames[chatAddress] = nickname || 'Unknown'; // Fallback to 'Unknown' if no nickname
            if (process.env.NODE_ENV !== 'production') {
              console.log(`[DEBUG] Fetched nickname for ${chatAddress}: ${nickname}`);
            }
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`[ERROR] Failed to fetch nickname for ${chatAddress}:`, error);
            }
            nicknames[chatAddress] = chatAddress.slice(-5);
          }
        }
        setChatNicknames(nicknames);
      };
  
      fetchNicknames();
    }, [chats]);  

  return (
    <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''} ${showDropdown ? 'no-scroll' : ''}`}>
      <div
        className="wallet-header"
        style={{
          background: isHovered ? 'linear-gradient(90deg, #ce00fc, #f7c440, #20d0e3)' : '#333',
        }}
      >
        <SidebarAccount
          account={account}
          disconnectWallet={disconnectWallet}
          switchAccount={switchAccount}
          switchToBSC={switchToBSC}
          providerType={providerType}
          nickname={nickname}
          setNickname={setNickname}
          showSnackBar={showSnackBar}
          loading={loading}   
          gun={gun}
          openWalletModal={openWalletModal}
          handleClearChatHistory={handleClearChatHistory}
        />
      </div>
      <div className="sidebar-content">
        {isSidebarOpen && (
          <div
            className="sidebar-icon"
            style={{ background: isSidebarOpen ? '#828282' : 'inherit' }}
          >
            <button
              className={`sidebar-toggle-inside ${isSidebarOpen ? 'open' : ''}`}
              onClick={toggleSidebar}
              style={{ color: isSidebarOpen ? '#1c1c1c' : 'inherit' }}
            >
              <DashboardIcon />
            </button>
          </div>
        )}
        <Tooltip title="Home">
          <div className="sidebar-icon">
              <a href="/home">
                <MdHome />
              </a>
          </div>
        </Tooltip>
        <Tooltip title="New Chat">
          <div className="sidebar-icon">
              <button className="new-message" onClick={handleOpenModal}>
                <LuMessageSquarePlus />
              </button>
          </div>
        </Tooltip>
        <Tooltip title="Options">
          <div className="sidebar-icon">
              <button onClick={toggleDropdown}>
                <SettingsIcon />
              </button>
          </div>
        </Tooltip>
        <div className="dropdown-container">
          {showDropdown && (
            <>
              <div className="dropdown-overlay" onClick={() => toggleDropdown(false)}></div>
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={toggleSettingsModal}>
                  <FaCogs className="dropdown-icon" />
                  <span>Settings</span>
                </div>
                <div className="dropdown-item" onClick={() => setShowAboutModal(true)}>
                  <FaInfoCircle className="dropdown-icon" />
                  <span>About</span>
                </div>
                <div className="dropdown-item" onClick={() => setShowHelpModal(true)}>
                  <FaQuestionCircle className="dropdown-icon" />
                  <span>Help</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="chat-list">
        {isLoading ? (
          // Display skeleton placeholders while loading
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Skeleton sx={{ bgcolor: '#333' }} variant="rounded" width={240} height={60} />
              </div>
            ))}
          </>
        ) : chats.length > 0 ? (
          chats.map((address, index) => (
            <div
              key={index}
              className={`chat-item ${unreadChats.has(address) ? 'unread-message' : ''}`}
              onClick={() => {
                handleChatItemClick(address);
                if (process.env.NODE_ENV !== 'production') {
                  console.log("[DEBUG] Chat clicked. Address:", address);
                  console.log("[DEBUG] unreadChats contains address:", unreadChats.has(address));
                }
                markMessagesAsRead(account, address);
                closeSidebar();
              }}
            >
              {/* Render the Jazzicon SVG */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                dangerouslySetInnerHTML={{ __html: generateJazziconSVG(address) }}
              />
              <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
              <Tooltip title={address}>
                <p className="chat-address-sidebar">
                  {chatNicknames[address] || `${address.slice(0, 6)}...${address.slice(-4)}`}
                </p>
              </Tooltip>
              <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
              <Tooltip title="Delete Chat">
                <DeleteForeverIcon
                  variant="outlined"
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (process.env.NODE_ENV !== 'production') {
                      console.log("Delete button clicked for address:", address);
                    }
                    deleteChat(address); // Call deleteChat here                
                  }}
                />
              </Tooltip>
            </div>
          ))
        ) : (
          <div className="empty-chat">
            <p className="head-empty-chat">Your chat is empty!</p>
            <p className="body-empty-chat">
              Once you start a new conversation, you'll see the chat lists here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  account: PropTypes.string,
  switchAccount: PropTypes.func.isRequired,
  switchToBSC: PropTypes.func.isRequired,
  disconnectWallet: PropTypes.func.isRequired,
  providerType: PropTypes.oneOf(['MetaMask', 'CoinbaseWallet']).isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  chats: PropTypes.array.isRequired,
  setChats: PropTypes.func.isRequired,
  unreadChats: PropTypes.instanceOf(Set).isRequired,
  nickname: PropTypes.string,
  setNickname: PropTypes.func.isRequired,
  showSnackBar: PropTypes.func.isRequired, 
  loading: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  closetoggleSidebar: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  openWalletModal: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleChatItemClick: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired,
  handleClearChatHistory: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  setShowAboutModal: PropTypes.func.isRequired,
  setShowHelpModal: PropTypes.func.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
};

export default Sidebar;