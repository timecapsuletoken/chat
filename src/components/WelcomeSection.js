import React from 'react';
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
      <h1 className="main-heading"><span className='grdnt0'>Wallet-to-Wallet</span> <br /> <span className="grdnt1">Messaging Made Easy</span></h1>
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
