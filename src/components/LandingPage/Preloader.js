import React from 'react';
import { Avatar, Box } from '@mui/material';
import TCALogo from '../../assets/images/logos/logo.png';

const Preloader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        background: 'linear-gradient(45deg,rgba(162, 1, 242, 0.35),rgba(28, 203, 216, 0.35))', // Optional background gradient
        color: '#fff',
      }}
    >
      <Avatar
        src={TCALogo}
        sx={{
          width: 100,
          height: 100,
          animation: 'pulse 2s infinite', // Add animation using CSS keyframes
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.7)',
              opacity: 0.5,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );
};

export default Preloader;