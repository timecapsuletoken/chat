import React, { useState,useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { connectWallet } from './utils/wallet';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage';
import LoginNavbar from './components/LoginNavbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

import CookiePolicy from './pages/LandingPage/legalDocs/CookiePolicy';
import Disclaimer from './pages/LandingPage/legalDocs/Disclaimer';
import PrivacyPolicy from './pages/LandingPage/legalDocs/PrivacyPolicy';
import RiskDisclosure from './pages/LandingPage/legalDocs/RiskDisclosure';
import TermsAndConditions from './pages/LandingPage/legalDocs/TermsAndConditions';
import TermsOfService from './pages/LandingPage/legalDocs/TermsOfService';

import Navbar from './components/Navbar';
import WelcomeSection from './components/WelcomeSection';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedAccount');

    if (savedAccount) {
      setAccount(savedAccount);
    }
    
  }, []);

  const switchToBSC = async () => {
    if (window.ethereum) {
      try {
        // Request to switch to Binance Smart Chain
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], // 0x38 is the hexadecimal Chain ID for BSC
        });
        console.log('Switched to Binance Smart Chain');
      } catch (error) {
        if (error.code === 4902) {
          console.log('Binance Smart Chain not found. Adding it now...');
          try {
            // Add Binance Smart Chain
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'Binance Smart Chain',
                  nativeCurrency: {
                    name: 'Binance Coin',
                    symbol: 'BNB',
                    decimals: 18,
                  },
                  rpcUrls: ['https://bsc-dataseed.binance.org/'],
                  blockExplorerUrls: ['https://bscscan.com'],
                },
              ],
            });
            console.log('Binance Smart Chain added to MetaMask');
            // Retry switching to BSC
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            });
            console.log('Switched to Binance Smart Chain');
          } catch (addError) {
            console.error('Failed to add Binance Smart Chain:', addError);
          }
        } else {
          console.error('Failed to switch to Binance Smart Chain:', error);
        }
      }
    } else {
      console.error('MetaMask is not installed. Please install it to use this app.');
    }
  };  

   // Disconnect the wallet
   const disconnectWallet = () => {
    setAccount(null);
    if (window.localStorage) {
      localStorage.removeItem('connectedAccount'); // Only remove connection-related data
      localStorage.removeItem('providerType');
    }
    navigate('/login'); // Redirect to login page on disconnect
    };

  return (
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <LandingPage />
            </>
          }
          />
          <Route path="/cookie-policy" element={
            <>
              <CookiePolicy />
            </>
          }
          />
          <Route path="/disclaimer" element={
            <>
              <Disclaimer />
            </>
          }
          />
          <Route path="/privacy-policy" element={
            <>
              <PrivacyPolicy />
            </>
          }
          />
          <Route path="/risk-disclosure" element={
            <>
              <RiskDisclosure />
            </>
          }
          />
          <Route path="/terms-and-conditions" element={
            <>
              <TermsAndConditions />
            </>
          }
          />
          <Route path="/tos" element={
            <>
              <TermsOfService />
            </>
          }
          />
          <Route path="/index2" element={
            <>
              <Navbar />
              <WelcomeSection />
              <FeaturesSection />
              <FAQSection />
              <Footer />
            </>
          } />

          <Route path="/login" element={
            <>
              <LoginNavbar />
              <LoginPage account={account} connectWallet={(providerType) => connectWallet(providerType, switchToBSC, setAccount)} />
            </>
          } />
          <Route path="/home" element={
            <>
              <HomePage account={account} disconnectWallet={disconnectWallet} switchAccount={setAccount} switchToBSC={switchToBSC}/>
            </>
          } />
          <Route
           path="/chat/:address"
           element={<ChatPage account={account} />}
          />
        </Routes>
      </div>
  );
}

export default App;
