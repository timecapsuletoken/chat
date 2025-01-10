import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import SaveIcon from '@mui/icons-material/Save';

const SettingsModal = ({
  isSettingsModalOpen,
  toggleSettingsModal,
  autoLockEnabled,
  soundAlertsEnabled,
  desktopNotificationsEnabled,
  handleToggleautoLockEnabled,
  handleToggleSoundAlerts,
  handleToggleDesktopNotifications,
  toggleBlockedModal,
  handleSaveSettings,
}) => {
  if (!isSettingsModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleSettingsModal}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="settings-title">Settings</h2>
        <button className="close-button" onClick={toggleSettingsModal}>×</button>
        <div className="settings-sections">
          <div className="notification_settings">
            <h3>Dashboard Settings</h3>
            <label>
              <input
                type="checkbox"
                checked={autoLockEnabled}
                onChange={handleToggleautoLockEnabled}
              />
              Enable Auto-Lock Screen
              <span>
                The dApp will <strong>Auto-Lock</strong> your Screen for 30 minutes after this <strong>setting is saved</strong>. Unlocking requires a PIN
                generated from your Wallet Address adjusted with a Sophisticated Algorithm that makes it UNIQUE and Unbreakable.
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={soundAlertsEnabled}
                onChange={handleToggleSoundAlerts}
              />
              Enable Sound Alerts
              <span>
              Audio notifications for incoming messages or events. This feature works seamlessly across desktop and mobile browsers.
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={desktopNotificationsEnabled}
                onChange={handleToggleDesktopNotifications}
              />
              Enable Desktop Notifications
              <span>
                Only accept new chat conversations from wallets which have sent at least one
                transaction on Ethereum (applicable before the start of a new conversation).
              </span>
            </label>
          </div>
          <div className="privacy_settings">
            <h3>Privacy Settings</h3>
            <Button 
              variant="contained" 
              startIcon={<BlockIcon />} 
              onClick={toggleBlockedModal}
              sx={{
                width: '100%',
                backgroundColor: '#1c1c1c',
                borderColor: '#1c1c1c',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#ddd',
                  borderColor: '#ddd',
                  color: '#1c1c1c',
                },
              }}
            >
              Manage Blocked Addresses
            </Button>
          </div>
          <Divider 
            sx={{
              my: 2, // Adds vertical margin (top and bottom) to the Divider
              borderColor: '#fff',
            }}
          />
          <div className="save_settings_btn">
            <Button 
              fullWidth
              startIcon={<SaveIcon />}
              variant="contained" 
              onClick={() => {
                handleSaveSettings();
                toggleSettingsModal();
              }}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  isSettingsModalOpen: PropTypes.bool.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired,
  autoLockEnabled: PropTypes.bool.isRequired,
  soundAlertsEnabled: PropTypes.bool.isRequired,
  desktopNotificationsEnabled: PropTypes.bool.isRequired,
  handleToggleautoLockEnabled: PropTypes.func.isRequired,
  handleToggleSoundAlerts: PropTypes.func.isRequired,
  handleToggleDesktopNotifications: PropTypes.func.isRequired,
  toggleBlockedModal: PropTypes.func.isRequired,
  handleSaveSettings: PropTypes.func.isRequired,
};

export default SettingsModal;
