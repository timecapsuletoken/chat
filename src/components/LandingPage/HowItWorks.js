import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Stepper, Step, StepLabel } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';

// Steps with labels, descriptions, and custom icons
const steps = [
  {
    label: 'Connect Your Wallet',
    description: 'Use your favorite crypto wallet like MetaMask or Coinbase Wallet to securely log in.',
    icon: <AccountBalanceWalletIcon sx={{ color: 'info.light' }} />,
  },
  {
    label: 'Start a Chat',
    description: 'Enter a wallet address to initiate a secure and private conversation.',
    icon: <ChatBubbleOutlineIcon sx={{ color: 'info.light' }} />,
  },
  {
    label: 'Send a Message',
    description: 'Type and send encrypted messages directly to the recipient’s wallet.',
    icon: <SendIcon sx={{ color: 'info.light' }} />,
  },
];

// Custom StepIcon component
function CustomStepIcon({ icon, active, completed, className }) {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: active || completed ? 'primary.main' : 'grey.300',
        color: active || completed ? 'white' : 'grey.700',
        fontSize: 18,
        fontWeight: 'bold',
      }}
    >
      {icon}
    </Box>
  );
}

export default function HowItWorks() {
  return (
    <Container
      id="how-it-works"
      sx={{
        py: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      {/* Title */}
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: 'center',
        }}
      >
        <Typography
          component="h2"
          variant="gradientText"
          gutterBottom
        >
          How It Works
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Follow these simple steps to start using TimeCapsule Chat for secure and decentralized communication.
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        <Stepper activeStep={-1} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon
                    icon={step.icon || index + 1} // Use icon or fallback to number
                  />
                )}
              >
                <Typography variant="h6" sx={{ color: 'text.primary' }}>{step.label}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
}
