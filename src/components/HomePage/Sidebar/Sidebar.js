import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SidebarAccount from '../Sidebar/SidebarAccount';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { FaBars, FaCogs, FaInfoCircle, FaQuestionCircle, FaPowerOff } from 'react-icons/fa';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CiMenuKebab } from 'react-icons/ci';
import { LuMessageSquarePlus } from 'react-icons/lu';
import { MdHome } from 'react-icons/md';

const Sidebar = ({
  account,
  gun,
  isSidebarOpen,
  showDropdown,
  chats,
  isHovered,
  toggleSidebar,
  toggleDropdown,
  setIsHovered,
  openWalletModal,
  handleOpenModal,
  handleChatItemClick,
  handleDeleteChat,
  handleClearChatHistory,
  disconnectWallet,
  navigate,
  setShowAboutModal,
  setShowHelpModal,
  toggleSettingsModal,
  closeSidebar,
}) => {
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false when data is ready
    }, 6000); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);
  
  const handleSwitchWallet = () => {
    console.log('Switching wallet...');
  };  

  return (
    <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''} ${showDropdown ? 'no-scroll' : ''}`}>
      <div
        className="wallet-header"
        style={{
          background: isHovered ? 'linear-gradient(90deg, #ce00fc, #f7c440, #20d0e3)' : '#333',
        }}
      >
        <SidebarAccount
          account={account}
          gun={gun}
          handleClearChatHistory={handleClearChatHistory}
          handleSwitchWallet={handleSwitchWallet}
        />
      </div>
      <div className="sidebar-content">
        {isSidebarOpen && (
          <div
            className="sidebar-icon"
            style={{ background: isSidebarOpen ? 'linear-gradient(90deg, #ce00fc, #f7c440, #20d0e3)' : 'inherit' }}
          >
            <button
              className={`sidebar-toggle-inside ${isSidebarOpen ? 'open' : ''}`}
              onClick={toggleSidebar}
            >
              <FaBars />
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
                <CiMenuKebab />
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
                <div className="dropdown-item">
                  <button
                    className="disconnect-button"
                    onClick={() => {
                      disconnectWallet();
                      navigate('/login');
                    }}
                  >
                    <FaPowerOff /> <span>Logout</span>
                  </button>
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
              className="chat-item"
              onClick={() => {
                handleChatItemClick(address);
                closeSidebar();
              }}
            >
              <Avatar sx={{ backgroundColor: address.length > 6 ? `#${address.slice(-6)}` : '#ddd', }}>{address.length > 2 ? `${address.slice(-2)}` : address}</Avatar>
              <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
              <Tooltip title={address}>
                <p className="chat-address-sidebar">
                  {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
                </p>
              </Tooltip>
              <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
              <Tooltip title="Delete Chat">
                <DeleteForeverIcon
                  variant="outlined"
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(address);
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
  // Define propTypes to enforce correct prop usage
  account: PropTypes.string,
  gun: PropTypes.object.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  chats: PropTypes.array.isRequired,
  isHovered: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  openWalletModal: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleChatItemClick: PropTypes.func.isRequired,
  handleDeleteChat: PropTypes.func.isRequired,
  handleClearChatHistory: PropTypes.func.isRequired,
  disconnectWallet: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  setShowAboutModal: PropTypes.func.isRequired,
  setShowHelpModal: PropTypes.func.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
};

export default Sidebar;