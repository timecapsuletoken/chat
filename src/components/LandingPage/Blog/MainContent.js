import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useArticles from '../../../hooks/useArticles';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={(theme) => ({
                width: 24, 
                height: 24,
                backgroundColor: '#333', 
                ...theme.applyStyles('dark', {
                  backgroundColor: '#fff',
                }),
              })}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
  const { articles, loading } = useArticles();
  const [page, setPage] = React.useState(1);

  const articlesPerPage = 4; // Max articles per page
  const pageCount = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (page - 1) * articlesPerPage;
  const displayedArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  if (loading) return <p>Loading...</p>;

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ textAlign: 'center', }}>
        <Typography variant="h1" gutterBottom>
          Blog
        </Typography>
        <Typography>Stay in the loop with the latest about our products</Typography>
      </Box>
      <Grid container spacing={2} columns={12}>
        {displayedArticles.map((article, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <Link to={`/blog/${startIndex + index}`} style={{ textDecoration: 'none' }}>
              <SyledCard
                variant="outlined"
                onFocus={() => handleFocus(startIndex + index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === startIndex + index ? 'Mui-focused' : ''}
              >
                <CardMedia
                  component="img"
                  alt={article.title}
                  image={article.img}
                  sx={{
                    aspectRatio: '16 / 9',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <SyledCardContent>
                  <Typography gutterBottom variant="caption" component="div">
                    <Chip 
                      label={article.tag} 
                      color='text.secondary'
                  />
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {article.title}
                  </Typography>
                  <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {article.description}
                  </StyledTypography>
                </SyledCardContent>
                <Author authors={article.authors} />
              </SyledCard>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}