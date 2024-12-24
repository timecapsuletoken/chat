import * as React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import AppAppBar from '../../../components/LandingPage/AppAppBar'; // Adjust paths as needed
import Footer from '../../../components/LandingPage/Footer'; // Adjust paths as needed
import AppTheme from '../../../components/LandingPage/AppTheme'; // Ensure the path to AppTheme is correct

export default function TermsAndConditions(props) {
  return (
    <AppTheme {...props}>
      <Box
        id="terms-and-conditions"
        sx={(theme) => ({
          pt: { xs: 8, sm: 12 },
          pb: { xs: 4, sm: 8 },
          color: theme.palette.text.primary, // Dynamic text color
          bgcolor: theme.palette.background.default, // Dynamic background color
        })}
      >
        <AppAppBar />
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 3, sm: 6 },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: 'center',
              width: { xs: '100%', md: '60%' },
              mt: 4,
              mb: 0,
            }}
          >
            <Typography
              component="h2"
              variant="h4"
              gutterBottom
              sx={(theme) => ({ fontWeight: 'bold', color: theme.palette.text.primary })}
            >
              Terms and Conditions
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })}>
              Last Updated: 24/12/2024
            </Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />

          {/* Terms Content */}
          <Box sx={{ width: { xs: '100%', md: '80%' } }}>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Welcome to <strong>TimeCapsule Chat</strong> (“the dApp”). By accessing or using the dApp, you agree to these Terms and Conditions. If you do not agree, please refrain from using the dApp.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              1. General Information
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat is a decentralized application owned and operated under the name <strong>TimeCapsule</strong> (domain: <a href="https://www.timecapsuletoken.com" target="_blank" rel="noopener noreferrer">www.timecapsuletoken.com</a>).
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              This platform is not registered as a business entity.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              2. Eligibility
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              There is no minimum age requirement for using the dApp.
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              The dApp is accessible worldwide, without geographical restrictions.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              3. Purpose and Features
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat provides a decentralized platform for secure and private communication within the web3 space.
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              The dApp integrates with MetaMask, Coinbase, and Trust Wallet for wallet-based login functionality.
            </Typography>
            <Typography variant="body1"  sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              <strong>Free of Charge:</strong> The dApp is completely free to use, with no fees or charges for its services.
            </Typography>
            {/* Add similar sections for remaining terms */}
          </Box>
        </Container>
        <Divider sx={{ width: '100%', mt: 4 }} />
        <Footer />
      </Box>
    </AppTheme>
  );
}
