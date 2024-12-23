import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaDiscord } from "react-icons/fa";
import { RiBnbFill } from "react-icons/ri";
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from '../LandingPage/SitemarkIcon';
import TCAicon1 from '../../assets/images/logos/logo.png';
import TCAicon2 from '../../assets/images/logos/devlogo.png';
import TCAicon3 from '../../assets/images/logos/frontendlogo.png';
import TCAicon4 from '../../assets/images/logos/communitylogo.png';
import TCAicon5 from '../../assets/images/logos/contributor.png';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://mui.com/">
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
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Subscribe for weekly updates. No spams ever!
            </Typography>
            <InputLabel htmlFor="email-newsletter">Email</InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="Enter your email address"
                placeholder="Your email address"
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'Enter your email address',
                  },
                }}
                sx={{ width: '250px' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                Subscribe
              </Button>
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
          <Link color="text.secondary" variant="body2" href="#">
            Features
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Testimonials
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Highlights
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Pricing
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            FAQs
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
          <Link color="text.secondary" variant="body2" href="#">
            About us
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Careers
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Press
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
          <Link color="text.secondary" variant="body2" href="#">
            Terms
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
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
          <Link color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        > 
          <IconButton
            color="inherit"
            size="small"
            href="https://bscscan.com/token/0x31aaB810b51f499340FC1e1B08716d2bC92C7A56"
            aria-label="BSCSCAN"
            sx={{ alignSelf: 'center' }}
          >
            <RiBnbFill />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.instagram.com/tcacoin/"
            aria-label="Instagram"
            sx={{ alignSelf: 'center' }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://x.com/TCACoin"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://discord.gg/wBkDaDvEgv"
            aria-label="Discord"
            sx={{ alignSelf: 'center' }}
          >
            <FaDiscord />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  </Box>
  );
}