import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, Typography, Button, Box, Chip, Snackbar, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const PinModal = ({ isOpen, account, onClose }) => {

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const generatePinFromAddress = (account) => {
    if (!account || account.length !== 42 || !account.startsWith('0x')) {
      return 'Invalid Address';
    }
    return `${account[4]}${account[13]}${account[26]}${account[39]}`.toUpperCase();
  };

  const handleCopyToClipboard = () => {
    const pin = generatePinFromAddress(account);
    navigator.clipboard.writeText(pin);
    setSnackbarOpen(true); // Show snackbar
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Box
        className="settings-modal-content"
        onClick={(e) => e.stopPropagation()}
        sx={{
          //background: '#fff',
          padding: 3,
          borderRadius: 2,
          width: '90%',
          maxWidth: 400,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Your PIN <LockIcon />
        </Typography>
        <Divider sx={{ borderColor: '#8d8d8d', my: 1, }} />
        <Chip
            label={generatePinFromAddress(account)}
            onClick={handleCopyToClipboard}
            variant="outlined"
            fullwidth
            sx={{
            my: 1,
            width: '100%',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            padding: '10px',
            color: '#fff',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#fff !important',
                color: '#333 !important',
            },
            }}
        />
        <Divider sx={{ borderColor: '#8d8d8d', my: 1, }} />
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: '100%' }}
            >
            PIN copied to clipboard!
            </Alert>
        </Snackbar>
        <Typography
            variant="body2"
            sx={{
                color: 'primary',
                mb: 2,
            }}
        >   
            <strong style={{ color: '#FF4500' }}>Auto-Lock:</strong> 
            This feature will automatically lock your screen in <strong style={{ color: '#007BFF' }}>30 minutes</strong>. To regain access, you will need this PIN.<br />
            <strong style={{ color: '#FF0000' }}>Important:</strong> 
            Your PIN is <strong>auto-generated</strong> and <strong>cannot be recovered</strong> if lost. 
            <span style={{ color: '#FF4500', fontWeight: 'bold' }}>
            <br />We cannot retrieve your PIN.
            </span> 
            <br />Please <strong style={{ color: '#FFA500' }}>store it securely</strong> and ensure you have a safe copy. 
            <br />If forgotten, you can <strong>re-login</strong> using the <strong style={{ color: '#007BFF' }}>same wallet</strong> to view your PIN again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ marginTop: 2 }}
        >
          Close
        </Button>
      </Box>
    </div>
  );
};

PinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  account: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PinModal;