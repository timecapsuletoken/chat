import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


import './App.css';

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async ( providerType) => {
    console.log("Provider Type:", providerType); // Diagnostic log
  
    try {
      let provider;
  
      if (providerType === 'MetaMask') {
        if (window.ethereum && window.ethereum.isMetaMask) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          try {
            await provider.send("eth_requestAccounts", []);
            console.log("MetaMask connected");
      
            // Check and switch to BSC
            const chainId = await provider.send("eth_chainId", []);
            console.log("Current chain ID:", chainId);
            if (chainId !== "0x38") {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }],
              });
              console.log("Switched to Binance Smart Chain");
            }
          } catch (error) {
            console.error("MetaMask connection error:", error);
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
  };


  return (
    <Router>
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
              <LoginPage connectWallet={connectWallet} />
            </>
          } />
          <Route path="/home" element={
            <>
              <HomePage account={account} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;