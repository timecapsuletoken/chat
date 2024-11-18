import React from 'react';
import PropTypes from 'prop-types';
import { IoClose } from 'react-icons/io5';
import { LuMessageSquarePlus } from 'react-icons/lu';

const StartChatModal = ({
  showModal,
  handleCloseModal,
  chatAddress,
  setChatAddress,
  handleStartChat,
  closeSidebar,
}) => {
  if (!showModal) return null;

  return (
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
        <button
          className="start-chat-button"
          onClick={() => {
            handleStartChat(); // Handle chat item click
            closeSidebar(); // Close the sidebar on mobile
          }}
        >
          <LuMessageSquarePlus /> Start Chatting
        </button>
      </div>
    </div>
  );
};

StartChatModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  chatAddress: PropTypes.string.isRequired,
  setChatAddress: PropTypes.func.isRequired,
  handleStartChat: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
};

export default StartChatModal;
