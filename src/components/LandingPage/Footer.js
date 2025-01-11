import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GradientRotatingButton from '../../components/LandingPage/utils/GradientRotatingButton';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaDiscord } from "react-icons/fa";
import { RiBnbFill } from "react-icons/ri";
import TwitterIcon from '@mui/icons-material/X';
import ChatIcon from '@mui/icons-material/Chat'; 
import SitemarkIcon from '../LandingPage/SitemarkIcon';
import TCAicon1 from '../../assets/images/logos/logo.png';
import TCAicon2 from '../../assets/images/logos/devlogo.png';
import TCAicon3 from '../../assets/images/logos/frontendlogo.png';
import TCAicon4 from '../../assets/images/logos/communitylogo.png';
import TCAicon5 from '../../assets/images/logos/contributor.png';
import TCAicon6 from '../../assets/images/LandingPage/objects/feature-shape-2-3.png';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link
        href="https://www.timecapsuletoken.com/"
        sx={{
          background: `linear-gradient(90deg, #a001f2, #1ccad8, #a001f2)`,
          backgroundSize: '200% 200%', // Double the size for sliding effect
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none', // Optional: Remove underline
          animation: 'gradient-slide 3s linear infinite', // Animation applied here
          '@keyframes gradient-slide': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '25%': {
              backgroundPosition: '50% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '75%': {
              backgroundPosition: '50% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
          '&:hover': {
            textDecoration: 'underline', // Optional: Add underline on hover
          },
        }}
      >
        TimeCapsule
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

const bouncingImages = [
  { src: TCAicon1, alt: 'Logo 1' },
  { src: TCAicon2, alt: 'Logo 2' },
  { src: TCAicon3, alt: 'Logo 3' },
  { src: TCAicon4, alt: 'Logo 4' },
  { src: TCAicon5, alt: 'Logo 5' },
  { src: TCAicon6, alt: 'Logo 6' },
];

export default function Footer() {
  const footerRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  
  // Capture the footer dimensions
  React.useEffect(() => {
    if (footerRef.current) {
      const { offsetWidth, offsetHeight } = footerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [footerRef]);

  return (
  <Box
    ref={footerRef}
    sx={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
  >
    {/* Animated Floating Images */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {bouncingImages.map((image, index) => (
        <motion.img
          key={index}
          src={image.src}
          alt={image.alt}
          style={{
            position: 'absolute',
            width: '60px',
            height: '60px',
          }}
          initial={{
            x: Math.random() * dimensions.width, // Random initial position within width
            y: Math.random() * dimensions.height, // Random initial position within height
          }}
          animate={{
            x: [
              Math.random() * dimensions.width, // Constrain movement horizontally
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
            ],
            y: [
              Math.random() * dimensions.height, // Constrain movement vertically
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
          }}
          transition={{
            duration: 5 + Math.random() * 3, // Randomize speed
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <SitemarkIcon />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2, color: 'text.primary' }}>
              Your Gateway to Private Messaging
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Experience seamless and secure communication powered by blockchain technology. Stay connected, stay private
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', mb: 1, fontWeight: 'bold' }}>Fast. Free. Decentralized.</Typography>
            <Stack direction="row" spacing={1} useFlexGap>
              <GradientRotatingButton
                text="Go Chatting now"
                icon={<ChatIcon />}
                iconPosition="end"
                destination={'/home'} // Trigger the donate function
              />
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Product
          </Typography>
          <Link color="text.secondary" variant="body2" href="/#features">
            Features
          </Link>
          <Link color="text.secondary" variant="body2" href="/#how-it-works">
            How It Works
          </Link>
          <Link color="text.secondary" variant="body2" href="/#highlights">
            Highlights
          </Link>
          <Link color="text.secondary" variant="body2" href="/#faq">
            FAQs
          </Link>
          <Link color="text.secondary" variant="body2" href="/blog">
            Blog
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Company
          </Typography>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://www.timecapsuletoken.com/">
            About us
          </Link>
          <Link color="text.secondary" variant="body2" href="/#donations">
            Donations
          </Link>
          <Link color="text.secondary" variant="body2" href="/#feedback">
            Feedback
          </Link>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://www.timecapsuletoken.com/assets/pdfs/whitepaper.pdf">
            Whitepaper
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Legal
          </Typography>
          <Link color="text.secondary" variant="body2" href="/terms-and-conditions">
            Terms & Conditions
          </Link>
          <Link color="text.secondary" variant="body2" href="/cookie-policy">
            Cookie Policy
          </Link>
          <Link color="text.secondary" variant="body2" href="/disclaimer">
            Disclaimer
          </Link>
          <Link color="text.secondary" variant="body2" href="/risk-disclosure">
            Risk Disclosure
          </Link>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://www.timecapsuletoken.com/contact">
            Contact
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Link color="text.secondary" variant="body2" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="/tos">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          height='50%'
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        > 
          <Box
            className="rotating-gradient-wrapper"
            sx={(theme) => ({
              width: '100%',
              height: '100%',
              padding: '1px',
              borderRadius: '8px',
              background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
            })}
          >
            <IconButton
              target="_blank"
              href="https://bscscan.com/token/0x31aaB810b51f499340FC1e1B08716d2bC92C7A56"
              aria-label="BSCSCAN"
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                background: `${theme.palette.background.default} !important`,
                color: theme.palette.text.primary,
                '&:hover': {
                  background: `${theme.palette.action.hover} !important`,
                  borderColor: 'transparent !important',
                },
              })}
            >
              <RiBnbFill /> 
            </IconButton>
          </Box>
          <Box
            className="rotating-gradient-wrapper"
            sx={(theme) => ({
              width: '100%',
              height: '100%',
              padding: '1px',
              borderRadius: '8px',
              background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
            })}
          >
            <IconButton
              target="_blank"
              href="https://www.instagram.com/tcacoin/"
              aria-label="Instagram"
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                background: `${theme.palette.background.default} !important`,
                color: theme.palette.text.primary,
                '&:hover': {
                  background: `${theme.palette.action.hover} !important`,
                  borderColor: 'transparent !important',
                },
              })}
            >
              <InstagramIcon /> 
            </IconButton>
          </Box>
          <Box
            className="rotating-gradient-wrapper"
            sx={(theme) => ({
              width: '100%',
              height: '100%',
              padding: '1px',
              borderRadius: '8px',
              background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
            })}
          >
            <IconButton
              target="_blank"
              href="https://x.com/TCACoin"
              aria-label="X"
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                background: `${theme.palette.background.default} !important`,
                color: theme.palette.text.primary,
                '&:hover': {
                  background: `${theme.palette.action.hover} !important`,
                  borderColor: 'transparent !important',
                },
              })}
            >
              <TwitterIcon /> 
            </IconButton>
          </Box>
          <Box
            className="rotating-gradient-wrapper"
            sx={(theme) => ({
              width: '100%',
              height: '100%',
              padding: '1px',
              borderRadius: '8px',
              background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
            })}
          >
            <IconButton
              target="_blank"
              href="https://discord.gg/wBkDaDvEgv"
              aria-label="Discord"
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                background: `${theme.palette.background.default} !important`,
                color: theme.palette.text.primary,
                '&:hover': {
                  background: `${theme.palette.action.hover} !important`,
                  borderColor: 'transparent !important',
                },
              })}
            >
              <FaDiscord /> 
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Container>
  </Box>
  );
}
