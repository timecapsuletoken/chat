import React from 'react';
import '../assets/css/FAQSection.css';

const FAQSection = () => {
  return (
    <div className="faq-section-wrapper" style={{ position: 'relative' }}>
      <div className="gradient-overlay" />
        <section className="faq-section">
          <div className='faq-container'>
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-subtitle">Our curated list for most frequently asked questions.</p>
            
            <div className="faq-item">
              <h3>What is TimeCapsule Chat?</h3>
              <p>Made by the Etherscan Team, TimeCapsule Chat introduces Signing in with Web3 and a messaging platform for wallet-to-wallet messages.</p>
            </div>

            <div className="faq-item">
              <h3>Is there a cost to send a message?</h3>
              <p>No cost! Messages are sent and received for free as they are off-chain.</p>
            </div>

            <div className="faq-item">
              <h3>Will I get a reply back?</h3>
              <p>Reply depends on whether the recipient uses TimeCapsule Chat to respond. No guarantee.</p>
            </div>

            <div className="faq-item">
              <h3>Is TimeCapsule Chat end-to-end encrypted?</h3>
              <p>Messages are encrypted once both addresses sign in, except for addresses with an API key and Safe multisig addresses.</p>
            </div>
            
            <button className="faq-button">Check all FAQs →</button>
          </div>
        </section>
    </div>
  );
};

export default FAQSection;
