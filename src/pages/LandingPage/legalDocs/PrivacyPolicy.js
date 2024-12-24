import * as React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import AppAppBar from '../../../components/LandingPage/AppAppBar'; // Adjust paths as needed
import Footer from '../../../components/LandingPage/Footer'; // Adjust paths as needed
import AppTheme from '../../../components/LandingPage/AppTheme'; // Ensure the path to AppTheme is correct

export default function PrivacyPolicy(props) {
  return (
    <AppTheme {...props}>
      <Box
        id="privacy-policy"
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
              Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Last Updated: 24/12/2024
            </Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />

          {/* Policy Content */}
          <Box sx={{ width: { xs: '100%', md: '80%' } }}>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Welcome to <strong>TimeCapsule Chat</strong> (“the dApp”). Your privacy is important to us. This Privacy Policy explains how we handle your information when you use our decentralized application.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - **Wallet Address**: We collect your wallet address to provide you with access to the dApp’s features and to ensure a unique login experience.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - **Usage Data**: Conversations in the chat dApp are processed and stored using Gun.js, a decentralized storage system.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - **Local Storage**: We use your browser’s local storage to maintain your login session. No other data is stored or tracked.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - The wallet address is used for authentication and to personalize your dApp experience.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - Conversations are encrypted and stored via Gun.js for seamless communication.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - We do not collect, analyze, or share any of your data for marketing or analytics purposes.
            </Typography>
             <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              3. Data Storage and Security
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - Conversations and related data are stored via Gun.js on a private relay controlled by us.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - All conversations are encrypted using a custom, proprietary encryption mechanism to ensure privacy and security.
            </Typography>
             <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              4. User Rights
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - Due to the decentralized nature of Gun.js and our private relay, users cannot request data deletion or access.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - We recommend ensuring your own privacy by managing your wallet security responsibly.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              5. Age Restrictions
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - There are no age restrictions for using the dApp. However, users are encouraged to understand and comply with the laws of their jurisdiction.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              6. Contact Information
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </Typography>
            <ul>
              <li>Email: <a href="mailto:info@timecapsuletoken.com">info@timecapsuletoken.com</a></li>
            </ul>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              7. Updates to This Policy
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - We reserve the right to update this Privacy Policy at any time. Users will be notified of significant changes through a notification on the dApp’s landing page.
            </Typography>
          </Box>
        </Container>
        <Divider sx={{ width: '100%', mt: 4 }} />
        <Footer />
      </Box>
    </AppTheme>
  );
}
