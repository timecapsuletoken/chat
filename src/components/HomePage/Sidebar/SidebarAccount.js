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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';

// Material-UI Icons
import {
  MoreVert as MoreVertIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  CommentsDisabled as CommentsDisabledIcon,
  SwitchAccessShortcut as SwitchAccessShortcutIcon,
  Language as LanguageIcon,
  Computer as ComputerIcon,
  Person2 as Person2Icon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { generateJazzicon } from '../../../utils/jazzAvatar';
import { hasUserSavedNickname, isNicknameAvailable, saveNicknameToGun } from '../../../utils/gunHelpers';
import { switchWallet } from '../../../utils/wallet';

const SidebarAccount = ({ account, switchAccount, providerType, switchToBSC, nickname, setNickname, showSnackBar, handleClearChatHistory, openWalletModal, disconnectWallet }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [loading, setLoading] = useState(true);

  // Nickname Functionalities
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [disabled, setDisabled] = useState(false); // State for button disabled status

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
        console.error('Error fetching network information:', error);
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

  // Save nickname to Gun
  const saveNickname = async () => {
    if (disabled) {
      showSnackBar('You have already saved a custom nickname. The input is disabled.', 'error');
      return;
    }
  
    const available = await isNicknameAvailable(newNickname);
  
    if (!available) {
      showSnackBar('Nickname is already taken. Please choose another one.', 'error');
      return;
    }
  
    saveNicknameToGun(account, newNickname, (ack) => {
      if (ack.err) {
        console.error('Failed to save nickname:', ack.err);
        showSnackBar('Failed to save nickname', 'error');
      } else {
        console.log('Nickname saved successfully:', newNickname);
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
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreVertIcon sx={{ color: '#fff' }} />
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
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />

        {/* Session Information */}
        <MenuItem
          onClick={() => {
            console.log('Session Information Modal Open');
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
        <DialogContent>
          <TextField
            label="Nickname"
            id="outlined-basic" 
            variant="outlined"
            disabled={disabled}
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            color="#fff"
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
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="outlined" fullWidth onClick={() => setIsNicknameModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            color="primary"
            fullWidth
            onClick={!disabled ? saveNickname : null}
            disabled={disabled}
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
