import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider, useSnackbar } from 'notistack';

const SnackbarManager = (() => {
  let enqueueSnackbar = null;
  let initialized = false;

  const initializeSnackbar = () => {
    if (!initialized) {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = createRoot(container);

      const SnackbarApp = () => {
        const { enqueueSnackbar: enqueue } = useSnackbar();
        useEffect(() => {
          enqueueSnackbar = enqueue;
        }, [enqueue]);
        return null;
      };

      root.render(
        <SnackbarProvider maxSnack={3}>
          <SnackbarApp />
        </SnackbarProvider>
      );

      initialized = true;
    }
  };

  const triggerSnackbar = ({ message, severity }) => {
    if (!initialized) initializeSnackbar();
    if (enqueueSnackbar) {
      enqueueSnackbar(message, { variant: severity });
    } else {
      console.warn('Snackbar system is not ready yet.');
    }
  };

  return {
    handleShowSnackBar: (message, severity = 'info') => {
      triggerSnackbar({ message, severity });
    },
  };
})();

export default SnackbarManager;