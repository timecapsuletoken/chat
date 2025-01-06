import * as React from 'react';
import { CssBaseline, Container, Box } from '@mui/material';
import AppAppBar from '../../components/LandingPage/AppAppBar';
import MainContent from '../../components/LandingPage/Blog/MainContent';
import Footer from '../../components/LandingPage/Footer';
import AppTheme from '../../components/LandingPage/AppTheme';

export default function Blog(props) {
  return (
    <AppTheme {...props}>
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
  );
}