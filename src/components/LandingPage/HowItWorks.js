import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Stepper, Step, StepLabel, StepConnector } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ForumIcon from '@mui/icons-material/Forum';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';

// Custom Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {
    top: 22, // Adjust the vertical alignment of the connector
  },
  '& .MuiStepConnector-line': {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
    borderRadius: 1,
  },
}));

// Custom StepIcon component
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active ? theme.palette.primary.main : theme.palette.info.main,
  color: ownerState.active ? theme.palette.primary.light : theme.palette.primary.info,
  zIndex: 1,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.completed && {
    backgroundColor: theme.palette.success.main,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, icon } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }}>
      {icon}
    </CustomStepIconRoot>
  );
}

// Steps with labels, descriptions, and custom icons
const steps = [
  {
    label: 'Connect Your Wallet',
    description: 'Use your favorite crypto wallet like MetaMask or Coinbase Wallet to securely log in.',
    icon: <AccountBalanceWalletIcon />,
  },
  {
    label: 'Start a Chat',
    description: 'Enter a wallet address to initiate a secure and private conversation.',
    icon: <MapsUgcIcon />,
  },
  {
    label: 'Send a Message',
    description: 'Type and send encrypted messages directly to the recipient’s wallet.',
    icon: <ForumIcon />,
  },
];

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
        <Stepper
          alternativeLabel
          activeStep={-1}
          connector={<CustomConnector />}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon
                    {...props}
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
