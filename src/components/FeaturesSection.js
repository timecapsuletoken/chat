import React from 'react';
import '../assets/css/FeaturesSection.css';
import { AnimatedBackground } from 'animated-backgrounds';

const features = [
  {
    icon: '✈️', // You can replace with icon components or images
    title: 'Instant Chat',
    description: 'Wallet-to-wallet instant chat with any Ethereum-compatible address.',
  },
  {
    icon: '🔒',
    title: 'End-to-end Encryption',
    description: 'Chat messages between signed-in addresses are encrypted by default.',
  },
  {
    icon: '📱',
    title: 'Multi-Device Login',
    description: 'Access your chat messages across multiple devices.',
  },
  {
    icon: '✏️',
    title: 'Block Addresses',
    description: 'Getting spammed by an address? Block the owner from messaging you.',
  },
  {
    icon: '🔔',
    title: 'Notifications',
    description: 'Get notified on the block explorer when your address receives a message.',
  },
  {
    icon: '🤖',
    title: 'NFT Negotiation Bot',
    description: 'Negotiate with an AI bot and get rewarded with testnet ETH.',
  },
  {
    icon: '🍲',
    title: 'Recipes',
    label: 'Alpha',
    description: 'Create your own chat recipes to automate actions using our SDK.',
  },
  {
    icon: '📲',
    title: 'Mobile Application',
    label: 'New',
    description: 'More immersive use of the application from your phone. Install Mobile App.',
  },
];

const FeaturesSection = () => {
  return (
    <div className="features-section-wrapper" style={{ position: 'relative' }}>
      <AnimatedBackground 
        animationName="geometricShapes" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} 
      />
      <div className="gradient-overlay" />
      <section className="features-section">
        <h2>Features</h2>
        <p className="features-subtitle">Our curated list for most frequently asked questions.</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title} {feature.label && <span className="feature-label">{feature.label}</span>}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
