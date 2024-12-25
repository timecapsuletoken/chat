import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from '../../components/LandingPage/AppAppBar';
import Hero from '../../components/LandingPage/Hero';
import LogoCollection from '../../components/LandingPage/LogoCollection';
import HowItWorks from '../../components/LandingPage/HowItWorks';
import Highlights from '../../components/LandingPage/Highlights';
import Donations from '../../components/LandingPage/Donations';
import Feedback from '../../components/LandingPage/Feedback';
//import Pricing from '../../components/LandingPage/Pricing';
import Features from '../../components/LandingPage/Features';
//import Testimonials from '../../components/LandingPage/Testimonials';
import FAQ from '../../components/LandingPage/FAQ';
import Footer from '../../components/LandingPage/Footer';
import AppTheme from '../../components/LandingPage/AppTheme';
import { useGradientRotadingEffect } from '../../components/LandingPage/utils/useGradientRotadingEffect'; // Import the custom hook

export default function MarketingPage(props) {

  useGradientRotadingEffect();
  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        {/*<Divider />*/}
        {/*<Testimonials />*/}
        <Divider />
        <HowItWorks />
        <Divider />
        <Highlights />
        <Divider />
        <Donations />
        <Divider />
        <Feedback />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
