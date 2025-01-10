import { ethers } from 'ethers';

// Configuration to toggle between testnet and mainnet
const config = {
  network: 'mainnet', // Change to 'mainnet' for production
  testnet: {
    rpcUrl: 'https://bsc-testnet.bnbchain.org/',
    chainId: '0x61', // Chain ID for BSC Testnet
    chainName: 'BNB Smart Chain Testnet',
    explorerUrl: 'https://testnet.bscscan.com',
    symbol: 'tBNB', // Symbol for BNB on Testnet
  },
  mainnet: {
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: '0x38', // Chain ID for BSC Mainnet
    chainName: 'Binance Smart Chain Mainnet',
    explorerUrl: 'https://bscscan.com',
    symbol: 'BNB', // Symbol for BNB on Mainnet
  },
};

const donationWallet = "0x812e7ddb3576376d3420dec704335d91e6f49795"; // Wallet to receive donations

// Fetch BNB price in USD
async function fetchBNBPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    const data = await response.json();
    return data.binancecoin.usd; // Current BNB price in USD
  } catch (error) {
    throw new Error("Failed to fetch BNB price. Please try again.");
  }
}

// Calculate BNB amount for a given donation in USD
async function calculateBNBAmount(donationUSD) {
  const bnbPrice = await fetchBNBPrice();
  return donationUSD / bnbPrice; // Donation in BNB
}

// Add the selected network to MetaMask
// Add the selected network to MetaMask or switch to it if needed
export async function switchNetwork() {
  const { network } = config;
  const selectedNetwork = config[network];

  try {
    // Check if the current network matches the required network
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId === selectedNetwork.chainId) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Already on the correct network:", selectedNetwork.chainName);
      }
      return; // No need to switch networks
    }

    // Request to switch network
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.chainId,
          chainName: selectedNetwork.chainName,
          nativeCurrency: {
            name: network === 'testnet' ? 'Test Binance Coin' : 'Binance Coin',
            symbol: network === 'testnet' ? 'tBNB' : 'BNB', // tBNB for Testnet, BNB for Mainnet
            decimals: 18,
          },
          rpcUrls: [selectedNetwork.rpcUrl],
          blockExplorerUrls: [selectedNetwork.explorerUrl],
        },
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log("Switched to network:", selectedNetwork.chainName);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Failed to switch network:", error);
    }
    throw new Error("Failed to switch network. Please try again.");
  }
}

export async function donate(donationUSD) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to continue.");
  }

  try {
    // Ensure MetaMask is connected
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request account access
    const signer = provider.getSigner(); // Get the signer after ensuring connection

    // Ensure the user is on the correct network
    if (process.env.NODE_ENV !== 'production') {
      console.log('Switching network...');
    }
    await switchNetwork();

    // Calculate the BNB amount for the donation
    let bnbAmount = await calculateBNBAmount(donationUSD);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Calculated BNB amount (raw):', bnbAmount);
    }
    // Round to 18 decimal places to avoid fractional component errors
    bnbAmount = parseFloat(bnbAmount.toFixed(18));
    if (process.env.NODE_ENV !== 'production') {
      console.log('Calculated BNB amount (rounded):', bnbAmount);
    }
    // Send BNB
    const tx = await signer.sendTransaction({
      to: donationWallet,
      value: ethers.utils.parseUnits(bnbAmount.toString(), 'ether'), // Convert BNB to Wei
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Transaction sent successfully:', tx);
    }

    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Donation failed:", error);
    }
    // Handle specific error messages
    if (error.code === -32603 && error.data?.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds for gas or transaction value.");
    } else {
      throw new Error("Transaction failed. Please try again.");
    }
  }
}