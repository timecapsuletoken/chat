import { ethers } from 'ethers';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
// @ts-ignore
import MetaMaskSDK from '@metamask/sdk';

export const connectWallet = async (providerType, switchToBSC, setAccount) => {
  try {
    
    if (providerType === 'MetaMask') {
    
      // Initialize MetaMask SDK
      const MMSDK = new MetaMaskSDK({
        appName: 'TCA Chat',
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

      let isConnecting = false; // Prevent redundant calls
      let isListenerAdded = false; // Track if the accountsChanged listener is already added

      try {
        if (isConnecting) {
          console.log("Already connecting. Skipping redundant request.");
          return;
        }

        isConnecting = true;

        // Add the listener before requesting permissions to capture account changes during the process
        if (!isListenerAdded) {
          const handleAccountsChanged = async (accounts) => {
            if (accounts && accounts.length > 0) {
              const newChecksumAddress = ethers.utils.getAddress(accounts[0]);
              setAccount(newChecksumAddress);
              localStorage.setItem('connectedAccount', newChecksumAddress);
              console.log('Account switched:', newChecksumAddress);
            } else {
              console.log('No accounts connected.');
            }
          };

          ethereum.on('accountsChanged', handleAccountsChanged);
          isListenerAdded = true;
        }

        // Request account permissions
        const permissions = await ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });

        // Verify if 'eth_accounts' permission is granted
        const accountsPermission = permissions.find(
          (permission) => permission.parentCapability === 'eth_accounts'
        );

        if (!accountsPermission) {
          throw new Error('eth_accounts permission not granted.');
        }

        // Fetch accounts after permission is granted
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found. Please log in to MetaMask.');
        }

        const checksumAddress = ethers.utils.getAddress(accounts[0]);
        setAccount(checksumAddress);
        localStorage.setItem('connectedAccount', checksumAddress);
        localStorage.setItem('providerType', providerType);

        console.log('MetaMask connected:', checksumAddress);

        // Check and switch to Binance Smart Chain if needed
        const provider = new ethers.providers.Web3Provider(ethereum);
        const chainId = await provider.send('eth_chainId', []);
        if (chainId !== '0x38') {
          console.log('Switching to Binance Smart Chain...');
          await switchToBSC();

          const newChainId = await provider.send('eth_chainId', []);
          if (newChainId !== '0x38') {
            throw new Error('Failed to switch to Binance Smart Chain.');
          }
        }
      } catch (error) {
        if (error.code === 4001) {
          console.log('User rejected the connection request.');
        } else {
          console.error('Error connecting to MetaMask:', error);
        }
      } finally {
        // Always reset the flag, even if an error occurs
        isConnecting = false;
      }

    } else if (providerType === 'CoinbaseWallet') {

       // Initialize the Coinbase Wallet SDK
       const sdk = createCoinbaseWalletSDK({
        appName: 'TCA Chat dApp',
        appLogoUrl: `https://${process.env.REACT_APP_BASE_DOMAIN}/assets/images/logo.png`, // Replace with your actual logo URL
        appChainIds: [56], // Binance Smart Chain ID
        preference: {
          options: 'eoaOnly', // EOA connections only
          attribution: { auto: true },
        },
      });

      // Get the provider
      const provider = sdk.getProvider();
      if (!provider) {
        throw new Error('Failed to initialize Coinbase Wallet provider.');
      }

      // Request account access
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        if (process.env.NODE_ENV !== 'production') {
          console.log('Connected account:', address);
        }

        // Convert to checksum address
        const checksumAddress = ethers.utils.getAddress(address);

        // Save account information
        setAccount(checksumAddress);
        localStorage.setItem('providerType', 'CoinbaseWallet');
        if (process.env.NODE_ENV !== 'production') {
          console.log('Provider:', providerType);
        }
      } else {
        alert('Unsupported wallet provider.');
      }
    }

  } catch (error) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      if (process.env.NODE_ENV !== 'production') {
        console.log('Permissions needed to continue.');
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Error connecting to ${providerType}:`, error);
      }
    }
  }
};

export const switchWallet = async (providerType, switchToBSC, setAccount) => {
  //const SavedProvider = localStorage.getItem('providerType');
  const SavedProvider = providerType;

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
        if (process.env.NODE_ENV !== 'production') {
          console.log('Wallet switched to MetaMask account:', accounts[0]);
        }
        const checksumAddress = ethers.utils.getAddress(accounts[0]); // Convert to checksum format
        setAccount(checksumAddress);
        localStorage.setItem('connectedAccount', checksumAddress); // Save account before reload
        localStorage.setItem('providerType', 'MetaMask');

        // Switch to Binance Smart Chain
        await switchToBSC();
  
        // Reload the page
        window.location.reload();

      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.error('No accounts found. Please log in to MetaMask.');
        }
      }
    } else if (SavedProvider === 'CoinbaseWallet') {
      
      const sdk = createCoinbaseWalletSDK({
        appName: 'TCA Chat dApp',
        appLogoUrl: `https://${process.env.REACT_APP_BASE_DOMAIN}/assets/images/logo.png`, // Replace with your actual logo URL
        appChainIds: [56], // Binance Smart Chain ID
        preference: {
          options: 'eoaOnly', // EOA connections only
          attribution: { auto: true },
        },
      });
  
      // Get the provider directly from the SDK
      const provider = sdk.getProvider();
      if (!provider) {
        throw new Error('Failed to initialize Coinbase Wallet provider.');
      }
  
      // Force wallet selection by requesting accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        if (process.env.NODE_ENV !== 'production') {
          console.log('Connected account:', address);
        }
        // Convert to checksum address
        const checksumAddress = ethers.utils.getAddress(address);
  
        // Save account information
        setAccount(checksumAddress);
        localStorage.setItem('connectedAccount', checksumAddress);
        localStorage.setItem('providerType', 'CoinbaseWallet');
  
        // Switch to Binance Smart Chain
        await switchToBSC();
  
        // Reload the page only after successful connection
        if (process.env.NODE_ENV !== 'production') {
          console.log('Wallet switched to Coinbase account:', checksumAddress);
        }
        window.location.reload();
      } else {
  
        alert('No accounts found. Please log in to Coinbase Wallet.');
      }
    }
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Error switching wallet for ${providerType}:`, error);
    }
  }
};