// TermsOfService.js
import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import AppAppBar from '../../../components/LandingPage/AppAppBar';
import Footer from '../../../components/LandingPage/Footer';
import AppTheme from '../../../components/LandingPage/AppTheme';

const TermsOfService = () => {
  return (
    <AppTheme>
      <Box
        id="terms-of-service"
        sx={(theme) => ({
          pt: { xs: 8, sm: 12 },
          pb: { xs: 4, sm: 8 },
          color: theme.palette.text.primary,
          bgcolor: theme.palette.background.default,
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
              Terms of Service
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Last Updated: 24/12/2024
            </Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />

          {/* Terms Content */}
          <Box sx={{ width: { xs: '100%', md: '80%' } }}>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Welcome to <strong>TimeCapsule Chat</strong> (“the dApp”). By using our platform, you agree to abide by the terms outlined in this document.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              1. General Information
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              TimeCapsule Chat is a decentralized application under the domain www.timecapsuletoken.com. User authentication is handled solely via wallet addresses through MetaMask, Trust Wallet, and Coinbase Wallet. Users must manage their wallet security.
            </Typography>

                <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              2. User Responsibilities
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              Users must not engage in spamming, harassment, or exploiting vulnerabilities. Violators will be banned and reported to the community. While we strive for amicable resolutions, legal action may be pursued for severe cases if required.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              3. Third-Party Wallet Providers
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              TimeCapsule Chat integrates with MetaMask, Coinbase Wallet, and Trust Wallet. We are not responsible for the functionality or security of these providers. Users must safeguard their wallet credentials, including private keys and seed phrases.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              4. User-Generated Content
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              Users retain ownership of their generated content (e.g., messages). However, all interactions must comply with the dApp’s rules and guidelines. The platform currently supports communication only within the dApp environment.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              5. Service Availability
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              We strive to provide uninterrupted service. However, downtime may occur due to scaling, maintenance, or critical bugs. We will work diligently to minimize disruptions and ensure the platform's availability for the community.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              6. Updates to the Terms of Service
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              We reserve the right to update these Terms of Service at any time. Significant changes will be communicated through a notification on the landing page.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              7. Governing Law and Dispute Resolution
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
                These Terms are governed by the laws of Switzerland. Disputes will be resolved through arbitration under the rules of the Swiss Chambers' Arbitration Institution.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              8. Feedback and Suggestions
            </Typography>
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              Users are encouraged to provide feedback through the dedicated Feedback section. By submitting suggestions, you grant the platform the right to use them without additional compensation.
            </Typography>

            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} paragraph>
              For any questions or concerns, contact us at:
            </Typography>
            <Typography sx={(theme) => ({ fontWeight: 'bold', color: theme.palette.text.secondary })} paragraph>
              Email: info@timecapsuletoken.com
            </Typography>
          </Box>
        </Container>
        <Divider sx={{ width: '100%', mt: 4 }} />
        <Footer />
      </Box>
    </AppTheme>
  );
};

export default TermsOfService;