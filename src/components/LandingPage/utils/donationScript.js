import { ethers } from 'ethers';

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

// Send BNB Donation
export async function donate(donationUSD) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to continue.");
  }

  try {
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
