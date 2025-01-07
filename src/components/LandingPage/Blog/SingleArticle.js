import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Avatar, AvatarGroup, CardMedia, Divider, Container, Breadcrumbs, Link, Stack, IconButton } from '@mui/material';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import useArticles from '../../../hooks/useArticles';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../LandingPage/AppTheme';
import AppAppBar from '../../LandingPage/AppAppBar';
import Footer from '../../LandingPage/Footer';

import RedditIcon from '@mui/icons-material/Reddit';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';

function Author({ authors }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
      <AvatarGroup max={3}>
        {authors.map((author, index) => (
            <Avatar 
                key={index} 
                alt={author.name} 
                src={author.avatar} 
                sx={(theme) => ({
                    backgroundColor: '#333', 
                    ...theme.applyStyles('dark', {
                    backgroundColor: '#fff',
                    }),
                })}
            />
        ))}
      </AvatarGroup>
      <Typography variant="body2" color="text.secondary">
        {authors.map((author) => author.name).join(', ')}
      </Typography>
    </Box>
  );
}

export default function SingleArticle() {
  const { slug } = useParams(); // Fetch the slug from the URL
  const { articles, loading } = useArticles();
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .trim();                     // Remove trailing spaces
  };

  if (loading) return <p>Loading...</p>;

  const article = articles.find(
    (article) => generateSlug(article.title) === slug
  );
  
  if (!article) return <p>Article not found</p>;

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
       <HelmetProvider>
        <Helmet>
            <title>TimeCapsule Chat - {article.title}</title>
            <meta name="description" content={article.description} />
            <meta property="og:title" content={article.title} />
            <meta property="og:description" content={article.description} />
            <meta property="og:image" content={article.img} />
            <meta property="og:url" content={`https://${process.env.REACT_APP_BASE_DOMAIN}/blog/${slug}`} />
            <link rel="canonical" href={`https://${process.env.REACT_APP_BASE_DOMAIN}/blog/${slug}`} />
        </Helmet>
       </HelmetProvider>
      <AppAppBar />
      <Container maxWidth="md" sx={{ mt: 16, mb: 8 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
            <Link
                underline="hover"
                color="inherit"
                component={RouterLink}
                to="/"
            >
                Home
            </Link>
            <Link
                underline="hover"
                color="inherit"
                component={RouterLink}
                to="/blog"
            >
                Blog
            </Link>
            <Typography color="text.primary">{article.title}</Typography>
        </Breadcrumbs>
        <Typography variant="h3" gutterBottom>
          {article.title}
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 4 }}
        >
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }} gutterBottom>
                {article.tag}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Published on: {new Date(article.date).toLocaleDateString()}
            </Typography>
        </Stack>
        <CardMedia
          component="img"
          alt={article.title}
          image={article.img}
          sx={{
            width: '100%',
            height: '450px',
            borderRadius: 2,
            boxShadow: 1,
            mb: 4,
          }}
        />
        <Typography variant="body1" paragraph sx={{ color: 'text.primary' }} dangerouslySetInnerHTML={{ __html: article.description }} />
        <Divider sx={{ my: 4 }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 4 }}
        >
          {/* Authors */}
          <Author authors={article.authors} />
          {/* Social Media Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              aria-label="share on Facebook"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://myblog.com/blog/${slug}`, '_blank')}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              aria-label="share on Twitter"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=https://myblog.com/blog/${slug}&text=${article.title}`, '_blank')}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              aria-label="share on LinkedIn"
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=https://myblog.com/blog/${slug}&title=${article.title}&summary=${article.description}`, '_blank')}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton aria-label="share">
              <RedditIcon />
            </IconButton>
          </Box>
        </Stack>
      </Container>
      <Box sx={{ borderTop: 'solid 1px #333', }}>
          <Footer />
      </Box>
    </AppTheme>
  );
}
