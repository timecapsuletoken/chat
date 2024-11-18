import React from 'react';
import '../../../assets/css/HomePage/HelpModal.css'; // Add custom styles here
import { FaQuestionCircle, FaWallet, FaTools } from 'react-icons/fa';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h2>
          <FaQuestionCircle style={{ marginRight: '8px', color: '#007bff' }} />
          Help
        </h2>
        <p>Need help using TimeCapsule Chat? Here’s some guidance to get you started:</p>
        <h3>
          <FaWallet style={{ marginRight: '8px', color: '#ff9900' }} />
          Wallet Connection
        </h3>
        <ul>
          <li>
            Make sure you have MetaMask or Coinbase Wallet installed and unlocked.
          </li>
          <li>
            Select your preferred wallet from the dropdown menu and approve the connection request.
          </li>
          <li>
            If the wallet connection fails, ensure you’re on a supported network like Binance Smart Chain.
          </li>
        </ul>
        <h3>
          <FaTools style={{ marginRight: '8px', color: '#28a745' }} />
          Troubleshooting
        </h3>
        <ul>
          <li>
            If you experience issues, try refreshing the page or clearing your browser’s cache.
          </li>
          <li>
            Ensure your wallet is set to the Binance Smart Chain network.
          </li>
          <li>
            For further support, contact us at <a href="mailto:support@timecapsule.chat">support@timecapsule.chat</a>.
          </li>
        </ul>
        <p>Thank you for using TimeCapsule Chat!</p>
      </div>
    </div>
  );
};

export default HelpModal;
