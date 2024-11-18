import React from 'react';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { RiBnbLine } from 'react-icons/ri';
import { QRCodeCanvas } from 'qrcode.react';
import TCACoin from '../../../assets/images/logos/logo.png';

const WalletModal = ({
  isWalletModalOpen,
  closeWalletModal,
  account,
  balance,
  tcaBalance,
  formatNumber,
}) => {
  if (!isWalletModalOpen) return null;

  return (
    <div className="wallet-modal-overlay" onClick={closeWalletModal}>
      <div className="wallet-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2>My Profile</h2>
          <button className="wallet-close-button" onClick={closeWalletModal}>×</button>
        </div>
        <div className="wallet-details wallet-addr-details">
          <p><strong>Address</strong></p>
          <p className="wallet-address">
            <a
              href={`https://bscscan.com/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grdntclr"
            >
              {account}
            </a>
            <FaExternalLinkAlt className="wallet-address-extlink" />
          </p>
        </div>
        <div className="wallet-stats">
          <div className="wallet-balance">
            <p>BNB Balance:</p>
            <span className="coins-data">
              {formatNumber(balance)} <RiBnbLine className="bnb-coin-logo" />
            </span>
          </div>
          <div className="wallet-txns">
            <p>TCA Balance:</p>
            <span className="coins-data">
              {formatNumber(tcaBalance)} <img src={TCACoin} alt="TCA Coin" className="tca-coin-logo" />
            </span>
          </div>
        </div>
        <div className="qr-code-section">
          <p><strong>Your QR Code address</strong></p>
          <p>(Safe to share with your contacts)</p>
          <QRCodeCanvas value={account} size={128} />
        </div>
      </div>
    </div>
  );
};

WalletModal.propTypes = {
  isWalletModalOpen: PropTypes.bool.isRequired,
  closeWalletModal: PropTypes.func.isRequired,
  account: PropTypes.string,
  balance: PropTypes.number.isRequired,
  tcaBalance: PropTypes.number.isRequired,
  formatNumber: PropTypes.func.isRequired,
};

export default WalletModal;
