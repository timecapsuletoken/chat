import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fetchWalletFromNickname } from '../../../utils/gunHelpers';
import { IoClose } from 'react-icons/io5';
import { LuMessageSquarePlus } from 'react-icons/lu';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment, IconButton, FormControl, FormHelperText } from '@mui/material';
import { Search } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const StartChatModal = ({
  showModal,
  handleCloseModal,
  chatAddress,
  setChatAddress,
  handleStartChat,
  closeSidebar,
}) => {
  const [nickname, setNickname] = useState(''); // State to store the entered nickname
  const [error, setError] = useState(null); // State to store the error message (if any)

  if (!showModal) return null;

  const handleNicknameSearch = () => {
    if (!nickname.trim()) {
      setError('Please enter a valid nickname.');
      return;
    }

    fetchWalletFromNickname(nickname, (response) => {
      if (response.wallet) {
        console.log('Wallet found:', response.wallet);
        setChatAddress(response.wallet); // Set wallet address in the input field
        setError(null); // Clear any error message
      } else {
        console.error('Failed to fetch wallet:', response.err);
        setError('No wallet found for this nickname.'); // Set error message
        setChatAddress(''); // Clear the input if no wallet is found
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
            onChange={(e) => setChatAddress(e.target.value)}
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
              label="Find via Nickname"
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
              label="e.g. TCA#123..."
              variant="outlined"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)} // Update nickname state
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleNicknameSearch} // Trigger search on icon click
                        edge="end"
                        sx={{ color: error ? 'red' : 'green' }}
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: error ? '#fff' : 'green', // Text color changes on success
                  '& fieldset': {
                    borderColor: error ? 'red' : 'green', // Border color changes based on error state
                  },
                  '&:hover fieldset': {
                    borderColor: error ? 'red' : '#00e676', // A brighter green for hover in success state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: error ? 'red' : '#00e676', // Focus border matches hover color in success state
                  },
                },
                '& .MuiInputBase-input': {
                  color: error ? '#fff' : '#fff', // Input text color changes for success state
                },
                '& .MuiInputLabel-root': {
                  color: error ? 'red' : 'green', // Placeholder text color changes for success state
                },
              }}
            />
            {error ? (
              <FormHelperText id="nickname-error-text">{error}</FormHelperText>
            ) : (
              <FormHelperText id="nickname-success-text" sx={{ color: 'green' }}>
                Nickname resolved successfully!
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
};

export default StartChatModal;
