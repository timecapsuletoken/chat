import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Preloader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        background: 'linear-gradient(45deg, #a001f2, #1ccad8)', // Optional background gradient
        color: '#fff',
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default Preloader;