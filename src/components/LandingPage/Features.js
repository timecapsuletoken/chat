import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { styled, keyframes } from '@mui/material/styles';

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
//import DevicesIcon from '@mui/icons-material/Devices';
import HubIcon from '@mui/icons-material/Hub';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ChattingImage from '../../assets/images/LandingPage/objects/web3.gif';
import DecDRelay from '../../assets/images/LandingPage/objects/chip-folder.png';
import secureWNetwork from '../../assets/images/LandingPage/objects/key-folder.png';

import featureShape2 from '../../assets/images/LandingPage/objects/feature-shape-2-1.svg';

// Define the orbiting animation
const orbitAnimation = keyframes`
  0% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
  }
  50% {
    transform: rotate(180deg) translateX(50px) rotate(-180deg);
  }
  100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
  }
`;

// Styled component for the orbiting image
const OrbitingImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '-20%',
  transform: 'translate(-50%, -50%)',
  width: '150px',
  height: '150px',
  animation: `${orbitAnimation} 10s linear infinite`,
  pointerEvents: 'none', // Prevent interaction
  [theme.breakpoints.up('md')]: {
    width: '200px',
    height: '200px',
  },
}));

const items = [
  {
    icon: <QuestionAnswerIcon />,
    title: 'Decentralized Chat',
    description:
      'Communicate securely with friends and colleagues using a fully decentralized, peer-to-peer messaging system. Your data is encrypted and never stored on centralized servers.',
    imageLight: `url("${ChattingImage}")`,
    imageDark: `url("${ChattingImage}")`,
  },
  {
    icon: <AccountBalanceWalletIcon />,
    title: 'Secure Wallet Integration',
    description:
      'Seamlessly connect with your crypto wallet to manage your identity and chat securely. No need for extra signups — your wallet is your gateway.',
    imageLight: `url("${secureWNetwork}")`,
    imageDark: `url("${secureWNetwork}")`,
  },
  /*
  {
    icon: <DevicesIcon />,
    title: 'Multi-Device Login',
    description:
      'Access your account and continue your conversations seamlessly across multiple devices. Your decentralized identity ensures secure and synchronized data, no matter where you log in.',
    imageLight: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/devices-light.png")`,
    imageDark: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/devices-dark.png")`,
  },
  */
  {
    icon: <HubIcon />,
    title: 'Decentralized Data Relay',
    description:
      'Your data is stored and synchronized using a private Gun.js relay, ensuring optimal performance without sacrificing decentralization.',
    imageLight: `url("${DecDRelay}")`,
    imageDark: `url("${DecDRelay}")`,
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 280,
            backgroundImage: 'var(--items-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--items-imageDark)',
            }),
          })}
          style={
            items[selectedItemIndex]
              ? {
                  '--items-imageLight': items[selectedItemIndex].imageLight,
                  '--items-imageDark': items[selectedItemIndex].imageDark,
                }
              : {}
          }
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 }, width: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <OrbitingImage src={featureShape2} alt="Orbiting Feature Decoration" />
      </Box>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="gradientText"
          gutterBottom
        >
          dApp Features
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Discover the powerful capabilities of our decentralized application (dApp), designed to provide a secure, seamless, and personalized user experience. From private, encrypted chats to wallet integration and real-time synchronization across multiple devices, our features are tailored to empower your communication and data management needs in the decentralized web
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}

                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                m: 'auto',
                width: '100%',
                height: '100%',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: 'var(--items-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--items-imageDark)',
                }),
              })}
              style={
                items[selectedItemIndex]
                  ? {
                      '--items-imageLight': items[selectedItemIndex].imageLight,
                      '--items-imageDark': items[selectedItemIndex].imageDark,
                    }
                  : {}
              }
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
