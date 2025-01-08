import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import Helmet and HelmetProvider
import { useInView } from 'react-intersection-observer';
import Skeleton from '@mui/material/Skeleton';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import AppTheme from '../../components/LandingPage/AppTheme';
import { useGradientRotadingEffect } from '../../components/LandingPage/utils/useGradientRotadingEffect'; // Import the custom hook

const AppAppBar = React.lazy(() => import('../../components/LandingPage/AppAppBar'));
const Hero = React.lazy(() => import('../../components/LandingPage/Hero'));
const LogoCollection = React.lazy(() => import('../../components/LandingPage/LogoCollection'));
const HowItWorks = React.lazy(() => import('../../components/LandingPage/HowItWorks'));
const Highlights = React.lazy(() => import('../../components/LandingPage/Highlights'));
const Donations = React.lazy(() => import('../../components/LandingPage/Donations'));
const Feedback = React.lazy(() => import('../../components/LandingPage/Feedback'));
const Features = React.lazy(() => import('../../components/LandingPage/Features'));
const FAQ = React.lazy(() => import('../../components/LandingPage/FAQ'));
const Footer = React.lazy(() => import('../../components/LandingPage/Footer'));

// Lazy Load Wrapper with Intersection Observer
const LazyLoadComponent = ({ Component, SkeletonComponent }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '0px' });
  const [loading, setLoading] = React.useState(true);
  const devMode = true; // Set to true to force Skeleton visibility

  React.useEffect(() => {
    if (!devMode && inView)  {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Delay of 2 seconds
      return () => clearTimeout(timer);
    }
  }, [inView, devMode]);

  return (
    <div ref={ref}>
      {loading ? (
        SkeletonComponent || null
      ) : (
        <React.Suspense fallback={SkeletonComponent}>
          <Component />
        </React.Suspense>
      )}
    </div>
  );
};

const LogoCollectionSkeleton = (
  <Box
    sx={{
      width: '100%',
      display: 'flex', // Flexbox layout
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
      flexDirection: { xs: 'column' }, // Column layout for mobile
      flexWrap: { xs: 'wrap' }, // Wrap children to enable multiple rows
      '& > *': {
        width: { xs: '50%' }, // Make children take 50% width for 2 columns
      },
    }}
  >
    <Grid2 
      container 
      rowSpacing={2} 
      columnSpacing={{ xs: 4, sm: 2, md: 3 }} 
      sx={{ 
        maxWidth: '100%',
        justifyContent: {
          xs: 'center',
          sm: 'center',
          lg: 'center',
        }, 
      }}
    >
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '50px', sm: '100px', md: '120px' }, // Responsive width
            height: { xs: '25px', sm: '50px', md: '60px' }, // Responsive height
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '50px', sm: '100px', md: '120px' },
            height: { xs: '25px', sm: '50px', md: '60px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '50px', sm: '100px', md: '120px' },
            height: { xs: '25px', sm: '50px', md: '60px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '50px', sm: '100px', md: '120px' },
            height: { xs: '25px', sm: '50px', md: '60px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '50px', sm: '100px', md: '120px' },
            height: { xs: '25px', sm: '50px', md: '60px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '50px', sm: '100px', md: '120px' },
            height: { xs: '25px', sm: '50px', md: '60px' },
          }}
        />
      </Grid2>
    </Grid2>
  </Box>
);


const FeaturesSkeleton = (
<Box
  sx={{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 2,
    mt: 10,
    mb: 10,
  }}
>
  <Grid2
    container
    spacing={2}
    sx={{
      maxWidth: '100%',
      justifyContent: {
        xs: 'center',
      },
      flexDirection: {
        xs: 'column-reverse',
      },
    }}
  >
    {/* Left Box */}
    <Grid2 xs={12} md={6}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: { xs: '200px', md: '400px' },
          height: { xs: '200px', md: '350px' },
          borderRadius: 2,
        }}
      />
    </Grid2>

    {/* Right Side */}
    <Grid2 
      xs={12} 
      md={6} 
      container 
      spacing={2} 
      direction="column" 
      sx={{ 
        justifyContent: 'center',
        flexDirection: {
          xs: 'row',
        },
        flexWrap: {
          xs: 'nowrap',
        },
      }}
    >
      {/* Right Box - Top */}
      <Grid2 xs={12}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: { xs: '55px', md: '400px' },
            height: { xs: '25px', md: '100px' },
            borderRadius: 2,
          }}
        />
      </Grid2>
      {/* Right Box - Bottom */} 
      <Grid2 xs={12}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: { xs: '55px', md: '400px' },
            height: { xs: '25px', md: '100px' },
            borderRadius: 2,
          }}
        />
      </Grid2>
      {/* Right Box - Bottom */} 
      <Grid2 xs={12}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: { xs: '55px', md: '400px' },
            height: { xs: '25px', md: '100px' },
            borderRadius: 2,
          }}
        />
      </Grid2>
    </Grid2>
  </Grid2>
