import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import gun from '../../../utils/gunSetup'; // Adjust path as necessary

const SidebarAccount = ({ account, handleClearChatHistory, handleSwitchWallet }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [nickname, setNickname] = useState('TCA#000');
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [loading, setLoading] = useState(true);


  // Fetch nickname when component mounts
  useEffect(() => {
    if (account) {
      gun.get(account).get('nickname').once((data) => {
        if (data) {
          setNickname(data);
          setTimeout(() => {
            setLoading(false);
          }, 6000);
        } else {
          setNickname(`TCA#${account.slice(-3)}`); // Default nickname
          setTimeout(() => {
            setLoading(false);
          }, 6000);
        }
      });
    }
  }, [account]);

  // Save nickname to Gun
  const saveNickname = () => {
    if (newNickname.trim() && account) {
      gun.get(account).get('nickname').put(newNickname, (ack) => {
        if (ack.err) {
          console.error('Failed to save nickname:', ack.err);
        } else {
          console.log('Nickname saved successfully:', newNickname);
          setNickname(newNickname); // Update displayed nickname
          setIsNicknameModalOpen(false); // Close modal
        }
      });
    }
  };

  const handleOptionsMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* User Icon */}
      <Avatar
        sx={{
          backgroundColor: account && account.length > 6 ? `#${account.slice(-6)}` : '#ddd',
        }}
      >
        {account ? account.slice(-2) : '?'}
      </Avatar>
      <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
      {/* Nickname and Wallet Address */}
      <div style={{ textAlign: 'center' }}>
      {loading ? (
          <Skeleton variant="text" width="100%" />
        ) : (
          <Typography variant="body2" fontWeight="bold">
            {nickname}
          </Typography>
        )}
        <Tooltip title={account}>
          <Typography variant="body1" color="textSecondary" noWrap>
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}
          </Typography>
        </Tooltip>
      </div>
      <Divider orientation="vertical" variant="middle" sx={{ borderColor: '#1c1c1c' }} flexItem />
      {/* Options Menu Icon */}
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreVertIcon sx={{ color: '#fff' }} />
      </IconButton>
      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleOptionsMenuClose}
        MenuListProps={{
          'aria-labelledby': 'options-menu-button',
        }}
        sx={{
          paddingTop: 0, 
          paddingBottom: 0, 
        }}      
      >
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
          Profile Nickname
        </MenuItem>
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />
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
          Clear Chat History
        </MenuItem>
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />
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
          Switch Wallet
        </MenuItem>
        <Divider component="li" sx={{ borderColor: '#1c1c1c' }} flexItem />
        <MenuItem
          onClick={() => {
            console.log('Session Information Modal Open');
            handleOptionsMenuClose();
          }}
          sx={{
            paddingTop: 0, 
            paddingBottom: 0, 
          }} 
        >
          Session Information
        </MenuItem>
      </Menu>

      {/* Nickname Modal */}
      <Dialog open={isNicknameModalOpen} onClose={() => setIsNicknameModalOpen(false)}>
        <DialogTitle>Edit Nickname</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nickname"
            variant="outlined"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNicknameModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={saveNickname}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SidebarAccount;
