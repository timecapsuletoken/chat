import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
//import Link from '@mui/material/Link';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const donationTiers = [
  {
    title: 'Supporter',
    price: '5',
    description: [
      'Show your love for decentralized tech',
      'Access to exclusive updates',
      'Support server maintenance',
    ],
    buttonText: 'Donate $5',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    title: 'Contributor',
    price: '20',
    description: [
      'All benefits of Supporter',
      'Your name in our supporters list',
      'Contribute to scaling the app',
    ],
    buttonText: 'Donate $20',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
  {
    title: 'Champion',
    price: '50',
    description: [
      'All benefits of Contributor',
      'Priority support and feature requests',
      'Be a part of decentralization history',
    ],
    buttonText: 'Donate $50',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
];

export default function Donations() {
  return (
    <Container
      id="donations"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Donations
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Your support helps keep our decentralized app free, secure, and growing. Every contribution
          helps cover server costs, improve features, and support the community.
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
      >
        {donationTiers.map((tier) => (
          <Grid
            item
            xs={12}
            sm={tier.title === 'Champion' ? 12 : 6}
            md={4}
            key={tier.title}
          >
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                boxShadow: tier.title === 'Contributor' ? '0 8px 12px rgba(0,0,0,0.2)' : '',
                border: tier.title === 'Contributor' ? '2px solid #ff4081' : '1px solid #ddd',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === 'Contributor' && (
                    <FavoriteIcon color="secondary" />
                  )}
                  {tier.title === 'Champion' && (
                    <MonetizationOnIcon color="primary" />
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                  }}
                >
                  <Typography component="h3" variant="h2">
                    ${tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; one-time
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}
                  >
                    <Typography
                      variant="subtitle2"
                      component={'span'}
                      sx={{ color: 'text.secondary' }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color={tier.buttonColor}
                  onClick={() => alert(`Thank you for donating ${tier.price}!`)}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}