</Box>
);

const HowItWorksSkeleton = (
<Box
  sx={{
    width: '100%',
    display: 'flex',
    flexDirection: 'column', // Stack grids vertically
    justifyContent: 'center',
    alignItems: 'center',
    p: 2,
    my: 10,
  }}
>
  {/* Top Grid */}
  <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 10, sm: 20, md: 40 }} sx={{ maxWidth: '100%' }}>
    <Grid2 xs={6}>
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{
          mb: 4,
          width: { xs: '25px', sm: '50px', md: '60px' },
          height: { xs: '25px', sm: '50px', md: '60px' },
        }}
      />
    </Grid2>
    <Grid2 xs={6}>
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{
          mb: 4,
          width: { xs: '25px', sm: '50px', md: '60px' },
          height: { xs: '25px', sm: '50px', md: '60px' },
        }}
      />
    </Grid2>
    <Grid2 xs={6}>
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{
          mb: 4,
          width: { xs: '25px', sm: '50px', md: '60px' },
          height: { xs: '25px', sm: '50px', md: '60px' },
        }}
      />
    </Grid2>
  </Grid2>

  {/* Bottom Grid */}
  <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 20 }} sx={{ maxWidth: '100%' }}>
    <Grid2 xs={6}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          borderRadius: 2,
          mb: 4,
          width: { xs: '75px', sm: '150px', md: '220px' },
          height: { xs: '35px', sm: '50px', md: '60px' },
        }}
      />
    </Grid2>
    <Grid2 xs={6}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          borderRadius: 2,
          mb: 4,
          width: { xs: '75px', sm: '150px', md: '220px' },
          height: { xs: '35px', sm: '50px', md: '60px' },
        }}
      />
    </Grid2>
    <Grid2 xs={6}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          borderRadius: 2,
          mb: 4,
          width: { xs: '75px', sm: '150px', md: '220px' },
          height: { xs: '35px', sm: '50px', md: '60px' },
        }}
      />
    </Grid2>
  </Grid2>
</Box>
);

const HighlightsSkeleton = (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack grids vertically
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      my: 10,
    }}
  >
    {/* Top Grid */}
    <Grid2 container rowSpacing={3} direction={{ xs: 'column', sm: 'row', lg: 'row' }} columnSpacing={{ xs: 4, sm: 8, md: 5 }} sx={{ mb: { xs: 3 }, maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '250px', sm: '125px', md: '250px' },
            height: { xs: '150px', sm: '75px', md: '150px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '250px', sm: '125px', md: '250px' },
            height: { xs: '150px', sm: '75px', md: '150px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '250px', sm: '125px', md: '250px' },
            height: { xs: '150px', sm: '75px', md: '150px' },
          }}
        />
      </Grid2>
    </Grid2>

    {/* Bottom Grid */}
    <Grid2 container rowSpacing={3} direction={{ xs: 'column', sm: 'row', lg: 'row' }} columnSpacing={{ xs: 4, sm: 8, md: 5 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '250px', sm: '125px', md: '250px' },
            height: { xs: '150px', sm: '75px', md: '150px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '250px', sm: '125px', md: '250px' },
            height: { xs: '150px', sm: '75px', md: '150px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '250px', sm: '125px', md: '250px' },
            height: { xs: '150px', sm: '75px', md: '150px' },
          }}
        />
      </Grid2>
    </Grid2>
  </Box>
);

const DonationsSkeleton = (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack grids vertically
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      my: 10,
    }}
  >
    <Grid2 container rowSpacing={3} direction={{ xs: 'column', sm: 'row', lg: 'row' }} columnSpacing={{ xs: 4, sm: 8, md: 5 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '125px', sm: '125px', md: '250px' },
            height: { xs: '125px', sm: '125px', md: '250px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '125px', sm: '125px', md: '250px' },
            height: { xs: '125px', sm: '125px', md: '250px' },
          }}
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 4,
            width: { xs: '125px', sm: '125px', md: '250px' },
            height: { xs: '125px', sm: '125px', md: '250px' },
          }}
        />
      </Grid2>
    </Grid2>
  </Box>
);

