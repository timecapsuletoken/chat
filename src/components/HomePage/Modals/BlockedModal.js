import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
//import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { FixedSizeList } from 'react-window';

const BlockedModal = ({
  isBlockedModalOpen,
  toggleBlockedModal,
  blockedAddresses,
  handleUnblockAddress,
  handleBlockAddress,
  handleSaveSettings,
  showSnackBar,
}) => {
  if (!isBlockedModalOpen) return null;

    // Ensure unique blocked addresses
    //const blockedAddresses = [...new Set(blockedAddresses)];

    // Render a row in the virtualized list
    const renderRow = ({ index, style }) => {
      const address = blockedAddresses[index];
  
      return (
        <ListItem 
          style={style} 
          key={address} 
          component="div" 
          disablePadding
          secondaryAction={
            <IconButton
              aria-label="Unblock"
              onClick={() => handleUnblockAddress(address)} 
              color="error"
            >
              <RestartAltIcon />
            </IconButton>
          }
        >
          <ListItemButton>
            <ListItemText
              primary={address}
              primaryTypographyProps={{ sx: { fontSize: '0.9rem' } }}
            />
          </ListItemButton>
        </ListItem>
      );
    };  

  return (
    <div className="modal-overlay" onClick={toggleBlockedModal}>
      <div className="blocked-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Blocked Addresses</h2>
          <button className="close-button" onClick={toggleBlockedModal}>×</button>
        </div>

        <Box
          sx={{
            width: '100%',
            height: blockedAddresses.length > 0 ? Math.min(50 * blockedAddresses.length, 400) : 40, // Ensure a minimum height
            bgcolor: '#1c1c1c',
            borderRadius: '6px',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {blockedAddresses.length > 0 ? (
            <FixedSizeList
              height={blockedAddresses.length > 0 ? Math.min(50 * blockedAddresses.length, 400) : '100%'} // Use 'auto' for empty
              width="100%"
              itemSize={50}
              itemCount={blockedAddresses.length}
              overscanCount={5}
            >
              {renderRow}
            </FixedSizeList>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontSize: '1rem',
                color: '#fff',
              }}
            >
              No addresses are currently blocked.
            </Box>
          )}
        </Box>

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
                  showSnackBar(`Address ${newAddress.slice(-5)} has been Blocked`, 'success');
                  e.target.value = '';
                } else {
                  showSnackBar('Address already blocked or invalid.', 'warning');
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
                  showSnackBar('Address already blocked or invalid.', 'warning');
                  console.warn("Address already blocked or invalid:", newAddress);
                }
              }
            }}            
          >
            Block Address
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
