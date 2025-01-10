import * as React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useColorScheme } from '@mui/material/styles';
import useGradientRotation from '../LandingPage/utils/useEffectForGradientRotation';

export default function ColorModeIconDropdown(props) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useGradientRotation('rotating-gradient-wrapper'); // Apply to elements with this class

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMode = (targetMode) => () => {
    setMode(targetMode);
    handleClose();
  };
  if (!mode) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: 'bottom',
          display: 'inline-flex',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        })}
      />
    );
  }
  const resolvedMode = systemMode || mode;
  const icon = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
  }[resolvedMode];
  return (
    <React.Fragment>
      <Box
        className="rotating-gradient-wrapper"
        sx={(theme) => ({
          padding: '1px', // Space for the gradient border
          borderRadius: '8px',
          background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
        })}
      >
        <IconButton
          data-screenshot="toggle-mode"
          onClick={handleClick}
          disableRipple
          size="small"
          aria-controls={open ? 'color-scheme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={(theme) => ({
            borderRadius: '8px',
            background: `${theme.palette.background.default} !important`,
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              background: `${theme.palette.action.hover} !important`,
              borderColor: 'transparent !important',
            },
          })}
          {...props}
        >
          {icon}
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            variant: 'outlined',
            elevation: 0,
            sx: {
              my: '4px',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem selected={mode === 'system'} onClick={handleMode('system')}>
          System
        </MenuItem>
        <MenuItem selected={mode === 'light'} onClick={handleMode('light')}>
          Light
        </MenuItem>
        <MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>
          Dark
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}