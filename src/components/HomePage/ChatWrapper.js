import React from 'react';
import PropTypes from 'prop-types';
import ChatPage from '../../pages/ChatPage';

const ChatWrapper = ({
  account,
  toggleBlockedModal,
  deleteChat,
  openWalletModal,
  setChatAddress,
  formatNumber,
  isSidebarOpen, 
  toggleSidebar,
  toggleSidebarText,
}) => {
  return (
    <ChatPage
      account={account}
      toggleBlockedModal={toggleBlockedModal}
      deleteChat={deleteChat}
      openWalletModal={openWalletModal}
      setChatAddress={setChatAddress}
      formatNumber={formatNumber}
      isSidebarOpen={isSidebarOpen} 
      toggleSidebar={toggleSidebar}   
      toggleSidebarText="Dashboard"
    />
  );
};

ChatWrapper.propTypes = {
  account: PropTypes.string,
  toggleBlockedModal: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired,
  openWalletModal: PropTypes.func.isRequired,
  setChatAddress: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
  toggleSidebarText: PropTypes.string.isRequired,
};

export default ChatWrapper;
