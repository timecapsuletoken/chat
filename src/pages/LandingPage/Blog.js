import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import Helmet and HelmetProvider
import { CssBaseline, Container, Box } from '@mui/material';
import AppAppBar from '../../components/LandingPage/AppAppBar';
import MainContent from '../../components/LandingPage/Blog/MainContent';
import Footer from '../../components/LandingPage/Footer';
import AppTheme from '../../components/LandingPage/AppTheme';

export default function Blog(props) {
  return (
    <HelmetProvider>
      <AppTheme {...props}>
        <Helmet>
          {/* Basic Meta Tags */}
          <title>TimeCapsule Chat - Blog</title>
          <meta name="description" content="Discover the features of TimeCapsule Chat, a secure and decentralized communication platform. Learn how it leverages blockchain technology to redefine messaging." />
          <meta name="keywords" content="TimeCapsule Chat, decentralized messaging, secure chat, Web3 communication" />
          <meta name="author" content="TimeCapsule Team" />

          {/* Open Graph (OG) Tags */}
          <meta property="og:title" content="TimeCapsule Chat - Blog" />
          <meta property="og:description" content="Discover the features of TimeCapsule Chat, a secure and decentralized communication platform. Learn how it leverages blockchain technology to redefine messaging." />
          <meta property="og:url" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/blog`} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/${process.env.REACT_APP_BASE_METATAG_IMAGE}`} />
          <meta property="og:locale" content="en_US" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="TimeCapsule Chat - Blog" />
          <meta name="twitter:description" content="Discover the features of TimeCapsule Chat, a secure and decentralized communication platform. Learn how it leverages blockchain technology to redefine messaging." />
          <meta name="twitter:image" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/${process.env.REACT_APP_BASE_METATAG_IMAGE}`} />
        </Helmet>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
        >
          <MainContent />
        </Container>
        <Box sx={{ borderTop: 'solid 1px #333', }}>
          <Footer />
        </Box>
      </AppTheme>
    </HelmetProvider>
  );
}