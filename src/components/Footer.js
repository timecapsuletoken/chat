import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';
import '../assets/css/Footer.css';

const Footer = () => {
  return (
    <div className="footer-section-wrapper" style={{ position: 'relative' }}>
      <AnimatedBackground 
        animationName="auroraBorealis" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} 
      />
      <div className="gradient-overlay" />
        <footer className="footer-container">
          <div className="footer-content">
            <div className="footer-heading">
              <h2>TimeCapsule <span className="grdnt2">Chat</span></h2>
              <p>A Sophisticated Decentralised Way For Us To Communicate With Pure-Anonymity.</p>
              <div className="store-buttons">
                <button className="app-store">Buy $TCA</button>
                <button className="google-play">Whitepaper</button>
              </div>
            </div>
            <div className="footer-bottom">
              <p>TimeCapsule © 2024 | Made with ❤️ by <a className="grdnt2" href="https://TimeCapsuleToken.com">TimeCapsule</a></p>
              <nav>
                <a href="https://www.timecapsuletoken.com/contact">Contact</a> | 
                <a href="/faq">FAQ</a> | 
                <a href="/terms">Terms of Service</a> | 
                <a href="https://www.TimeCapsuleToken.com">TimeCapsuleToken.com</a>
              </nav>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default Footer;
