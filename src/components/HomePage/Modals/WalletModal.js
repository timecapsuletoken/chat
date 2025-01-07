import React from 'react';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { RiBnbLine } from 'react-icons/ri';
import { QRCodeCanvas } from 'qrcode.react';
import { Stack, Link, Chip, Avatar } from '@mui/material';
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
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
            <Link 
              href={`https://bscscan.com/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              <Chip
                icon={<FaExternalLinkAlt />}
                label={account}
                size="medium"
                variant="outlined"
                sx={{
                  backgroundColor: 'transparent !important',
                  color: '#ffffff',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' }, // Adjust font size for the label
                  height: { xs: 24, sm: 32 }, // Adjust height for smaller chips on mobile              
                  '& .MuiChip-icon': {
                    fontSize: { xs: '0.8rem', sm: '1rem' }, // Adjust icon size
                    color: '#bd3ef4', // Change the icon color here
                  },
                  '& .MuiChip-label': {
                    padding: { xs: '0 8px', sm: '0 12px' }, // Adjust padding for smaller chips
                  },
                }}                
              />
            </Link>
          </Stack>
        </div>
        <div className="wallet-stats">
          <div className="wallet-balance">
            <p>BNB Balance:</p>
            <span className="coins-data">
              <Chip
                icon={<RiBnbLine className="bnb-coin-logo" />} 
                label={formatNumber(balance)}
                size="medium"
                variant="outlined"
                sx={{
                  backgroundColor: 'transparent !important',
                  color: '#ffffff',
                }}                
              />
            </span>
          </div>
          <div className="wallet-txns">
            <p>TCA Balance:</p>
            <span className="coins-data">
            <Chip
                avatar={<Avatar alt="TCA Coin" src={TCACoin} />} 
                label={formatNumber(tcaBalance)}
                size="medium"
                variant="outlined"
                sx={{
                  backgroundColor: 'transparent !important',
                  color: '#ffffff',
                }}                
              />
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
