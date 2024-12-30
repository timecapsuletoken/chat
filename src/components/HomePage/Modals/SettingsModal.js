import React from 'react';
import PropTypes from 'prop-types';

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
              Audio notifications for incoming messages or events. This feature works seamlessly across desktop and mobile browsers. When enabled, a notification sound will play to alert the user if they receive a message or event. The sound will trigger even if the application is in the background on desktop browsers or in the foreground on mobile browsers (subject to browser and OS restrictions). Notifications are designed to respect modern autoplay policies, ensuring compatibility and reliability.
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
            <button className="manage-blocked-btn" onClick={toggleBlockedModal}>
              Manage Blocked Addresses
            </button>
          </div>
          <div className="save_settings_btn">
            <button
              onClick={() => {
                handleSaveSettings();
                toggleSettingsModal();
              }}
            >
              Save Settings
            </button>
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
