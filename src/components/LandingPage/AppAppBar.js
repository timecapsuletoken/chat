import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 
import { styled, alpha } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Stack, 
  Container, 
  Divider, 
  Box, 
  MenuItem, 
  Button, 
  IconButton, 
  Typography,
  Drawer,
  Avatar
 } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Sitemark from '../LandingPage/SitemarkIcon';
import TCALogo from '../../assets/images/logos/logo.png';
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
    // Close the Drawer first
    setOpen(false);
  
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
    }, 0);
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
              <Button variant="text" color="info" size="small" onClick={() => (navigate('/blog'))}>
                Blog
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
            <Box
              className="rotating-gradient-wrapper"
              sx={(theme) => ({
                padding: '1px', // Space for the gradient border
                borderRadius: '8px',
                background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
              })}
            >
              <IconButton
                aria-label="Menu button" 
                onClick={toggleDrawer(true)}
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
              >
                <MenuIcon /> 
              </IconButton>
            </Box>
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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2} // Add spacing between elements
                  sx={{
                    width: '100%', // Adjust width as needed
                  }}
                >
                  {/* Logo */}
                  <Box
                    className="rotating-gradient-wrapper"
                    sx={(theme) => ({
                      padding: '1px', // Space for the gradient border
                      borderRadius: '50%',
                      background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
                    })}
                  >
                    <Box
                      sx={(theme) => ({
                        width: '50px', // Example logo size
                        height: '50px',
                        borderRadius: '50%',
                        background: `${theme.palette.background.default}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      {/* Add your logo or image here */}
                      <Typography variant="h6" sx={{ color: (theme) => theme.palette.text.primary }}>
                        <Avatar alt="TCA Logo" src={TCALogo} sx={{ width: 35, height: 35 }} />
                      </Typography>
                    </Box>
                  </Box>

                  {/* Text */}
                  <Typography
                    variant="h6"
                    sx={(theme) => ({
                      color: theme.palette.text.primary,
                      fontWeight: 'bold',
                    })}
                  >
                    TCA Chat dApp
                  </Typography>

                  {/* Close Icon */}
                  <Box
                    className="rotating-gradient-wrapper"
                    sx={(theme) => ({
                      padding: '1px', // Space for the gradient border
                      borderRadius: '8px',
                      background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
                    })}
                  >
                    <IconButton
                      onClick={toggleDrawer(false)}
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
                    >
                      <CloseRoundedIcon /> 
                    </IconButton>
                  </Box>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <MenuItem onClick={() => handleScrollToSection('/')} sx={{ justifyContent: 'center' }}>Home</MenuItem>
                  <MenuItem onClick={() => handleScrollToSection('features')} sx={{ justifyContent: 'center' }}>Features</MenuItem>
                  <MenuItem onClick={() => handleScrollToSection('how-it-works')} sx={{ justifyContent: 'center' }}>How It Works</MenuItem>
                  <MenuItem onClick={() => handleScrollToSection('highlights')} sx={{ justifyContent: 'center' }}>Highlights</MenuItem>
                  <MenuItem onClick={() => handleScrollToSection('donations')} sx={{ justifyContent: 'center' }}>Donations</MenuItem>
                  <MenuItem onClick={() => (navigate('/blog'))} sx={{ justifyContent: 'center' }}>Blog</MenuItem>
                  <MenuItem onClick={() => handleScrollToSection('faq')} sx={{ justifyContent: 'center' }}>FAQ</MenuItem>
                  <MenuItem component={RouterLink} to="https://www.timecapsuletoken.com/contact" sx={{ justifyContent: 'center' }}>Contact</MenuItem>
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem>
                    <Box
                      className="rotating-gradient-wrapper"
                      sx={(theme) => ({
                        width: '100%',
                        padding: '1px', // Space for the gradient border
                        borderRadius: '8px',
                        background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
                      })}
                    >
                      <Button
                        fullWidth
                        size="small" 
                        startIcon={<AccountBalanceWalletIcon />}
                        onClick={() => navigate('/login')} 
                        sx={(theme) => ({
                          borderRadius: '8px',
                          background: `${theme.palette.background.default} !important`,
                          color: theme.palette.text.primary,
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': {
                            background: `${theme.palette.action.hover} !important`,
                            borderColor: 'transparent !important',
                            color: theme.palette.text.primary,
                          },
                        })}
                      >
                        Connect Wallet
                      </Button>
                    </Box>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
