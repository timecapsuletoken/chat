import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//import ChatImage from '../../assets/images/LandingPage/chat_communicating.gif';
import ChatVideo from '../../assets/videos/TCA_Chatting.mp4';
import ChatIcon from '@mui/icons-material/Chat'; 
import { styled } from '@mui/material/styles';
import GradientRotatingButton from '../../components/LandingPage/utils/GradientRotatingButton';

const StyledVideo = styled('video')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  marginTop: theme.spacing(8),
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  boxShadow: '0 0 12px 8px hsl(279.15deg 90.64% 53.92% / 30%)',
  borderRadius: 6,
  border: '1px solid transparent',
  background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
  //backgroundImage: `url(${ChatImage})`,  
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsl(279.15deg 90.64% 53.92% / 30%)',
    //backgroundImage: `url(${ChatImage})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderRadius: 6,
    border: '1px solid transparent',
    background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
  }),
}));

export default function Hero() {  
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(279.15deg 90.64% 53.92% / 50%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(279.15deg 90.64% 53.92% / 50%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Our&nbsp;latest&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.main',
                }),
              })}
            >
              dApp
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            TimeCapsule Chat is a simple platform for verified messaging from wallet
            owner-to-owner for outreach and social purposes.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            <GradientRotatingButton
              text="Go Chatting now"
              destination="/home"
              icon={<ChatIcon />}
              iconPosition="end"
            />
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            A Decentralized way to Communicate.
          </Typography>
        </Stack>
        <StyledVideo
          className="rotating-color"
          //src="https://storage.googleapis.com/tca_video/TCA_Chatting.mp4"
          src={ChatVideo}
          autoPlay
          loop
          muted
          playsInline
          alt="Dashboard Video"
          sx={{ 
            height: 'auto', 
            maxHeight: 700, 
            width: '100%',
          }}
        />
      </Container>
    </Box>
  );
}