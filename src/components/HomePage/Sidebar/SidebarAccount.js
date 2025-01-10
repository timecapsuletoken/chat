import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// Material-UI Components
import {
  Menu,
  MenuItem,
  IconButton,
  Skeleton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  InputAdornment,
  FormControl,
} from '@mui/material';

// Material-UI Icons
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  CommentsDisabled as CommentsDisabledIcon,
  SwitchAccessShortcut as SwitchAccessShortcutIcon,
  Language as LanguageIcon,
  Computer as ComputerIcon,
  Person2 as Person2Icon,
  ExitToApp as ExitToAppIcon,
  Search as SearchIcon,
  ManageAccounts as ManageAccountsIcon,
} from '@mui/icons-material';

import { generateJazzicon } from '../../../utils/jazzAvatar';
import { hasUserSavedNickname, isNicknameAvailable, saveNicknameToGun } from '../../../utils/gunHelpers';
import { switchWallet } from '../../../utils/wallet';
import { secureInputHandler } from '../../../utils/inputSanitizer';

const SidebarAccount = ({ account, switchAccount, providerType, switchToBSC, nickname, setNickname, showSnackBar, handleClearChatHistory, openWalletModal, disconnectWallet }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState(false); 
  const [success, setSuccess] = useState(false);

  // Nickname Functionalities
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [disabled, setDisabled] = useState(false);

  // Session Information
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [network, setNetwork] = useState('Unknown');
  const [browserInfo, setBrowserInfo] = useState('');

  // Jazzicon
  const avatarRef = useRef(null);

  // Fetch nickname when component mounts
  useEffect(() => {
    if (account && nickname) {
      setLoading(false); // Set loading to false when nickname is available
    }

    if (account && avatarRef.current) {
      generateJazzicon(account, avatarRef.current, 40); // Generate a Jazzicon with a diameter of 40px
    }
  
    const fetchNetwork = async () => {
      try {
        if (window.ethereum) {
          const chainId = window.ethereum.chainId || await window.ethereum.request({ method: 'eth_chainId' });
          setNetwork(chainId === '0x38' ? 'Binance Smart Chain' : 'Unknown');
        } else {
          setNetwork('No Provider');
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching network information:', error);
        }
        setNetwork('Error');
      }
    };
  
    fetchNetwork();
    setBrowserInfo(navigator.userAgent);
  }, [account, nickname]);  

  useEffect(() => {
    const checkIfNicknameIsSaved = async () => {
      const hasSaved = await hasUserSavedNickname(account);
      setDisabled(hasSaved); // Disable input if the user already saved a custom nickname
    };
  
    if (account) {
      checkIfNicknameIsSaved();
    }
  }, [account]);

  // Session Information Modal Logic
  const handleCloseSessionModal = () => setIsSessionModalOpen(false);
  const handleOpenSessionModal = () => setIsSessionModalOpen(true);

  // Switch Wallet Caller
  const handleSwitchWallet = () => {
    switchWallet(providerType, switchAccount, switchToBSC);
  };

  const handleAvailabilityCheck = async () => {
    if (!newNickname) {
      setError('Nickname cannot be empty.');
      setWarning(false);
      setSuccess(false);
      showSnackBar('Nickname cannot be empty.', 'error');
      return;
    }

    // Step 2: Validate nickname format (letters and numbers only, exactly 5 or 6 characters)
    const isValidFormat = /^[a-zA-Z0-9]{5,6}$/.test(newNickname); // 5 to 6 alphanumeric characters
    if (!isValidFormat) {
      setError('Nickname must be exactly 5 letters or numbers.');
      setWarning(false);
      setSuccess(false);
      showSnackBar('Nickname must be exactly 5 letters or numbers.', 'error');
      return;
    }
  
    const available = await isNicknameAvailable(newNickname);
  
    if (!available) {
      setError('');
      setWarning('This nickname is already taken.');
      setSuccess(false);
      showSnackBar('Nickname is already taken. Please choose another one.', 'warning');
    } else {
      setError('');
      setWarning(false);
      setSuccess(true);
      showSnackBar('Nickname is available.', 'success');
    }
  };  

  const handleSaveNickname = async () => {
    // Step 1: Validate nickname input
    if (!newNickname) {
      setError('Nickname cannot be empty.');
      setSuccess(false);
      return;
    }
  
    if (disabled) {
      showSnackBar('You have already saved a custom nickname. The input is disabled.', 'error');
      return;
    }
  
    // Step 3: Clear error state and indicate success
    setError('');
    setSuccess(true);
  
    // Step 4: Save nickname to Gun
    saveNicknameToGun(account, newNickname, (ack) => {
      if (ack.err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to save nickname:', ack.err);
        }
        showSnackBar('Failed to save nickname', 'error');
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Nickname saved successfully:', newNickname);
        }
        showSnackBar(`${account.slice(-5)} Nickname saved as: ${newNickname}`, 'success');
        setNewNickname(''); // Clear the input field
        setNickname(newNickname); // Update local nickname state
        setIsNicknameModalOpen(false); // Close modal
      }
    });
  };  

  const handleOptionsMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* User Icon */}
      <Avatar ref={avatarRef}></Avatar>
      <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
      {/* Nickname and Wallet Address */}
      <div style={{ textAlign: 'center' }}>
      {loading ? (
          <Skeleton sx={{ bgcolor: '#1c1c1c' }} variant="text" width="100%" />
        ) : (
          <Typography variant="body2" fontWeight="bold">
            {nickname.slice(0, 10)}
          </Typography>
        )}
        <Tooltip title="My Wallet info" sx={{cursor: 'pointer'}}>
          <Typography variant="body1" color="textSecondary" onClick={openWalletModal} noWrap>
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}
          </Typography>
        </Tooltip>
      </div>
      <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
      {/* Options Menu Icon */}
      <Tooltip title="User Options">
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)} sx={{ padding: '0px' }}>
        <ManageAccountsIcon sx={{ color: '#fff' }} />
      </IconButton>
      </Tooltip>
      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleOptionsMenuClose}
        MenuListProps={{
          'aria-labelledby': 'options-menu-button',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#333', // Change background color
            color: '#fff', // Change text color
          },
          paddingTop: 0, 
          paddingBottom: 0, 
        }}
      >
        {/* Profile Nickname */}
        <MenuItem
          onClick={() => {
            setIsNicknameModalOpen(true);
            handleOptionsMenuClose();
          }}
          sx={{
            paddingTop: 0, 
            paddingBottom: 0, 
          }} 
        > 
          <Avatar sx={{ backgroundColor: '#3f51b5', width: 24, height: 24, marginRight: 1 }}>
            <Person2Icon sx={{ width: 15, height: 15 }} />
          </Avatar>
          Nickname
        </MenuItem>
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />

        {/* Clear Chat History */}
        <MenuItem
          onClick={() => {
            handleClearChatHistory();
            handleOptionsMenuClose();
          }}
          sx={{
            paddingTop: 0, 
            paddingBottom: 0, 
          }} 
        >
          <Avatar sx={{ backgroundColor: '#ebaf06', width: 24, height: 24, marginRight: 1 }}>
            <CommentsDisabledIcon sx={{ width: 15, height: 15 }} />
          </Avatar>
          Clear Chats
        </MenuItem>
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />

        {/* Switch Wallet */}
        {providerType !== 'CoinbaseWallet' && (
          <MenuItem
            onClick={() => {
              handleSwitchWallet();
              handleOptionsMenuClose();
            }}
            sx={{
              paddingTop: 0, 
              paddingBottom: 0, 
            }} 
          >
            <Avatar sx={{ backgroundColor: '#4caf50', width: 24, height: 24, marginRight: 1 }}>
              <SwitchAccessShortcutIcon sx={{ width: 15, height: 15 }} />
            </Avatar>
            Switch Wallet
          </MenuItem>
        )}
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />

        {/* Session Information */}
        <MenuItem
          onClick={() => {
            if (process.env.NODE_ENV !== 'production') {
              console.log('Session Information Modal Open');
            }
            handleOpenSessionModal();
            handleOptionsMenuClose();
          }}
          sx={{
            paddingTop: 0, 
            paddingBottom: 0, 
          }} 
        >
          <Avatar sx={{ backgroundColor: '#007bff', width: 24, height: 24, marginRight: 1 }}>
            <InfoIcon sx={{ width: 15, height: 15 }} />
          </Avatar>
          Session info
        </MenuItem>
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />

        {/* Logout */}
        <MenuItem
          onClick={disconnectWallet}
          sx={{
            paddingTop: 0, 
            paddingBottom: 0, 
          }} 
        >
          <Avatar sx={{ backgroundColor: '#f44336', width: 24, height: 24, marginRight: 1 }}>
            <ExitToAppIcon sx={{ width: 15, height: 15 }} />
          </Avatar>
          Logout
        </MenuItem>
      </Menu>

      {/* Nickname Modal */}
      <Dialog 
        open={isNicknameModalOpen} 
        onClose={() => setIsNicknameModalOpen(false)}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px', // Set the border-radius for the dialog
            backgroundColor: '#333',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Edit Nickname</DialogTitle>
        <Divider
            sx={{
              my: 0, // Adds vertical margin (top and bottom) to the Divider
              '&::before, &::after': {
                borderColor: '#fff',
              },
            }}
          >
            <Chip
              label="Nicknames can be updated only once"
              size="medium"
              sx={{
                color: '#fff', // Text color
                backgroundColor: 'transparent', // Transparent background for the chip
                border: '1px solid #fff', // Optional border for the chip
              }}
            />
          </Divider>
        <DialogContent>
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
          <TextField
            id="nickname-input"
            label="Nickname"
            variant="outlined"
            value={newNickname}            
            onChange={(e) => {
              secureInputHandler(
                e.target.value,
                6, // Max length
                /[a-zA-Z0-9 ]/g, // Allowed pattern
                0, // Throttle delay in ms
                showSnackBar,
                setNewNickname // Callback to update state
              );      
            }}      
            inputProps={{
              maxLength: 6,
            }}      
            disabled={disabled}
            inert={disabled ? 'true' : undefined} // Use a string for `inert`          
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                       onClick={!disabled ? handleAvailabilityCheck : null}
                       edge="end"
                       disabled={disabled}
                       inert={disabled ? 'true' : undefined} // Use a string for `inert`
                       sx={{
                         color: disabled ? '#aaa' : '#fff', // Adjust icon color when disabled
                       }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            error={Boolean(error)} // Adds automatic red border on error
            sx={{
              '& .MuiOutlinedInput-root': {
                color: disabled ? '#aaa' : '#fff', // Input text color when disabled
                '& fieldset': {
                  borderColor: disabled
                    ? '#aaa' // Border color when disabled
                    : error
                    ? 'red' // Error state border
                    : success
                    ? 'green' // Success state border
                    : warning
                    ? '#ff9800' // Warning state border (yellow-orange)
                    : '#fff', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: disabled
                    ? '#aaa' // Hover border color when disabled
                    : error
                    ? 'red'
                    : success
                    ? '#00e676'
                    : warning
                    ? '#ff9800' // Hover border for warning state
                    : '#ddd', // Default hover border
                },
                '&.Mui-focused fieldset': {
                  borderColor: disabled
                    ? '#aaa' // Focus border color when disabled
                    : error
                    ? 'red'
                    : success
                    ? '#00e676'
                    : warning
                    ? '#ff9800' // Focused border for warning state
                    : '#fff', // Default focus border
                },
              },
              '& .MuiInputBase-input': {
                color: disabled ? '#aaa' : '#fff', // Input text color
              },
              '& .MuiInputLabel-root': {
                color: disabled
                  ? '#aaa' // Label text color when disabled
                  : error
                  ? 'red' // Label color for error
                  : success
                  ? 'green' // Label color for success
                  : warning
                  ? '#ff9800' // Label color for warning
                  : '#fff', // Default label color
              },
              '& .Mui-disabled': {
                opacity: 0.7, // Subdued styling for disabled state
              },
            }}          
          />
        </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="outlined" fullWidth onClick={() => setIsNicknameModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            color="primary"
            fullWidth
            onClick={!disabled ? handleSaveNickname : null}
            disabled={!success}
            inert={!success ? 'true' : undefined} // Use a string for `inert`          
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Information Modal */}
      <Dialog
        open={isSessionModalOpen}
        onClose={handleCloseSessionModal}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px', // Set the border-radius for the dialog
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#333', // Set the background color
            color: '#fff', // Set the text color
            textAlign: 'center',
          }}
        >
          Session Information
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: '#333', // Set the background color
            color: '#fff', // Set the text color
          }}
        >
          <List>
            {/* Wallet Address */}
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#ce00fc' }}>
                  <AccountBalanceWalletIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Connected Wallet"
                secondary={account || 'Not Connected'}
                primaryTypographyProps={{ color: '#fff' }}
                secondaryTypographyProps={{ color: '#ddd' }}
              />
            </ListItem>
            <Divider sx={{ backgroundColor: '#555' }} />

            {/* Session Start Time */}
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#f7c440' }}>
                  <AccessTimeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Session Start Time"
                secondary={sessionStartTime.toLocaleString()}
                primaryTypographyProps={{ color: '#fff' }}
                secondaryTypographyProps={{ color: '#ddd' }}
              />
            </ListItem>
            <Divider sx={{ backgroundColor: '#555' }} />

            {/* Wallet Provider */}
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#f88f2e' }}>
                  <AccountBalanceWalletIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Wallet Provider"
                secondary={window.ethereum?.isMetaMask ? 'MetaMask' : 'Coinbase'}
                primaryTypographyProps={{ color: '#fff' }}
                secondaryTypographyProps={{ color: '#ddd' }}
              />
            </ListItem>
            <Divider sx={{ backgroundColor: '#555' }} />

            {/* Network */}
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#20d0e3' }}>
                  <LanguageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Network"
                secondary={network}
                primaryTypographyProps={{ color: '#fff' }}
                secondaryTypographyProps={{ color: '#ddd' }}
              />
            </ListItem>
            <Divider sx={{ backgroundColor: '#555' }} />

            {/* Browser Info */}
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#4caf50' }}>
                  <ComputerIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Browser"
                secondary={browserInfo}
                primaryTypographyProps={{ color: '#fff' }}
                secondaryTypographyProps={{ color: '#ddd' }}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: '#333', // Set the background color
            color: '#fff', // Set the text color
            justifyContent: 'center',
          }}
        >
          <Button variant="outlined" onClick={handleCloseSessionModal} fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

SidebarAccount.propTypes = {
  account: PropTypes.string, // Wallet address of the connected user
  nickname: PropTypes.string, // User's nickname
  setNickname: PropTypes.func.isRequired, // Function to update the nickname
  handleClearChatHistory: PropTypes.func.isRequired, // Function to clear chat history
  openWalletModal: PropTypes.func.isRequired, // Function to open wallet modal
  disconnectWallet: PropTypes.func.isRequired, // Function to disconnect the wallet
  providerType: PropTypes.oneOf(['MetaMask', 'CoinbaseWallet']), // Type of wallet provider
  switchAccount: PropTypes.func.isRequired, // Function to switch wallet accounts
  switchToBSC: PropTypes.func.isRequired, // Function to switch to Binance Smart Chain
};

export default SidebarAccount;
