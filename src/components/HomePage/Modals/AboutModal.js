import React from 'react';
import '../../../assets/css/HomePage/AboutModal.css';
import { FaWallet, FaShieldAlt, FaReact, FaHandshake } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import { GiPistolGun } from "react-icons/gi";
import TCACoinLogo from '../../../assets/images/logos/logo.png';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="about-modal-overlay" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h2>About This dApp</h2>
        <p>
            Welcome to <strong className="TCA-title-withImg">TimeCapsule <img alt="TCACoin" src={TCACoinLogo} width="20px"/> Chat</strong>, a cutting-edge decentralized application (dApp) designed to revolutionize how you connect and interact in the blockchain ecosystem. Built on the principles of decentralization and user empowerment, this dApp offers secure, seamless, and transparent communication for Web3 users.
        </p>
        <p>With <strong className="TCA-title-withImg">TimeCapsule <img alt="TCACoin" src={TCACoinLogo} width="20px"/> Chat</strong>, you can:</p>
        <ul>
            <li>
            Connect effortlessly to your <FaWallet style={{ color: '#ff9900'}} /> wallet using MetaMask, Coinbase Wallet, or other supported providers.
            </li>
            <li>
            Communicate and share messages <FaShieldAlt style={{ color: '#007bff'}} /> securely with blockchain-backed data integrity.
            </li>
            <li>
            Enjoy a user-friendly interface powered by <FaReact style={{ color: '#61dbfb'}} /> React, ensuring a smooth and intuitive experience.
            </li>
            <li>
            Leverage decentralized storage and networking with <GiPistolGun style={{ color: '#0aa06e'}} /> Gun.js for real-time, peer-to-peer connections.
            </li>
            <li>
            Operate on the <SiBinance style={{ color: '#f3ba2f'}} /> Binance Smart Chain (BSC) for fast and cost-efficient transactions.
            </li>
        </ul>
        <p>
            Our goal is to empower blockchain users with tools that prioritize privacy, security, and scalability, <FaHandshake style={{ color: '#ff5722'}} /> while fostering a truly decentralized community.
        </p>
        </div>
    </div>
  );
};

export default AboutModal;
