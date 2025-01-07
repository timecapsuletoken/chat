import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typewriter } from 'react-simple-typewriter';
import { Player } from '@lottiefiles/react-lottie-player';
import messagesicons from '../../assets/animations/messagesicons.json';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { LuMessageSquarePlus } from 'react-icons/lu';
import SidebarToggle from '../HomePage/Sidebar/SidebarToggle';

const WelcomePage = ({ handleOpenModal, isSidebarOpen, toggleSidebar }) => {

  useEffect(() => {
    const buttons = document.querySelectorAll('.rotating-gradient-wrapper');

    buttons.forEach((button, index) => {
      let angle = 0;

      const updateAnimation = () => {
        angle = (angle + 1) % 360;
        button.style.setProperty('--angle', `${angle + index * 120}deg`);
        requestAnimationFrame(updateAnimation);
      };

      button.style.setProperty('--angle', '0deg');
      requestAnimationFrame(updateAnimation);
    });
  }, []);

  return (
    <>
      <div className="welcome-card-wrapper">

        <div className="background-decorations">
          <div className="decorative-circle one">TCA</div>
          <div className="decorative-circle two">dApp</div>
          <div className="decorative-triangle one"></div>
          <div className="decorative-triangle two"></div>
        </div>

        <div className="welcome-card-icons">
          <Player 
            src={messagesicons} 
            loop
            autoplay
            className="welcome-card-icon"
          />
        </div>

        <SidebarToggle 
          toggleSidebarText="Dashboard"
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />

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
        
        <Box
          className="rotating-gradient-wrapper"
          sx={{
            display: 'inline-block',
            padding: '1px', // Space for the gradient border
            borderRadius: '8px',
            background: `linear-gradient(var(--angle, 0deg), #07e6f5, hsl(282, 89%, 60%))`,
          }}
        >
          <Button
            size="small"
            fullWidth
            endIcon={<LuMessageSquarePlus />} 
            onClick={handleOpenModal}   
            sx={{
              minWidth: 'fit-content',
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                background: '#4d4d4d',
              },
            }}
          >
            Send a Message
          </Button>
        </Box>
      </div>
    </>
  );
};

WelcomePage.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
};

export default WelcomePage;
