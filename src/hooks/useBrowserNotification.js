import { useCallback } from 'react';

const useBrowserNotification = () => {
  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification.");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        return true;
      } else {
        console.warn("Notification permission denied.");
        return false;
      }
    }

    return false; // Permission is "denied"
  };

  const showNotification = useCallback(async (title, options) => {
    // Ensure notifications are only shown when the page is not visible
    if (document.visibilityState === "hidden") {
      const hasPermission = await checkNotificationPermission();
      if (!hasPermission) {
        console.warn("Unable to show notification: Permission denied.");
        return;
      }

      const notification = new Notification(title, options);
      notification.onclick = () => {
        console.log("Notification clicked!");
        window.focus(); // Bring the app to the foreground on click
      };

      return notification;
    } else {
      console.log("Page is active. Notification suppressed.");
    }
  }, []);

  return { showNotification };
};

export default useBrowserNotification;
