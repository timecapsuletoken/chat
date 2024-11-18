import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { FaWallet, FaBars, FaCogs, FaInfoCircle, FaQuestionCircle, FaPowerOff, FaTimes } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';
import { LuMessageSquarePlus } from 'react-icons/lu';
import { MdHome } from 'react-icons/md';
import { IoChatboxSharp } from 'react-icons/io5';

const Sidebar = ({
  account,
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

  return (
    <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''} ${showDropdown ? 'no-scroll' : ''}`}>
      <div
        className="wallet-header"
        style={{
          background: isHovered ? 'linear-gradient(90deg, #ce00fc, #f7c440, #20d0e3)' : '#333',
        }}
      >
        <div
          className="sidebar-icon waddr"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={openWalletModal}
        >
          <p>
            <FaWallet />{' '}
            <span className="wallet-addr">
              {account ? `| ${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}
            </span>
          </p>
        </div>
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
        <div className="sidebar-icon">
          <a href="/home">
            <MdHome />
          </a>
        </div>
        <div className="sidebar-icon">
          <button className="new-message" onClick={handleOpenModal}>
            <LuMessageSquarePlus />
          </button>
        </div>
        <div className="sidebar-icon">
          <button onClick={toggleDropdown}>
            <CiMenuKebab />
          </button>
        </div>
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
            {[...Array(1)].map((_, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Skeleton variant="rounded" width={210} height={60} />
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
              <IoChatboxSharp className="chat-message-icon" />
              <p className="chat-address-sidebar">
                {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
              </p>
              <FaTimes
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
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
            <p className="body-empty-chat">
              Once you start a new conversation, you'll see the address lists here.
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
  disconnectWallet: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  setShowAboutModal: PropTypes.func.isRequired,
  setShowHelpModal: PropTypes.func.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
};

export default Sidebar;