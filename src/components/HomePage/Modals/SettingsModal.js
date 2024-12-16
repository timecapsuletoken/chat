import React from 'react';
import PropTypes from 'prop-types';

const SettingsModal = ({
  isSettingsModalOpen,
  toggleSettingsModal,
  notificationsEnabled,
  soundAlertsEnabled,
  desktopNotificationsEnabled,
  handleToggleNotifications,
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
            <h3>Notification Settings</h3>
            <label>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
              />
              Enable Notifications
              <span>
                When "Unchecked", you won't receive notifications. (Note: Chrome's Autoplay Policy
                blocks sound notifications until you have interacted with the page via a click,
                tap, etc.)
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
                By subscribing to Progressive Web APP (PWA) notifications, you will receive
                notifications even when the app is closed. Note: this feature only applies for
                Android devices.
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
  notificationsEnabled: PropTypes.bool.isRequired,
  soundAlertsEnabled: PropTypes.bool.isRequired,
  desktopNotificationsEnabled: PropTypes.bool.isRequired,
  handleToggleNotifications: PropTypes.func.isRequired,
  handleToggleSoundAlerts: PropTypes.func.isRequired,
  handleToggleDesktopNotifications: PropTypes.func.isRequired,
  toggleBlockedModal: PropTypes.func.isRequired,
  handleSaveSettings: PropTypes.func.isRequired,
};

export default SettingsModal;
