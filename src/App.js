import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { connectWallet } from './utils/wallet';

import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const Blog = lazy(() => import('./pages/LandingPage/Blog'));
const SingleArticle = lazy(() => import('./components/LandingPage/Blog/SingleArticle'));

const CookiePolicy = lazy(() => import('./pages/LandingPage/legalDocs/CookiePolicy'));
const Disclaimer = lazy(() => import('./pages/LandingPage/legalDocs/Disclaimer'));
const PrivacyPolicy = lazy(() => import('./pages/LandingPage/legalDocs/PrivacyPolicy'));
const RiskDisclosure = lazy(() => import('./pages/LandingPage/legalDocs/RiskDisclosure'));
const TermsAndConditions = lazy(() => import('./pages/LandingPage/legalDocs/TermsAndConditions'));
const TermsOfService = lazy(() => import('./pages/LandingPage/legalDocs/TermsOfService'));

const ProtectedRoute = ({ account, children }) => {
  return account ? children : <Navigate to="/login" />;
};

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
        if (process.env.NODE_ENV !== 'production') {
          console.log('Switched to Binance Smart Chain');
        }
      } catch (error) {
        if (error.code === 4902) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Binance Smart Chain not found. Adding it now...');
          }
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
            if (process.env.NODE_ENV !== 'production') {
              console.log('Binance Smart Chain added to MetaMask');
            }
              // Retry switching to BSC
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            });
            if (process.env.NODE_ENV !== 'production') {
              console.log('Switched to Binance Smart Chain');
            }
          } catch (addError) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('Failed to add Binance Smart Chain:', addError);
            }
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to switch to Binance Smart Chain:', error);
          }
        }
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.error('MetaMask is not installed. Please install it to use this app.');
      }
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
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<><LandingPage /></>} />
            <Route path="/cookie-policy" element={<><CookiePolicy /></>} />
            <Route path="/disclaimer" element={<><Disclaimer /></>} />
            <Route path="/privacy-policy" element={<><PrivacyPolicy /></>} />
            <Route path="/risk-disclosure" element={<><RiskDisclosure /></>} />
            <Route path="/terms-and-conditions" element={<><TermsAndConditions /></>} />
            <Route path="/tos" element={<><TermsOfService /></>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<SingleArticle />} />
            <Route 
              path="/login"
              element={account ? <Navigate to="/home" /> : <LoginPage account={account} connectWallet={(providerType) => connectWallet(providerType, switchToBSC, setAccount)}/>}
            />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute account={account}>
                  <HomePage account={account} disconnectWallet={disconnectWallet} switchAccount={setAccount} switchToBSC={switchToBSC}/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/chat/:address" 
              element={
                <ProtectedRoute account={account}>
                  <ChatPage account={account} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
  );
}

export default App;
