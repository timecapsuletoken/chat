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
  setblockedAddresses,
  gun,
  handleDeleteChat,
  handleWalletInfo,
  toggleBlockedModal,
  navigate,
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
      gun.get(account).get('blockedAddresses').map().once((data, key) => {
        if (data === chatAddress) {
          gun.get(account).get('blockedAddresses').get(key).put(null, (ack) => {
            if (ack.err) {
              console.error("Failed to unblock address:", ack.err);
            } else {
              console.log("Address unblocked successfully:", chatAddress);
              setblockedAddresses((prev) => prev.filter((addr) => addr !== chatAddress)); // Update state
            }
          });
        }
      });
    } else {
      // Block the chat address
      gun.get(account).get('blockedAddresses').set(chatAddress, (ack) => {
        if (ack.err) {
          console.error("Failed to block address:", ack.err);
        } else {
          console.log("Address blocked successfully:", chatAddress);
          setblockedAddresses((prev) => [...prev, chatAddress]); // Update state
          toggleBlockedModal(); // Open the block modal
        }
      });
    }
    handleClose();
  };

  const handleDelete = () => {
    handleDeleteChat(chatAddress); // Delete the chat
    navigate('/home'); // Redirect to /home after deletion
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls={open ? 'chat-options-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ 'background': '#1c1c1c', }}
      >Options </Button>
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