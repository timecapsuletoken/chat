import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider, useSnackbar } from 'notistack';

const SnackbarManager = (() => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  let enqueueSnackbar = null;

  const SnackbarApp = () => {
    const { enqueueSnackbar: enqueue } = useSnackbar();

    useEffect(() => {
      enqueueSnackbar = enqueue; // Assign the enqueueSnackbar function globally
    }, [enqueue]);

    return null; // No UI needed, just managing snackbar functionality
  };

  root.render(
    <SnackbarProvider maxSnack={3}>
      <SnackbarApp />
    </SnackbarProvider>
  );

  const triggerSnackbar = ({ message, severity }) => {
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
