import * as React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import AppAppBar from '../../../components/LandingPage/AppAppBar'; // Adjust paths as needed
import Footer from '../../../components/LandingPage/Footer'; // Adjust paths as needed
import AppTheme from '../../../components/LandingPage/AppTheme'; // Ensure the path to AppTheme is correct

export default function Disclaimer(props) {
  return (
    <AppTheme {...props}>
      <Box
        id="disclaimer"
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
              Disclaimer
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Last Updated: 24/12/2024
            </Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />

          {/* Disclaimer Content */}
          <Box sx={{ width: { xs: '100%', md: '80%' } }}>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Welcome to <strong>TimeCapsule Chat</strong> (“the dApp”). Please read this Disclaimer carefully before using our platform. By accessing or using the dApp, you agree to the terms outlined in this Disclaimer.
            </Typography>
                <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              1. Third-Party Technologies
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat is built on third-party technologies, including but not limited to React, Node.js, and Gun.js. While we strive to provide a stable platform, we are not responsible for issues arising from the operation or limitations of these technologies.
            </Typography>
             <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              2. Potential Issues
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              - **Loss of Messages**: Due to the decentralized nature of Gun.js, messages may occasionally fail to sync or be lost.<br/>
              - **Service Downtime**: As a growing project, there may be periods of downtime or interruptions as we work to scale and stabilize the platform. We appreciate your patience and support during these times.<br/>
              - **Beta Release**: The dApp is currently in a beta phase, which means users may encounter bugs or unexpected issues.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              3. Wallet Providers
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat integrates with third-party wallet providers, including MetaMask, Coinbase Wallet, and Trust Wallet. While we rely on these providers for authentication, we do not control their functionality or security. Users are encouraged to review the terms and conditions of their chosen wallet provider and ensure the security of their wallet credentials.
            </Typography>
             <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              4. User Data and Security
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              The dApp does not access or store private keys, seed phrases, or sensitive wallet credentials. We only process wallet addresses to confirm user identity and ensure unique access to the platform. Users are responsible for the security of their wallets and should take precautions to prevent unauthorized access.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              5. Service Availability
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              We make no guarantees regarding the uninterrupted availability of the dApp. While we strive to minimize downtime, interruptions may occur due to maintenance, technical issues, or scaling efforts.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              6. Donations
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Users who wish to support the development and maintenance of the platform may do so through voluntary BNB donations. Donations are not required to access the dApp’s features and do not entitle users to additional privileges or services.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              7. Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat, its developers, and affiliates shall not be held liable for:
            </Typography>
            <ul>
              <li>Any loss of messages or data resulting from technical issues.</li>
              <li>Financial losses or damages incurred through the use of the dApp.</li>
              <li>Security breaches or vulnerabilities in third-party wallet providers.</li>
            </ul>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              8. Contact Information
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              If you have any questions or concerns about this Disclaimer, please contact us at:
            </Typography>
            <ul>
              <li>Email: <a href="mailto:info@timecapsuletoken.com">info@timecapsuletoken.com</a></li>
            </ul>
          </Box>
        </Container>
        <Divider sx={{ width: '100%', mt: 4 }} />
        <Footer />
      </Box>
    </AppTheme>
  );
}
