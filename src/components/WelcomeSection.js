import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import '../assets/css/WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <section className="welcome-section">
        <div className="welcome-background-container">
          <div className="orb green"></div>
          <div className="orb red"></div>
          <div className="orb purple"></div>
          <div className="orb light_blue"></div>
          <div className="blurred-layer"></div>
      </div>
      <h1 className="main-heading">
        <span className='grdnt0'>
        <Typewriter
          words={['Wallet-to-Wallet', 'Messaging Made Easy']}
          loop={true}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={2000}
        />
        </span> 
        <br /> 
        <span className="grdnt1">
          <Typewriter
            words={['Messaging Made Easy', 'Wallet-to-Wallet']}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </span>
      </h1>
      <p className="description">
        TimeCapsule Chat is a simple platform for verified messaging from wallet owner-to-owner for outreach and social purposes.
      </p>
      <div className="store-buttons">
        <a className="app-store-button" href='https://www.timecapsuletoken.com'>Buy $TCA</a>
        <a className="play-store-button" href="https://">Start Chatting</a>
      </div>
      <br />
      <div className="scroll-indicator">
        <span>Scroll to learn more</span>
        <div className="arrow-down">↓</div>
      </div>
    </section>
  );
};

export default WelcomeSection;
