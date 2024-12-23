import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import { motion } from 'framer-motion';

// White Logos
import BNBWhiteLogo from '../../assets/images/logos/partners/bnb-chain-white.svg';
import MetaMaskWhiteLogo from '../../assets/images/logos/partners/metamask-white.svg';
import CoinbaseWhiteLogo from '../../assets/images/logos/partners/coinbase-white.svg';
import TrustWalletWhiteLogo from '../../assets/images/logos/partners/trust-wallet-white.svg';
import EthWhiteLogo from '../../assets/images/logos/partners/ethereum-white.svg';
import GunJsWhiteLogo from '../../assets/images/logos/partners/gunjs-white.svg';
// Black Logos
import BNBBlackLogo from '../../assets/images/logos/partners/bnb-chain-black.svg';
import MetaMaskBlackLogo from '../../assets/images/logos/partners/metamask-black.svg';
import CoinbaseBlackLogo from '../../assets/images/logos/partners/coinbase-black.svg';
import TrustWalletBlackLogo from '../../assets/images/logos/partners/trust-wallet-black.svg';
import EthBlackLogo from '../../assets/images/logos/partners/ethereum-black.svg';
import GunJsBlackLogo from '../../assets/images/logos/partners/gunjs-black.svg';

const whiteLogos = [
  BNBWhiteLogo,
  EthWhiteLogo,
  MetaMaskWhiteLogo,
  CoinbaseWhiteLogo,
  TrustWalletWhiteLogo,
  GunJsWhiteLogo,
];

const darkLogos = [
  BNBBlackLogo,
  EthBlackLogo,
  MetaMaskBlackLogo,
  CoinbaseBlackLogo,
  TrustWalletBlackLogo,
  GunJsBlackLogo,
];

const logoStyle = {
  width: '100px',
  height: '30px',
  margin: '32px 32px',
  objectFit: 'contain',
};

const motionVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.1, rotate: 2 },
};

export default function LogoCollection() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4, textAlign: 'center' }}>
      <Typography
        component="p"
        variant="subtitle2"
        sx={{ color: 'text.secondary', fontWeight: 'bold' }}
      >
        Enabled by Cutting-Edge Solutions
      </Typography>
      <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 2 }}>
        {logos.map((logo, index) => (
          <Grid item key={index}>
            <motion.img
              src={logo}
              alt={`Trusted partner ${index + 1}`}
              style={logoStyle}
              variants={motionVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
                delay: index * 0.1,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
