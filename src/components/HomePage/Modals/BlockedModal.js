import React from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BlockIcon from '@mui/icons-material/Block';
import { FixedSizeList } from 'react-window';
import { secureInputHandler } from '../../../utils/inputSanitizer';

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
              primaryTypographyProps={{ sx: { fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' }, } }}
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
            height: blockedAddresses.length > 0 ? Math.min(50 * blockedAddresses.length, 300) : 40, // Ensure a minimum height
            bgcolor: '#1c1c1c',
            borderRadius: '6px',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {blockedAddresses.length > 0 ? (
            <FixedSizeList
              height={blockedAddresses.length > 0 ? Math.min(50 * blockedAddresses.length, 300) : '100%'} // Use 'auto' for empty
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
        <Divider sx={{ mb: 2, borderColor: '#666' }}/>
        <div className="block-input-container">
          <TextField
            className="block-input"
            id="filled-basic"
            label="Enter address to block"
            variant="filled"
            onChange={(e) => {
              const sanitizedValue = secureInputHandler(
                e.target.value,
                42, // Max length
                /[a-zA-Z0-9 ]/g, // Allowed pattern
                showSnackBar
              );
          
              e.target.value = sanitizedValue; // Directly update the input field with sanitized value
            }}
            inputProps={{
              className: 'block-input-field', // Add a unique class for query consistency
              maxLength: 42,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newAddress = e.target.value?.trim(); // Safely access value

                // Ensure valid input before proceeding
                if (typeof newAddress !== 'string' || newAddress === '') {
                  showSnackBar('Address cannot be empty.', 'warning');
                  return;
                }

                // Validate Ethereum address
                if (!ethers.utils.isAddress(newAddress)) {
                  showSnackBar('Invalid Ethereum address.', 'error');
                  return;
                }

                // Check if the address is already blocked
                if (blockedAddresses.includes(newAddress)) {
                  showSnackBar('Address is already blocked.', 'warning');
                  return;
                }

                e.target.value = ''; // Reset the input
              }
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: '#3d3d3d',
                borderRadius: '4px', // Rounded corners
                '&.Mui-focused': {
                  backgroundColor: '#4d4d4d',
                  color: '#fff', // Optional: Change text color
                },
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: '#bd3ef4', // Change label color on focus
              },
              '& .MuiFilledInput-underline:after': {
                borderBottomColor: '#bd3ef4', // Focused border bottom color
              },
            }}
          />
          <Button 
            variant="outlined"
            className="add-block-button"
            onClick={() => {
              const input = document.querySelector('.block-input-field'); // Ensure consistent selector
              if (!input || typeof input.value !== 'string' || input.value.trim() === '') {
                showSnackBar('Address cannot be empty.', 'warning');
                return;
              }

              const newAddress = input.value.trim();

              // Validate Ethereum address
              if (!ethers.utils.isAddress(newAddress)) {
                showSnackBar('Invalid Ethereum address.', 'error');
                return;
              }

              // Check if the address is already blocked
              if (blockedAddresses.includes(newAddress)) {
                showSnackBar('Address is already blocked.', 'warning');
                return;
              }

              // If all validations pass
              handleBlockAddress(newAddress);
              input.value = ''; // Clear the input field
            }}
            sx={{
              color: '#bd3ef4',
              borderColor: '#bd3ef4',
              height: '56px',
            }}
          >
            <BlockIcon />
          </Button>
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
