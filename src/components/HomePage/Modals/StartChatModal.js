import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fetchWalletFromNickname } from '../../../utils/gunHelpers';
import { secureInputHandler } from '../../../utils/inputSanitizer';

// Icon imports
import { IoClose } from 'react-icons/io5';
import { LuMessageSquarePlus } from 'react-icons/lu';
import { Search } from '@mui/icons-material';

// Material-UI imports
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  Divider,
  Chip,
} from '@mui/material';

const StartChatModal = ({
  showModal,
  handleCloseModal,
  chatAddress,
  setChatAddress,
  handleStartChat,
  closeSidebar,
  showSnackBar,
}) => {

  const [nickname, setNickname] = useState(''); // State to store the entered nickname
  const [error, setError] = useState(null); // State to store the error message (if any)
  const [success, setSuccess] = useState(false); // Explicit success state

  if (!showModal) return null;

  const onSearchClick = () => {
    setError(null); // Clear error state before search
    setSuccess(false); // Reset success state before search
    handleNicknameSearch(nickname);
  };
    
  const handleNicknameSearch = (nickname) => {
    if (!nickname.trim()) {
      setError('Please enter a valid nickname.');
      setSuccess(false); // Ensure success is cleared
      showSnackBar('Please enter a valid nickname','warning');
      return;
    }
  
    fetchWalletFromNickname(nickname, (response) => {
      if (response.wallet) {
        console.log('Wallet found:', response.wallet);
        setChatAddress(response.wallet); // Set wallet address in the input field
        setError(null); // Clear any error message
        setSuccess(true); // Mark as success
        showSnackBar('Wallet found','info');
      } else {
        console.error('Failed to fetch wallet:', response.err);
        setError('No wallet found for this nickname.'); // Set error message
        setChatAddress(''); // Clear the input if no wallet is found
        setSuccess(false); // Clear success if there's an error
        showSnackBar('No wallet found for this nickname','error');
      }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={handleCloseModal}
    >
      <Card
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        sx={{
          width: 400,
          maxWidth: '90%',
          padding: 2,
          boxShadow: 3,
          backgroundColor: '#333',
        }}
      >
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
            <Typography variant="h5" component="div">
              Start New Chat
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <IoClose color='#fff' />
            </IconButton>
          </div>
          <Typography sx={{ mt: 1, mb: 1 }} color="#fff">
            Enter a BNB Address (BEP-20) to start a new chat
          </Typography>
          <TextField
            fullWidth
            id="outlined-basic" 
            label="e.g. 0x12345..." 
            variant="outlined" 
            //placeholder="e.g. 0x12345..."
            value={chatAddress}
            onChange={(e) => {
              secureInputHandler(
                e.target.value,
                42, // Max length
                /[a-zA-Z0-9 ]/g, // Allowed pattern
                500, // Throttle delay in ms
                showSnackBar,
                setChatAddress // Callback to update state
              );      
            }}      
            inputProps={{
              maxLength: 42,
            }}   
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                color: '#fff', // Text color
                '& fieldset': {
                  borderColor: '#fff', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: '#ddd', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff', // Border color when focused
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff', // Input text color
              },
              '& .MuiInputLabel-root': {
                color: '#fff', // Placeholder text color
              },
            }}          
          />
          <Divider
            sx={{
              my: 2, // Adds vertical margin (top and bottom) to the Divider
              '&::before, &::after': {
                borderColor: '#fff',
              },
            }}
          >
            <Chip
              label="Find Wallet via Nickname"
              size="medium"
              sx={{
                color: '#fff', // Text color
                backgroundColor: 'transparent', // Transparent background for the chip
                border: '1px solid #fff', // Optional border for the chip
              }}
            />
          </Divider>
          <FormControl
            fullWidth
            variant="outlined"
            error={Boolean(error)} // Set error state based on the error message
            sx={{ mt: 1 }}
          >
            <TextField
              id="nickname-field"
              label="e.g. 0a1B2..."
              variant="outlined"
              value={nickname}
              onChange={(e) => {
                secureInputHandler(
                  e.target.value,
                  6, // Max length
                  /[a-zA-Z0-9 ]/g, // Allowed pattern
                  500, // Throttle delay in ms
                  showSnackBar,
                  setNickname // Callback to update state
                );      
              }}      
              inputProps={{
                maxLength: 6,
              }}   
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={onSearchClick} // Trigger search on button click
                        edge="end"
                        sx={{
                          color: error
                            ? 'red'
                            : success
                            ? 'green'
                            : '#fff', // Neutral color for default state
                        }}
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff', // Default text color
                  '& fieldset': {
                    borderColor: error
                      ? 'red'
                      : success
                      ? 'green'
                      : '#fff', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: error
                      ? 'red'
                      : success
                      ? '#00e676'
                      : '#fff', // Hover border for error or success
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: error
                      ? 'red'
                      : success
                      ? '#00e676'
                      : '#fff', // Focus border for error or success
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#fff', // Default input text color
                },
                '& .MuiInputLabel-root': {
                  color: error
                    ? 'red'
                    : success
                    ? 'green'
                    : '#fff', // Default label color
                },
              }}
            />
            {error ? (
              <FormHelperText id="nickname-error-text" sx={{ color: 'red' }}>
                Try Again - {error}
              </FormHelperText>
            ) : success ? (
              <FormHelperText id="nickname-success-text" sx={{ color: 'green' }}>
                Nickname resolved successfully!
              </FormHelperText>
            ) : (
              <FormHelperText id="nickname-default-text" sx={{ color: '#fff' }}>
                Enter a nickname to begin.
              </FormHelperText>
            )}
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              handleStartChat(); // Handle chat item click
              closeSidebar(); // Close the sidebar on mobile
            }}
            endIcon={<LuMessageSquarePlus />}
            sx={{
              '&:hover': {
                borderColor: '#f7c440',
                color: '#f7c440',
              },
            }}
          >
            Start Chatting
          </Button>
        </CardActions>
      </Card>
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
  showSnackBar: PropTypes.func.isRequired,
};

export default StartChatModal;
