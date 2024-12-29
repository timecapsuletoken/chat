import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import SitemarkIcon from '../components/LandingPage/SitemarkIcon';
import AppTheme from '../components/LandingPage/AppTheme';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import KeyIcon from '@mui/icons-material/Key';
import { motion } from 'framer-motion';
import GradientRotatingButton from '../components/LandingPage/utils/GradientRotatingButton';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  backgroundColor: 'hsl(0deg 0% 20% / 40%) !important',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsl(279.15deg 90.64% 53.92% / 10%), hsl(0deg 0% 10.2%))',
    }),
  },
}));


const LockedScreen = (props) => {
  const { account, onUnlock } = props;
  console.log('Account received in LockedScreen:', account); // Debugging: Log the account
  
  const [pinInput, setPinInput] = React.useState('');
  const [error, setError] = React.useState('');
  const [generatedPin, setGeneratedPin] = React.useState('');
  const [animate, setAnimate] = React.useState(false);

  const handleForgotPasswordClick = () => {
    setAnimate(true); // Trigger the wiggle animation
    setTimeout(() => setAnimate(false), 600); // Reset the animation after 0.6 seconds
  };

  const generatePinFromAddress = (account) => {
    if (account.length !== 42 || !account.startsWith('0x')) {
      throw new Error('Invalid Ethereum address');
    }
    return `${account[4]}${account[13]}${account[26]}${account[39]}`.toUpperCase();
    };

  React.useEffect(() => {
    if (account) {
      const pin = generatePinFromAddress(account);
      setGeneratedPin(pin); // Save the generated PIN to state
      console.log('Generated PIN:', pin); // Log the PIN
    }
  }, [account]);

  const handleUnlock = (event) => {
    event.preventDefault();
    if (pinInput === generatedPin) {
      // Update the user:cache:timestamp in localStorage
      const currentTimestamp = Date.now();
      localStorage.setItem('user:cache:timestamp', JSON.stringify({ timestamp: currentTimestamp }));
      onUnlock(); // Callback to unlock the HomePage
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '100%', // Ensure it spans the full height of the parent
            }}
          >
            <SitemarkIcon />
          </Box>
          <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '100%', // Ensure it spans the full height of the parent
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'background.default' }}>
                <LockOutlinedIcon color="primary"/>
            </Avatar>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Screen Locked
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleUnlock}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
                <TextField
                    id="filled-multiline-flexible"
                    label="Enter PIN"
                    variant="filled"
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    error={!!error}
                    helperText={error}
                    name="password"
                    required
                    fullWidth
                    color={error ? 'error' : 'primary'}
                />
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<KeyIcon />}
            >
              Unlock
            </Button>
            <Link
                component="button"
                type="button"
                variant="body2"
                sx={{ alignSelf: 'center' }}
                onClick={handleForgotPasswordClick} // Attach the click handler
            >
                Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <motion.div
                animate={
                    animate
                    ? { rotate: [0, 10, -10, 10, -10, 0] } // Wiggle animation
                    : { rotate: 0 } // Default state
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
            >
                <GradientRotatingButton
                    text="Sign in"
                    icon={<LoginIcon />}
                    iconPosition="end"
                    destination={'/login'}
                />
            </motion.div>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
};

LockedScreen.propTypes = {
  account: PropTypes.string.isRequired,
  onUnlock: PropTypes.func.isRequired,
};

export default LockedScreen;