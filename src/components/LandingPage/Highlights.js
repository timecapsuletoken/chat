import * as React from 'react';
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
          <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
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
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  p: 3,
                  height: '100%',
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.paper, // Dynamic card background
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
