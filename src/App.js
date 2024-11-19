import React, { useState,useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Navbar from './components/Navbar';
import WelcomeSection from './components/WelcomeSection';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import LoginNavbar from './components/LoginNavbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
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
    try {
      // Request to switch to Binance Smart Chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], // 0x38 is the hexadecimal Chain ID for Binance Smart Chain
      });
      console.log('Switched to Binance Smart Chain');
    } catch (error) {
      if (error.code === 4902) {
        // This error code indicates the chain has not been added to MetaMask
        console.log('Binance Smart Chain not found. Adding it now...');
        try {
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
        } catch (addError) {
          console.error('Failed to add Binance Smart Chain:', addError);
        }
      } else {
        console.error('Failed to switch to Binance Smart Chain:', error);
      }
    }
  };  
  
  const connectWallet = async ( providerType) => {
    console.log("Provider Type:", providerType); // Diagnostic log
  
    try {
      let provider;
  
      if (providerType === 'MetaMask') {
        if (window.ethereum && window.ethereum.isMetaMask) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          try {
            
            // Disconnect existing accounts to force account selection
            await window.ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            });

            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("MetaMask connected:", accounts[0]);

            // Check and switch to BSC
            const chainId = await provider.send("eth_chainId", []);
            console.log("Current chain ID:", chainId);
            if (chainId !== "0x38") {
              await switchToBSC(); 
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }],
              });
              console.log("Switched to Binance Smart Chain");
            }
          } catch (error) {
            if (error.code === 4001) {
              // User rejected the request
              console.log("User rejected the MetaMask connection request");
              return;
            } else {
              console.error("MetaMask connection error:", error);
              return;
            }
          }
        } else {
          alert("Please install MetaMask to connect your wallet.");
        }
      } else if (providerType === 'CoinbaseWallet') {
        const coinbaseWallet = new CoinbaseWalletSDK({
          appName: "YourAppName",
          darkMode: false,
        });
  
        const coinbaseProvider = coinbaseWallet.makeWeb3Provider(
          'https://bsc-dataseed.binance.org/', // BNB Smart Chain
          56
        );
  
        await coinbaseProvider.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(coinbaseProvider);
      } else {
        alert("Wallet provider not supported or not installed.");
        return;
      }
  
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      console.error(`Error connecting to ${providerType}:`, error);
    }
  };

   // Disconnect the wallet
   const disconnectWallet = () => {
    setAccount(null);
    if (window.localStorage) {
      localStorage.removeItem('connectedAccount'); // Only remove connection-related data
    }
    navigate('/login'); // Redirect to login page on disconnect
    };


  return (
      <div className="App">
        <Routes>
          <Route path="/" element={
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
              <LoginPage account={account} connectWallet={connectWallet} />
            </>
          } />
          <Route path="/home" element={
            <>
              <HomePage account={account} disconnectWallet={disconnectWallet} />
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
