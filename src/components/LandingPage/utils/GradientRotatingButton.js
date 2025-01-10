import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import useGradientRotation from './useEffectForGradientRotation'; // Import the custom hook

const GradientRotatingButton = ({ 
  text, 
  destination = null, 
  icon = null, 
  iconPosition = 'start', 
  onClick = null ,
  disabled = false,
}) => {
  const navigate = useNavigate();

  useGradientRotation();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Execute the custom onClick handler if provided
    }
    if (destination) {
      navigate(destination); // Navigate only if destination is provided
    }
  };

  return (
    <Box
      className="rotating-gradient-wrapper"
      sx={(theme) => ({
        width: '100%',
        display: 'inline-block',
        padding: '1px', // Space for the gradient border
        borderRadius: '8px',
        background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
      })}
    >
      <Button
        onClick={handleClick}
        disabled={disabled} 
        size="small"
        fullWidth
        {...{ [iconPosition + 'Icon']: icon }} // Dynamically set startIcon or endIcon
        sx={{
          minWidth: 'fit-content',
          padding: '12px 24px',
          borderRadius: '8px',
          background: (theme) => theme.palette.background.default,
          color: (theme) => theme.palette.text.primary,
          fontWeight: 'bold',
          textTransform: 'none',
          '&:hover': {
            background: (theme) => theme.palette.action.hover,
          },
        }}
      >
        {text}
      </Button>
    </Box>
  );
};

export default GradientRotatingButton;