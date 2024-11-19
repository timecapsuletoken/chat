import React from 'react';
import PropTypes from 'prop-types';
import { Typewriter } from 'react-simple-typewriter';
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';

const WelcomePage = ({ handleOpenModal }) => {
  return (
    <>
      <div className="welcome-card">
        <h2 style={{ textAlign: 'center' }}>
          Welcome to <br />
          <span className="logo-text">
            <Typewriter
              words={['TimeCapsule Chat', 'Wallet-to-Wallet']}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>{' '}
          <span className="beta-tag">Beta</span>
        </h2>
        <p>
          Built for users that Value their Privacy, TimeCapsule Chat is a messaging platform for
          users to simply and instantly message each other, wallet-to-wallet.
        </p>
      </div>
      <div className="important-card">
        <h3>❗ Be Careful</h3>
        <p>
          Protect your sensitive details, such as passwords, private keys, or seed phrases, by
          never sharing them with anyone! Exercise caution when interacting with external links or
          online forms, and stay vigilant for potential threats lurking in the digital realm. Stay
          safe out there! 👀
        </p>
      </div>
      <Button 
        variant="outlined"
        endIcon={<ChatIcon />} 
        onClick={handleOpenModal} 
        sx={{
          color: '#ce00fc', // Button text color
          borderColor: '#ce00fc', // Button border color
          '&:hover': {
            borderColor: '#20d0e3', // Background color on hover
            color: '#20d0e3', // Text color on hover
          },
        }}
      >
        New Message
      </Button>
    </>
  );
};

WelcomePage.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
};

export default WelcomePage;
