import React from 'react';
import '../assets/css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-heading">
          <h2>Wallet-to-Wallet <span>Messaging Made Easy</span></h2>
          <p>The essential secure messaging app designed to meet your Web3 needs.</p>
          <div className="store-buttons">
            <button className="app-store">Download on the App Store</button>
            <button className="google-play">Get it on Google Play</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>TimeCapsule © 2024 | Made with ❤️ by <a href="https://TimeCapsuleToken.com">TimeCapsule</a></p>
          <nav>
            <a href="/apis">APIs</a> | 
            <a href="/faq">FAQ</a> | 
            <a href="/terms">Terms of Service</a> | 
            <a href="https://www.TimeCapsuleToken.com">TimeCapsuleToken.com</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
