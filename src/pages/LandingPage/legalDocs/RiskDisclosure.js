import * as React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import AppAppBar from '../../../components/LandingPage/AppAppBar'; // Adjust paths as needed
import Footer from '../../../components/LandingPage/Footer'; // Adjust paths as needed
import AppTheme from '../../../components/LandingPage/AppTheme'; // Ensure the path to AppTheme is correct

export default function RiskDisclosure(props) {
  return (
    <AppTheme {...props}>
      <Box
        id="risk-disclosure"
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
              Risk Disclosure
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Last Updated: 24/12/2024
            </Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />

          {/* Disclosure Content */}
          <Box sx={{ width: { xs: '100%', md: '80%' } }}>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Welcome to <strong>TimeCapsule Chat</strong> (“the dApp”). This Risk Disclosure aims to provide transparency about the potential risks and limitations associated with using our platform. By accessing or using the dApp, you acknowledge and accept these risks.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              1. Decentralized Nature of the dApp
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat is a decentralized application built on third-party technologies such as Gun.js. While we are continuously working to improve our platform, users may occasionally experience message delivery issues or service interruptions. We appreciate your understanding and encourage you to provide feedback through our #Feedback section.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              2. Blockchain and Web3 Risks
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Although TimeCapsule Chat collects minimal user information (e.g., wallet addresses), users should exercise caution when using blockchain-based systems. If you encounter issues with donations or other interactions, please let us know through the #Feedback section.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              3. Security Practices
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Users are responsible for safeguarding their wallet credentials, including private keys and seed phrases. While the dApp does not access this information, and messages are secured with custom encryption, it is critical to never share private keys or seed phrases with anyone—even within the dApp.
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              TimeCapsule Chat uses a proprietary encryption mechanism to ensure that only the sender and receiver have access to messages, adding an additional layer of security.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              4. Operational Risks
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              As a beta release, the dApp may experience occasional downtime or service disruptions. We are actively scaling and stabilizing the platform to minimize these occurrences and appreciate your patience during this phase.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              5. User Responsibility
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              Users are fully responsible for their actions on the platform. Any harmful, illegal, or malicious activity, including but not limited to harassment, spamming, or exploiting vulnerabilities, will result in an immediate ban. Such actions may also be reported to the community to maintain transparency and protect other users.
            </Typography>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              6. General Caution
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              While the dApp does not pose significant risks, we remind users to exercise caution:
            </Typography>
            <ul>
              <li>Avoid sharing private keys, seed phrases, or other sensitive wallet information.</li>
              <li>Ensure that you interact with the official TimeCapsule Chat platform to avoid phishing attempts or fraudulent dApps.</li>
            </ul>
              <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })} gutterBottom>
              If you have any concerns or encounter issues, please contact us through:
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
