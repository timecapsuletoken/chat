import React from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Create a singleton SnackbarManager
const SnackbarManager = (() => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  const SnackbarApp = ({ message, severity, onClose }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    React.useEffect(() => {
      const key = enqueueSnackbar(message, { variant: severity });
      const timer = setTimeout(() => {
        closeSnackbar(key);
        onClose();
      }, 3000); // Default duration

      return () => {
        clearTimeout(timer);
        closeSnackbar(key);
      };
    }, [enqueueSnackbar, closeSnackbar, message, severity, onClose]);

    return null;
  };

  const triggerSnackbar = ({ message, severity }) => {
    root.render(
      <SnackbarProvider maxSnack={3}>
        <SnackbarApp message={message} severity={severity} onClose={() => root.unmount()} />
      </SnackbarProvider>
    );
  };

  return {
    handleShowSnackBar: (message, severity = 'default') => {
      triggerSnackbar({ message, severity });
    },
  };
})();

export default SnackbarManager;