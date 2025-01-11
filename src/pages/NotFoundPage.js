import React from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import TCALogo from '../assets/images/logos/logo.png';
import NotFoundVid from '../assets/videos/404Page.mp4';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import useGradientRotation from '../components/LandingPage/utils/useEffectForGradientRotation'; // Import the custom hook

const customTheme = extendTheme({ defaultColorScheme: 'dark' });

export default function JoySignInSideTemplate() {
    useGradientRotation('rotating-gradient-wrapper'); // Apply to elements with this class

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: theme.palette.background.paper,
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <Link href="/">
                <Avatar
                    alt="TCA Logo"
                    src={TCALogo}
                    sx={{
                        backgroundColor: 'transparent',
                        width: 35, // Adjust size
                        height: 35,
                    }}
                />
              </Link>
              <Typography level="title-lg">TCA Chat dApp</Typography>
            </Box>
            <Typography level="title-lg">
                <Box
                    className="rotating-gradient-wrapper"
                        sx={{
                        padding: '1px', // Space for the gradient border
                        borderRadius: '8px',
                        background: `linear-gradient(var(--angle, 0deg), #07e6f5, #aa1ff4)`,
                    }}
                >
                    <Button
                        startDecorator={<LoginIcon />}
                        fullWidth
                        onClick={() => window.location.href = '/login'}
                        sx={{
                            borderRadius: '8px',
                            background: `#1c1c1c !important`,
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': {
                            background: `transparent !important`,
                            borderColor: 'transparent !important',
                            color: '#fff',
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Typography>
          </Box>
          <Box
            component="main"
            sx={{
                my: 'auto',
                py: 2,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 400,
                maxWidth: '100%',
                mx: 'auto',
                borderRadius: 'sm',
                textAlign: 'center', // Center-align text content
            }}
            >
            <Stack sx={{ gap: 4, mb: 2 }}>
                <Typography component="h1" level="h3" sx={{ fontSize: '3rem', fontWeight: 'bold' }}>
                Are you lost?
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                Oops! The page you're looking for doesn't exist.
                </Typography>
            </Stack>
            <Divider
                sx={(theme) => ({
                [theme.getColorSchemeSelector('light')]: {
                    color: { xs: '#FFF', md: 'text.tertiary' },
                },
                })}
            />
            <Stack sx={{ gap: 2, mt: 4 }}>
                <Box
                    className="rotating-gradient-wrapper"
                        sx={{
                        padding: '1px', // Space for the gradient border
                        borderRadius: '8px',
                        background: `linear-gradient(var(--angle, 0deg), #07e6f5, #aa1ff4)`,
                    }}
                >
                    <Button
                        startDecorator={<HomeIcon />}
                        fullWidth
                        onClick={() => window.location.href = '/'}
                        sx={{
                            borderRadius: '8px',
                            background: `#1c1c1c !important`,
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': {
                            background: `transparent !important`,
                            borderColor: 'transparent !important',
                            color: '#fff',
                            },
                        }}
                    >
                        Go to Homepage
                    </Button>
                </Box>
                <Link
                    href="https://www.timecapsuletoken.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    level="title-sm"
                    sx={{ textDecoration: 'none', color: '#aa1ff4', justifyContent: 'center' }}
                >
                Need help? Contact Support
                </Link>
            </Stack>
            </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © 
              <Link
                    href="https://www.timecapsuletoken.com/"
                    sx={{
                        ml: '5px',
                        mr: '5px',
                        background: `linear-gradient(90deg, #a001f2, #1ccad8, #a001f2)`,
                        backgroundSize: '200% 200%', // Double the size for sliding effect
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none', // Optional: Remove underline
                        animation: 'gradient-slide 3s linear infinite', // Animation applied here
                        '@keyframes gradient-slide': {
                            '0%': {
                            backgroundPosition: '0% 50%',
                            },
                            '25%': {
                            backgroundPosition: '50% 50%',
                            },
                            '50%': {
                            backgroundPosition: '100% 50%',
                            },
                            '75%': {
                            backgroundPosition: '50% 50%',
                            },
                            '100%': {
                            backgroundPosition: '0% 50%',
                            },
                        },
                        '&:hover': {
                            textDecoration: 'underline', // Optional: Add underline on hover
                        },
                    }}
                >
                    TimeCapsule
                </Link>
                {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
      sx={{
        height: '100%',
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        left: { xs: 0, md: '50vw' },
        overflow: 'hidden', // Ensure video doesn't overflow
        zIndex: -1, // Send video to the background
        '& video': {
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Ensure video covers the area
        },
      }}
    >
      <video autoPlay loop muted>
        <source src={NotFoundVid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
    </CssVarsProvider>
  );
}