const FeedbackSkeleton = (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack grids vertically
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      my: 10,
    }}
  >
    {/* Grid: Name - Email */}
    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 1, sm: 1, md: 2 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1rem',
            width: { xs: '62px', sm: '125px', md: '250px' },
          }} 
        />
      </Grid2>
      <Grid2 xs={6}>
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1rem',
            mb: 1,
            width: { xs: '62px', sm: '125px', md: '250px' },
          }} 
        />
      </Grid2>
    </Grid2>

    {/* Grid: Feedback Type */}
    <Grid2 container rowSpacing={3} direction="row" sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1rem',
            mb: 2,
            width: { xs: '135px', sm: '260px', md: '520px' },
          }} 
        />
      </Grid2>
    </Grid2>

    {/* Grid: Message */}
    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 2,
            width: { xs: '135px', sm: '260px', md: '520px' },
            height: { xs: '25px', sm: '25px', md: '50px' },
          }}
        />
      </Grid2>
    </Grid2>

    {/* Grid: Attachment URL */}
    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1rem',
            mb: 2,
            width: { xs: '135px', sm: '260px', md: '520px' },
          }} 
        />
      </Grid2>
    </Grid2>

    {/* Grid: Submit Button */}
    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 1,
            width: { xs: '135px', sm: '260px', md: '520px' },
            height: { xs: '12px', sm: '25px', md: '25px' },
          }}
        />
      </Grid2>
    </Grid2>

  </Box>
);

const FAQSkeleton = (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack grids vertically
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      my: 10,
    }}
  >
    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 1,
            width: { xs: '130px', sm: '260px', md: '520px' },
            height: { xs: '12px', sm: '25px', md: '25px' },
          }}
        />
      </Grid2>
    </Grid2>

    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 1,
            width: { xs: '130px', sm: '260px', md: '520px' },
            height: { xs: '12px', sm: '25px', md: '25px' },
          }}
        />
      </Grid2>
    </Grid2>

    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 1,
            width: { xs: '130px', sm: '260px', md: '520px' },
            height: { xs: '12px', sm: '25px', md: '25px' },
          }}
        />
      </Grid2>
    </Grid2>

    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>
      <Grid2 xs={6}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: 2,
            mb: 1,
            width: { xs: '130px', sm: '260px', md: '520px' },
            height: { xs: '12px', sm: '25px', md: '25px' },
          }}
        />
      </Grid2>
    </Grid2>

  </Box>
);

const FooterSkeleton = (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack grids vertically
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      my: 10,
    }}
  >
    <Grid2 container rowSpacing={3} direction="row" columnSpacing={{ xs: 4, sm: 8, md: 0 }} sx={{ maxWidth: '100%' }}>

      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ 
          mb: 2,
          borderRadius: 2,
          width: { xs: '260px', sm: '260px', md: '150vh' },
          height: { xs: '150px', sm: '25px', md: '30vh' },
        }}
      />

    </Grid2>

  </Box>
);

export default function MarketingPage(props) {

  useGradientRotadingEffect();

  return (
    <HelmetProvider>
      <AppTheme {...props}>
      <Helmet>
          {/* Basic Meta Tags */}
          <title>TimeCapsule Chat - Explore Decentralized Communication</title>
          <meta name="description" content="Discover the features of TimeCapsule Chat, a secure and decentralized communication platform. Learn how it leverages blockchain technology to redefine messaging." />
          <meta name="keywords" content="TimeCapsule Chat, decentralized messaging, secure chat, Web3 communication" />
          <meta name="author" content="TimeCapsule Team" />

          {/* Open Graph (OG) Tags */}
          <meta property="og:title" content="TimeCapsule Chat - Explore Decentralized Communication" />
          <meta property="og:description" content="Discover the features of TimeCapsule Chat, a secure and decentralized communication platform. Learn how it leverages blockchain technology to redefine messaging." />
          <meta property="og:url" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/`} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/${process.env.REACT_APP_BASE_METATAG_IMAGE}`} />
          <meta property="og:locale" content="en_US" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="TimeCapsule Chat - Explore Decentralized Communication" />
          <meta name="twitter:description" content="Discover the features of TimeCapsule Chat, a secure and decentralized communication platform. Learn how it leverages blockchain technology to redefine messaging." />
          <meta name="twitter:image" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/${process.env.REACT_APP_BASE_METATAG_IMAGE}`} />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo.png" />
        </Helmet>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Hero />
        <div>
          <LazyLoadComponent Component={LogoCollection} SkeletonComponent={LogoCollectionSkeleton} />
          <LazyLoadComponent Component={Features} SkeletonComponent={FeaturesSkeleton} />
            <Divider />
          <LazyLoadComponent Component={HowItWorks} SkeletonComponent={HowItWorksSkeleton} />
            <Divider />
          <LazyLoadComponent Component={Highlights} SkeletonComponent={HighlightsSkeleton} />
            <Divider />
          <LazyLoadComponent Component={Donations} SkeletonComponent={DonationsSkeleton} />
            <Divider />
          <LazyLoadComponent Component={Feedback} SkeletonComponent={FeedbackSkeleton} />
            <Divider />
          <LazyLoadComponent Component={FAQ} SkeletonComponent={FAQSkeleton} />
            <Divider />
          <LazyLoadComponent Component={Footer} SkeletonComponent={FooterSkeleton} />
        </div>
      </AppTheme>
    </HelmetProvider>
  );
}
