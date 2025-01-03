import { ethers } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
// @ts-ignore
import MetaMaskSDK from '@metamask/sdk';

export const connectWallet = async (providerType, switchToBSC, setAccount) => {
  try {

    const handleAppFocus = async (ethereum, setAccount) => {
      if (document.visibilityState === 'visible') {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const checksumAddress = ethers.utils.getAddress(accounts[0]);
          setAccount(checksumAddress);
          localStorage.setItem('connectedAccount', checksumAddress);
        }
      }
    };
    
    if (providerType === 'MetaMask') {

      const visibilityHandler = () => handleAppFocus(ethereum, setAccount);
      document.addEventListener('visibilitychange', visibilityHandler);
    
      // Ensure cleanup after a successful connection
      const cleanupListener = () => {
        document.removeEventListener('visibilitychange', visibilityHandler);
      };
    
      // Initialize MetaMask SDK
      const MMSDK = new MetaMaskSDK({
        appName: 'YourAppName',
        theme: 'dark',
        network: 'bsc-mainnet',
        storageType: 'session', // Optional: Use session storage for state persistence
      });

      // Await SDK initialization
      await MMSDK.init();

      const ethereum = MMSDK.getProvider();

      if (!ethereum) {
        alert('MetaMask is not installed. Please install it to use this feature.');
        return;
      }

      // Request account access
      const permissions = await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accountsPermission = permissions.find(
        (permission) => permission.parentCapability === 'eth_accounts'
      );

      if (accountsPermission) {
        const checkConnection = async (ethereum, setAccount, retryCount = 3) => {
          for (let i = 0; i < retryCount; i++) {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              const checksumAddress = ethers.utils.getAddress(accounts[0]);
              setAccount(checksumAddress);
              localStorage.setItem('connectedAccount', checksumAddress);
              return true;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          }
          return false;
        };

        const connectionSuccess = await checkConnection(ethereum, setAccount);
        if (!connectionSuccess) {
          throw new Error('Failed to finalize connection. Please try again.');
        }
      
        if (connectionSuccess && connectionSuccess.length > 0) {
          console.log('MetaMask connected:', connectionSuccess[0]);
          const checksumAddress = ethers.utils.getAddress(connectionSuccess[0]); // Convert to checksum format
          setAccount(checksumAddress);
          localStorage.setItem('providerType', providerType);
          cleanupListener(); // Remove the listener after connection is complete

          // Check the current chain and switch to Binance Smart Chain if necessary
          const provider = new ethers.providers.Web3Provider(ethereum);
          const chainId = await provider.send('eth_chainId', []);
          if (chainId !== '0x38') {
            console.log('Not on Binance Smart Chain. Attempting to switch...');
            // Force Binance Smart Chain connection
            await switchToBSC();

            // Verify the chain switch
            const provider = new ethers.providers.Web3Provider(ethereum);
            const chainId = await provider.send('eth_chainId', []);
            if (chainId !== '0x38') {
              cleanupListener(); // Ensure listener is removed even if an error occurs
              throw new Error('Failed to switch to Binance Smart Chain.');
            }
          }
        } else {
          console.error('No accounts found. Please log in to MetaMask.');
          cleanupListener(); // Ensure listener is removed even if an error occurs
        }
      } else {
        console.error('eth_accounts permission not granted.');
        cleanupListener(); // Ensure listener is removed even if an error occurs
      }
    } else if (providerType === 'CoinbaseWallet') {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: 'YourAppName',
        darkMode: false,
      });

      const coinbaseProvider = coinbaseWallet.makeWeb3Provider(
        'https://bsc-dataseed.binance.org/', // Binance Smart Chain
        56
      );

      // Request account access
      await coinbaseProvider.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(coinbaseProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      localStorage.setItem('providerType', providerType);
    } else {
      alert('Unsupported wallet provider.');
    }
  } catch (error) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log('Permissions needed to continue.');
    } else {
      console.error(`Error connecting to ${providerType}:`, error);
    }
  }
};

export const switchWallet = async (providerType, switchToBSC, setAccount) => {
  const SavedProvider = localStorage.getItem('providerType');
  try {
        // Clear old session data
        localStorage.removeItem('connectedAccount');
        //localStorage.removeItem('providerType');
    
    if (SavedProvider === 'MetaMask') {
      const MMSDK = new MetaMaskSDK({
        appName: 'YourAppName',
        theme: 'dark',
        network: 'bsc-mainnet',
      });

      await MMSDK.init();
      const ethereum = MMSDK.getProvider();

      if (!ethereum) {
        alert('MetaMask is not installed. Please install it to use this feature.');
        return;
      }

      // Disconnect and reconnect to prompt wallet selection
      await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts && accounts.length > 0) {
        console.log('Wallet switched to MetaMask account:', accounts[0]);
        const checksumAddress = ethers.utils.getAddress(accounts[0]); // Convert to checksum format
        setAccount(checksumAddress);
        localStorage.setItem('connectedAccount', checksumAddress); // Save account before reload
        localStorage.setItem('providerType', 'MetaMask');

        // Switch to Binance Smart Chain
        await switchToBSC();
  
        // Reload the page
        window.location.reload();

      } else {
        console.error('No accounts found. Please log in to MetaMask.');
      }
    } else if (SavedProvider === 'CoinbaseWallet') {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: 'YourAppName',
        darkMode: false,
      });

      const coinbaseProvider = coinbaseWallet.makeWeb3Provider(
        'https://bsc-dataseed.binance.org/', // Binance Smart Chain
        56
      );

      await coinbaseProvider.request({ method: 'wallet_requestPermissions' });
      const provider = new ethers.providers.Web3Provider(coinbaseProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      localStorage.setItem('connectedAccount', address); // Save account before reload
      localStorage.setItem('providerType', 'CoinbaseWallet');

      // Switch to Binance Smart Chain
      await switchToBSC();

      // Reload the page
      window.location.reload();
      console.log('Wallet switched to Coinbase account:', address);
    } else {
      alert('Unsupported wallet provider.');
    }
  } catch (error) {
    console.error(`Error switching wallet for ${providerType}:`, error);
  }
};