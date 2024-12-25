import * as React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import StarsIcon from '@mui/icons-material/Stars';
import BoltIcon from '@mui/icons-material/Bolt';
import SecurityIcon from '@mui/icons-material/Security';
import GridViewIcon from '@mui/icons-material/GridView';
import DevicesIcon from '@mui/icons-material/Devices';
import HandshakeIcon from '@mui/icons-material/Handshake';

// Define the gradient ball animation
const gradientAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100px);
  }
  100% {
    transform: translateY(0);
  }
`;

// Styled component for the gradient ball
const GradientBall = styled('div')(({ theme }) => ({
  width: '250px',
  height: '250px',
  background: 'radial-gradient(114.99% 94.16% at 72.92% 82.18%, #111 47.39%, #091534 68.23%, #a24dd6 86.63%)',
  borderRadius: '50%',
  position: 'absolute',
  right: '20px',
  bottom: '50%',
  zIndex: 100,
  opacity: 0.8,
  animation: `${gradientAnimation} 6s infinite linear`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

// Styled component for the text inside the ball
const BallText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main, // Dynamic color
  fontSize: '30px',
  textAlign: 'center',
  //fontWeight: 'bold',
  zIndex: 1,
}));

const items = [
  {
    icon: <StarsIcon />,
    title: 'Unmatched Privacy',
    description:
      'Experience ultimate privacy with peer-to-peer encrypted messaging. Your conversations stay between you and your contacts—always.',
  },
  {
    icon: <BoltIcon />,
    title: 'Lightning-Fast Performance',
    description:
      'Powered by decentralized technology, enjoy real-time updates and seamless synchronization across all your devices.',
  },
  {
    icon: <SecurityIcon />,
    title: 'Secure Wallet Integration',
    description:
      'Easily connect your crypto wallet for authentication. Your wallet is your key to a secure and personalized experience.',
  },
  {
    icon: <GridViewIcon />,
    title: 'Decentralized and Reliable',
    description:
      'Built on Gun.js technology, your data is stored securely across a decentralized network, ensuring reliability without compromising speed.',
  },
  {
    icon: <DevicesIcon />,
    title: 'Multi-Device Synchronization',
    description:
      'Start a conversation on one device and seamlessly continue it on another. Your data stays synchronized in real-time.',
  },
  {
    icon: <HandshakeIcon />,
    title: 'Seamless Collaboration',
    description:
      'Effortlessly connect and collaborate with others in a decentralized ecosystem. Enhance your productivity with reliable and secure tools designed for teamwork.',
  },
];

export default function Highlights() {

  return (
    <Box
      id="highlights"
      sx={(theme) => ({
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: theme.palette.text.primary, // Adapts to light or dark mode
        bgcolor: theme.palette.background.default, // Dynamic background color
      })}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <GradientBall>
          <BallText>TCA</BallText>
        </GradientBall>
      </Box>
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="gradientText" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })}>
            Explore the standout features of our dApp that make it unique. From unparalleled privacy to lightning-fast performance and seamless multi-device synchronization, these highlights showcase the best of what our decentralized application has to offer. Designed with innovation and user empowerment at its core, each feature is crafted to elevate your experience in the decentralized world.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                className="rotating-color"
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid transparent',
                  background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
                  boxShadow: theme.shadows[1],
                })}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
