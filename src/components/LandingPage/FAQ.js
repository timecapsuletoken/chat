import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel),
    );
  };

  return (
    <Container
      id="faq"
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
          variant="gradientText"
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          Frequently asked questions
        </Typography>
        <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })}>
          Explore the most commonly asked questions about TimeCapsule Chat, from features and functionality to technical details. Whether you're new to our platform or a seasoned user, this section is designed to help you better understand how TimeCapsule Chat works.
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded.includes('panel1')}
          onChange={handleChange('panel1')}
          className="rotating-color"
          sx={(theme) => ({
            borderRadius: 0,
            border: '1px solid transparent',
            background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
            boxShadow: theme.shadows[1],
          })}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              How is my data secured in this dApp?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' }, color: 'text.primary' }}
            >
              Your data is encrypted and stored using decentralized technology, ensuring that only you and your intended recipients can access it. We use Gun.js to maintain peer-to-peer connections, eliminating centralized storage vulnerabilities.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel2')}
          onChange={handleChange('panel2')}
          className="rotating-color"
          sx={(theme) => ({
            borderRadius: 0,
            border: '1px solid transparent',
            background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
            boxShadow: theme.shadows[1],
          })}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Can I use the dApp on multiple devices?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' }, color: 'text.primary' }}
            >
              Yes! Our dApp supports seamless multi-device synchronization, allowing you to continue your activities across multiple devices securely and in real-time.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel3')}
          onChange={handleChange('panel3')}
          className="rotating-color"
          sx={(theme) => ({
            borderRadius: 0,
            border: '1px solid transparent',
            background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
            boxShadow: theme.shadows[1],
          })}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Do I need a crypto wallet to use the dApp?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' }, color: 'text.primary' }}
            >
                Yes, your crypto wallet serves as your secure identity. It’s used for authentication and
                personalization, ensuring a streamlined and secure experience without requiring additional
                sign-ups.

                If you don’t have a wallet yet, you can easily create one with{' '}
                <Link href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                  MetaMask
                </Link>{' '}
                or the{' '}
                <Link href="https://trustwallet.com/" target="_blank" rel="noopener noreferrer">
                  Trust Wallet
                </Link>
                {' '}App. These wallets are free, secure, and widely trusted in the Web3 ecosystem.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel4')}
          onChange={handleChange('panel4')}
          className="rotating-color"
          sx={(theme) => ({
            borderRadius: 0,
            border: '1px solid transparent',
            background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
            boxShadow: theme.shadows[1],
          })}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              What happens if I lose my device?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' }, color: 'text.primary' }}
            >
              Since the dApp is decentralized, your data and identity remain intact. Simply reconnect using your wallet on a new device, and you’ll regain access to your chats and settings.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel5')}
          onChange={handleChange('panel5')}
          className="rotating-color"
          sx={(theme) => ({
            borderRadius: 0,
            border: '1px solid transparent',
            background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
            boxShadow: theme.shadows[1],
          })}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5d-content"
            id="panel5d-header"
          >
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
             Is the dApp truly private?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' }, color: 'text.primary' }}
            >
              Absolutely. The dApp is designed with privacy in mind. Messages and data are encrypted end-to-end, ensuring that no one—not even us—can access your private information.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
