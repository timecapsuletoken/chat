import React from 'react';
import PropTypes from 'prop-types';
import ChatPage from '../../pages/ChatPage';

const ChatWrapper = ({
  account,
  toggleBlockedModal,
  deleteChat,
  openWalletModal,
  findNick,
  setChatAddress,
  formatNumber,
}) => {
  return (
    <ChatPage
      account={account}
      toggleBlockedModal={toggleBlockedModal}
      deleteChat={deleteChat}
      openWalletModal={openWalletModal}
      findNick={findNick}
      setChatAddress={setChatAddress}
      formatNumber={formatNumber}
    />
  );
};

ChatWrapper.propTypes = {
  account: PropTypes.string,
  toggleBlockedModal: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired,
  openWalletModal: PropTypes.func.isRequired,
  findNick: PropTypes.string.isRequired,
  setChatAddress: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
};

export default ChatWrapper;
