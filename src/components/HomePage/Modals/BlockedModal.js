import React from 'react';
import PropTypes from 'prop-types';

const BlockedModal = ({
  isBlockedModalOpen,
  toggleBlockedModal,
  blockedAddresses,
  handleUnblockAddress,
  handleBlockAddress,
  handleSaveSettings,
}) => {
  if (!isBlockedModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleBlockedModal}>
      <div className="blocked-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Blocked Addresses</h2>
          <button className="close-button" onClick={toggleBlockedModal}>×</button>
        </div>

        <div className="blocked-list">
        <ul>
            {blockedAddresses.length > 0 ? (
              [...new Set(blockedAddresses)].map((address) => ( // Ensure unique keys
                <li key={address}>
                  <span className="blocked-address">{address}</span>
                  <button
                    className="unblock-button"
                    onClick={() => handleUnblockAddress(address)}
                  >
                    Unblock
                  </button>
                </li>
              ))
            ) : (
              <li className="no-blocked-addresses">No addresses are currently blocked.</li>
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
                const newAddress = e.target.value.trim();
                if (newAddress && !blockedAddresses.includes(newAddress)) {
                  handleBlockAddress(newAddress); // Call the function only for unique addresses
                  e.target.value = '';
                } else {
                  console.warn("Address already blocked or invalid:", newAddress);
                }
              }
            }}            
          />
          <button
            className="add-block-button"
            onClick={() => {
              const input = document.querySelector('.block-input');
              if (input) {
                const newAddress = input.value.trim();
                if (newAddress && !blockedAddresses.includes(newAddress)) {
                  handleBlockAddress(newAddress); // Call the function only for unique addresses
                  input.value = '';
                } else {
                  console.warn("Address already blocked or invalid:", newAddress);
                }
              }
            }}            
          >
            Block Address
          </button>
        </div>

        <div className="modal-footer">
          <button
            className="save-blocked-btn"
            onClick={() => {
              handleSaveSettings();
              toggleBlockedModal();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

BlockedModal.propTypes = {
  isBlockedModalOpen: PropTypes.bool.isRequired,
  toggleBlockedModal: PropTypes.func.isRequired,
  blockedAddresses: PropTypes.array.isRequired,
  handleUnblockAddress: PropTypes.func.isRequired,
  handleBlockAddress: PropTypes.func.isRequired,
  handleSaveSettings: PropTypes.func.isRequired,
};

export default BlockedModal;
