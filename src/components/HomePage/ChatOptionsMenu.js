import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BlockIcon from '@mui/icons-material/Block';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ChatOptionsMenu = ({
  account,
  chatAddress,
  blockedAddresses,
  setBlockedAddresses,
  gun,
  deleteChat,
  handleWalletInfo,
  toggleBlockedModal,
  navigate,
  showSnackBar,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlockUnblock = () => {
    if (blockedAddresses.includes(chatAddress)) {
      // Unblock the chat address
      gun.get(account).get('blockedAddresses').get(chatAddress).put(null, (ack) => {
        if (ack.err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error("Failed to unblock address:", ack.err);
          }
          showSnackBar(`Failed to unblock address ${chatAddress.slice(-5)}`,'error');
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log("Address successfully unblocked:", chatAddress);
          }
          showSnackBar(`Address ${chatAddress.slice(-5)} successfully unblocked`,'success');
          // Update the local state only after successful database deletion
          setBlockedAddresses((prev) =>
            prev.filter((blockedAddress) => blockedAddress !== chatAddress)
          );
        }
      });
    } else {
      // Block the chat address
      gun.get(account).get('blockedAddresses').get(chatAddress).put(true, (ack) => {
        if (ack.err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error("Failed to block address:", ack.err);
          }
          showSnackBar(`Failed to block address ${chatAddress.slice(-5)}`,'error');
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log("Blocked address saved successfully:", chatAddress);
          }
          showSnackBar(`Address ${chatAddress.slice(-5)} has been Blocked`,'success');
          setBlockedAddresses((prev) =>
            Array.isArray(prev) ? [...prev, chatAddress] : [chatAddress]
          );
        }
      });
    }
    handleClose();
  };

  const handleDelete = () => {
    deleteChat(chatAddress); // Delete the chat
    navigate('/home'); // Redirect to /home after deletion
    handleClose();
  };

  return (
    <div className="chat-options-menu-btn">
      <Button
        aria-controls={open ? 'chat-options-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        sx={{ 'background': '#1c1c1c', }}
      >
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="chat-options-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'chat-options-button',
        }}
        sx={{ 'margin': '0' }}
      >
        <MenuItem onClick={handleBlockUnblock}>
          <BlockIcon style={{ marginRight: 8 }} />
          {blockedAddresses.includes(chatAddress) ? 'Unblock User' : 'Block User'}
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteForeverIcon style={{ marginRight: 8 }} />
          Delete Chat
        </MenuItem>
        <MenuItem onClick={() => { handleWalletInfo(); handleClose(); }}>
          <InfoIcon style={{ marginRight: 8 }} />
          Wallet Info
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ChatOptionsMenu;
