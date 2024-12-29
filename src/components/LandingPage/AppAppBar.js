import * as React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Sitemark from '../LandingPage/SitemarkIcon';
import ColorModeIconDropdown from '../LandingPage/ColorModeIconDropdown';
import GradientRotatingButton from '../../components/LandingPage/utils/GradientRotatingButton';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleScrollToSection = (sectionId) => {
    // Navigate to the root if needed
    if (window.location.pathname !== '/') {
      navigate('/');
    }
    // Scroll to the section smoothly
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0); // Timeout ensures the DOM is ready after navigation
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark sx={{ justifyContent: 'start' }} />
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Button variant="text" color="info" size="small" onClick={() => handleScrollToSection('features')}>
                Features
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => handleScrollToSection('how-it-works')}>
                How it Works
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => handleScrollToSection('highlights')}>
                Highlights
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => (window.location.href = 'https://www.timecapsuletoken.com/contact')}>
                Contact us
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
              <GradientRotatingButton
                text="Connect Wallet"
                icon={<AccountBalanceWalletIcon />}
                iconPosition="start"
                destination={'/login'}
              />
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon /> 
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Features</MenuItem>
                <MenuItem>How It Works</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Donations</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Contact</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                    <Button 
                      fullWidth
                      color="primary" 
                      variant="contained" 
                      size="small" 
                      startIcon={<AccountBalanceWalletIcon />}
                      onClick={() => navigate('/login')} 
                    >
                      Connect Wallet
                    </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
