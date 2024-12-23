import { ethers } from 'ethers';

// Configuration to toggle between testnet and mainnet
const config = {
  network: 'testnet', // Change to 'mainnet' for production
  testnet: {
    rpcUrl: 'https://bsc-testnet.bnbchain.org/',
    chainId: '0x61', // Chain ID for BSC Testnet
    chainName: 'Binance Smart Chain Testnet',
    explorerUrl: 'https://testnet.bscscan.com',
  },
  mainnet: {
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: '0x38', // Chain ID for BSC Mainnet
    chainName: 'Binance Smart Chain Mainnet',
    explorerUrl: 'https://bscscan.com',
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
async function switchNetwork() {
  const network = config[config.network];

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: network.chainId,
          chainName: network.chainName,
          rpcUrls: [network.rpcUrl],
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
          },
          blockExplorerUrls: [network.explorerUrl],
        },
      ],
    });
  } catch (error) {
    console.error("Failed to switch network:", error);
    throw new Error("Failed to switch network. Please try again.");
  }
}

// Send BNB Donation
export async function donate(donationUSD) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to continue.");
  }

  try {
    // Switch to the selected network
    await switchNetwork();

    // Calculate the BNB amount for the donation
    const bnbAmount = await calculateBNBAmount(donationUSD);

    // Request wallet connection
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Send BNB
    const tx = await signer.sendTransaction({
      to: donationWallet,
      value: ethers.utils.parseEther(bnbAmount.toFixed(18)), // Convert BNB to Wei
    });

    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Donation failed:", error);

    // Handle specific error messages
    if (error.code === -32603 && error.data?.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds for gas or transaction value.");
    } else {
      throw new Error("Transaction failed. Please try again.");
    }
  }
}
