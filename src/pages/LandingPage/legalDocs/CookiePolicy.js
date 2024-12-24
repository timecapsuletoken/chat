import * as React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import AppAppBar from '../../../components/LandingPage/AppAppBar'; // Adjust paths as needed
import Footer from '../../../components/LandingPage/Footer'; // Adjust paths as needed
import AppTheme from '../../../components/LandingPage/AppTheme'; // Ensure the path to AppTheme is correct

export default function CookiePolicy(props) {
  return (
    <AppTheme {...props}>
      <Box
        id="cookie-policy"
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
              Cookie Policy
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Last Updated: 24/12/2024
            </Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />

          {/* Policy Content */}
          <Box sx={{ width: { xs: '100%', md: '80%' } }}>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              At <strong>TimeCapsule Chat</strong> (“the dApp”), we prioritize your privacy and strive to minimize the collection of personal data. This Cookie Policy outlines our practices regarding cookies and similar technologies.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              1. Use of Cookies
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat does not use cookies, trackers, or analytics tools on the platform. We do not monitor your activity or collect data using browser cookies.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              2. Local Storage
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              To enhance your experience and keep you logged in, we use your browser’s local storage. This data is stored securely on your device and is not accessible to third parties.
            </Typography>
             <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              3. Third-Party Cookies
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Third-party wallets like MetaMask, Coinbase Wallet, or Trust Wallet may involve their respective privacy practices. Please review their policies to understand their cookie practices.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              4. Managing Your Preferences
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Since no cookies are used, there is no need to manage or adjust cookie preferences on this platform. However, you can clear your browser’s local storage through your browser settings.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              5. Updates to This Policy
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              We reserve the right to update this Cookie Policy at any time. Significant changes will be communicated through a notification on the dApp’s landing page.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              6. Contact Information
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              If you have any questions or concerns, please contact us:
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} >
              Email: <a href="mailto:info@timecapsuletoken.com">info@timecapsuletoken.com</a>
            </Typography>
          </Box>
        </Container>
        <Divider sx={{ width: '100%', mt: 4 }} />
        <Footer />
      </Box>
    </AppTheme>
  );
}
