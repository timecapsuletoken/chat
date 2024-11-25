import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gun from '../utils/gunSetup';

import AboutModal from '../components/HomePage/Modals/AboutModal';
import HelpModal from '../components/HomePage/Modals/HelpModal';
import Sidebar from '../components/HomePage/Sidebar/Sidebar';
import StartChatModal from '../components/HomePage/Modals/StartChatModal';
import WalletModal from '../components/HomePage/Modals/WalletModal';
import SettingsModal from '../components/HomePage/Modals/SettingsModal';
import BlockedModal from '../components/HomePage/Modals/BlockedModal';
import SidebarToggle from '../components/HomePage/Sidebar/SidebarToggle';
import WelcomePage from '../components/HomePage/WelcomePage';
import ChatWrapper from '../components/HomePage/ChatWrapper';

import '../assets/css/HomePage.css';

// Binance Smart Chain provider and TCA token setup
const bscProvider = new ethers.providers.JsonRpcProvider(`https://bsc-dataseed.binance.org/?_=${Date.now()}`);
const TCA_TOKEN_ADDRESS = '0x31aab810b51f499340fc1e1b08716d2bc92c7a56';
const BEP20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const tcaTokenContract = new ethers.Contract(TCA_TOKEN_ADDRESS, BEP20_ABI, bscProvider);

const HomePage = ({ account, disconnectWallet, switchAccount, switchToBSC, providerType }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility
  const [chatAddress, setChatAddress] = useState('');
  const currentChat = searchParams.get('chatwith');
  const [chats, setChats] = useState([]);
  const [balance, setBalance] = useState(0); // Placeholder balance
  const [tcaBalance, setTcaBalance] = useState(0); // TCA token balance
  const [isHovered, setIsHovered] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false); // State for HelpModal
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false); // State for wallet modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(false);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false);
  const [blockedAddresses, setBlockedAddresses] = useState([]);

  const [nickname, setNickname] = useState(''); // State to hold the nickname
  const [loading, setLoading] = useState(true); // Initial loading state is true

  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  const fetchChats = useCallback(() => {
    if (!account) return;
  
    console.log("Fetching chats for account:", account);
  
    const loadedChats = new Set();
    let subscription;
  
    const loadChats = () => {
      subscription = gun
        .get(account)
        .get('chats')
        .map()
        .once((address) => {
          if (address) {
            loadedChats.add(address);
            setChats(Array.from(loadedChats)); // Update state
          }
        })
        .on(() => {
          console.log("Chats updated:", Array.from(loadedChats));
        });
    };
  
    loadChats();
  
    return () => {
      if (subscription) subscription.off();
      console.log("Gun.js subscription cleaned up.");
    };
  }, [account]);  

  const formatNumber = (number) => {
    if (number >= 1e9) {
      return (number / 1e9).toFixed(2) + 'B'; // Billions
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(2) + 'M'; // Millions
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(2) + 'K'; // Thousands
    } else {
      return number.toFixed(2); // Smaller numbers
    }
  };  
  
  const fetchSettings = useCallback(async () => {
    if (!account) return;
  
    console.log("Fetching settings for account:", account);
  
    const attemptFetch = async (retry = 0) => {
      try {
        // Fetch all account data
        const data = await new Promise((resolve) => {
          gun.get(account).once((fetchedData) => resolve(fetchedData || {}));
        });
  
        if (Object.keys(data).length > 1) {
          console.log("Fetched data from Gun:", data);
  
          // Fetch and update nickname
          const fetchedNickname = data.nickname || `TCA#${account.slice(-3)}`;
          setNickname(fetchedNickname);
          console.log("Nickname updated:", fetchedNickname);
  
          // Update other settings
          setNotificationsEnabled(data.notificationsEnabled || false);
          setSoundAlertsEnabled(data.soundAlertsEnabled || false);
          setDesktopNotificationsEnabled(data.desktopNotificationsEnabled || false);
  
          // Fetch blocked addresses
          const addresses = await new Promise((resolve) => {
            const blocked = [];
            gun
              .get(account)
              .get('blockedAddresses')
              .map()
              .once((address) => {
                if (address && address !== true) blocked.push(address);
              })
              .on(() => resolve(blocked));
          });
  
          setBlockedAddresses(addresses);
          console.log("Blocked addresses loaded:", addresses);
        } else if (retry < 2) {
          console.log(`Retrying fetch attempt ${retry + 1}...`);
          await attemptFetch(retry + 1); // Recursive retry
        } else {
          console.log("No data found for this account in Gun.");
          // Set default values if no data is found
          setNickname(`TCA#${account.slice(-3)}`);
          setNotificationsEnabled(false);
          setSoundAlertsEnabled(false);
          setDesktopNotificationsEnabled(false);
          setBlockedAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching settings from Gun:", error);
        if (retry < 2) {
          console.log(`Retrying fetch attempt ${retry + 1}...`);
          await attemptFetch(retry + 1); // Recursive retry on error
        }
      }
    };
  
    await attemptFetch();

  }, [account]);   

  const handleSaveSettings = () => {
    const settings = {
      notificationsEnabled,
      soundAlertsEnabled,
      desktopNotificationsEnabled,
      nickname,
    };
  
    console.log("Attempting to save settings:", settings);
  
    gun.get(account).put(settings, (ack) => {
      if (ack.err) {
        console.error("Failed to save settings:", ack.err);
      } else if (ack.ok) {
        console.log("Settings saved successfully:", settings);
      } else {
        console.log("No error, but save status is ambiguous. Ack received:", ack);
      }
    });
  };  

  const handleToggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const handleToggleSoundAlerts = () => setSoundAlertsEnabled((prev) => !prev);
  const handleToggleDesktopNotifications = () => setDesktopNotificationsEnabled((prev) => !prev);

  const handleBlockAddress = (address) => {
    const trimmedAddress = address.trim();
    if (trimmedAddress && trimmedAddress !== '#' && !blockedAddresses.includes(trimmedAddress)) {

      if (account === trimmedAddress) {
        alert('Oops! You cannot Block your own wallet address. Please enter a different address');
        return;
      }
      
      // Update both the Gun database and local state
      gun.get(account).get('blockedAddresses').set(trimmedAddress, (ack) => {
        if (ack.err) {
          console.error("Failed to save blocked address:", ack.err);
        } else {
          setBlockedAddresses([...blockedAddresses, trimmedAddress]); // Update local state
          console.log("Blocked address saved successfully:", trimmedAddress);
        }
      });
    } else {
      console.warn("Invalid or duplicate address:", address);
    }
  };  
  
  const handleUnblockAddress = (address) => {
    // Remove from local state
    const updatedBlockedAddresses = blockedAddresses.filter(a => a !== address);
    setBlockedAddresses(updatedBlockedAddresses);
  
    // Remove from Gun
    gun.get(account).get('blockedAddresses').map().once((data, key) => {
      if (data === address) {
        gun.get(account).get('blockedAddresses').get(key).put(null, (ack) => {
          if (ack.err) {
            console.error("Failed to unblock address:", ack.err);
          } else {
            console.log("Address unblocked successfully:", address);
          }
        });
      }
    });
  };  

  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedAccount');
    
    console.log('Setting up listener for account:', account);

    // Listen for real-time updates
    gun.get(account).on((data) => {
      console.log('Real-time data update:', data);
    });

    if (!account && !savedAccount) {
      setChats([]);
      navigate('/login');
      return; // Exit early if there's no account
    }
  
    const loadAccountData = async () => {
      if (account) {
        console.log('Fetching settings and chats for account:', account);
        setLoading(true); // Start loading

        // Fetch account-specific settings
        fetchSettings();
  
        // Fetch chats for the account
        fetchChats();

        setLoading(false); // End loading
        console.log('Data fetch complete for account:', account);
      }
    };
  
    loadAccountData(); // Trigger the fetch functions when account changes
  }, [account, navigate, fetchSettings, fetchChats]);  

  const toggleBlockedModal = () => {
    console.log("Blocked addresses before saving:", blockedAddresses);
    setIsBlockedModalOpen(!isBlockedModalOpen);
    setIsSettingsModalOpen(false);
    // Fetch or refresh blocked addresses when opening the modal
    if (!isBlockedModalOpen) {
      fetchSettings(); // Fetch the latest blocked addresses
    }
  };  

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
      setShowModal(false);
  };

  // Function to toggle wallet modal visibility
  const openWalletModal = () => {
    fetchBalanceAndTxns();
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => setIsWalletModalOpen(false);

  const getBnbBalance = async (address) => {
    try {
      // Fetch the balance (in Wei)
      const balanceWei = await bscProvider.getBalance(address);
      
      // Convert the balance from Wei to BNB
      const balanceBnb = ethers.utils.formatEther(balanceWei);
      
      return balanceBnb;
    } catch (error) {
      console.error('Error fetching BNB balance:', error);
      return null;
    }
  };

  // Function to fetch TCA token balance
  const getTcaBalance = async (address) => {
    try {
      const balance = await tcaTokenContract.balanceOf(address);
      const decimals = await tcaTokenContract.decimals();
      return ethers.utils.formatUnits(balance, decimals); // Convert balance to readable format
    } catch (error) {
      console.error('Error fetching TCA token balance:', error);
      return null;
    }
  };

  // Updated fetchBalanceAndTxns function
  const fetchBalanceAndTxns = async () => {
    try {
      if (account) {
        const fetchedBalance = await getBnbBalance(account);
        const tcaTokenBalance = await getTcaBalance(account);
  
        const balance = parseFloat(fetchedBalance);
        const tcaBalance = parseFloat(tcaTokenBalance);
  
        // Update state in HomePage
        setBalance(balance);
        setTcaBalance(tcaBalance);
  
        return { balance, tcaBalance }; // Return both balances as an object
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      return { balance: 0, tcaBalance: 0 }; // Return defaults on error
    }
  };    

  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar state:", !isSidebarOpen); // Log state to check toggle
  };

   // Function to close sidebar
   const closeSidebar = () => {
    if (window.innerWidth <= 768) { // Check if on mobile
      setIsSidebarOpen(false);
    }
  };

  const handleStartChat = async () => {
    if (chatAddress.trim()) {
      const trimmedAddress = chatAddress.trim();
  
      // Validate the address
      if (!ethers.utils.isAddress(trimmedAddress)) {
        alert('Invalid BNB Address. Please enter a valid address.');
        return;
      }
  
      if (account === trimmedAddress) {
        alert('Oops! You cannot start a chat with your own wallet address. Please enter a different address.');
        return;
      }
  
      // Save chat address in Gun under the account node
      gun.get(account).get('chats').set(trimmedAddress, (ack) => {
        if (ack.err) {
          console.error("Failed to save chat address:", ack.err);
          alert("Failed to save the chat. Please try again.");
        } else {
          console.log("Chat address saved successfully:", trimmedAddress);
          setChats((prevChats) => [...new Set([...prevChats, trimmedAddress])]); // Update local state without duplicates
          setSearchParams({ chatwith: trimmedAddress });
          setShowModal(false);
        }
      });
    }
  };  

  const handleChatItemClick = (chatAddress) => {
    setSearchParams({ chatwith: chatAddress });
  };

  const handleDeleteChat = (chatToDelete) => {
    // Remove from local state
    const updatedChats = chats.filter((chat) => chat !== chatToDelete);
    setChats(updatedChats);
  
    // Remove from Gun
    gun.get(account).get('chats').map().once((data, key) => {
      if (data === chatToDelete) {
        gun.get(account).get('chats').get(key).put(null, (ack) => {
          if (ack.err) {
            console.error("Failed to delete chat:", ack.err);
          } else {
            console.log("Chat deleted successfully:", chatToDelete);
            setChats((prevChats) => prevChats.filter((chat) => chat !== chatToDelete));
          }
        });
      }
    });
  };
  
  const handleClearChatHistory = () => {
    if (account) {
      // Clear all chats from Gun.js
      gun.get(account).get('chats').map().once((data, key) => {
        gun.get(account).get('chats').get(key).put(null, (ack) => {
          if (ack.err) {
            console.error("Failed to delete chat:", ack.err);
          }
        });
      });
  
      // Clear local state
      setChats([]);
      console.log("Chat history cleared successfully.");
    } else {
      console.warn("No account found to clear chat history.");
    }
  }; 

  return (
    <div className="home-container">
      <Sidebar
        account={account}
        disconnectWallet={disconnectWallet}
        switchAccount={switchAccount}
        switchToBSC={switchToBSC}
        providerType={localStorage.getItem('providerType')} 
        gun={gun}
        isSidebarOpen={isSidebarOpen}
        showDropdown={showDropdown}
        chats={chats}
        setChats={setChats}
        nickname={nickname}
        setNickname={setNickname}
        loading={loading}
        isHovered={isHovered}
        toggleSidebar={toggleSidebar}
        toggleDropdown={toggleDropdown}
        setIsHovered={setIsHovered}
        openWalletModal={openWalletModal}
        handleOpenModal={handleOpenModal}
        handleChatItemClick={handleChatItemClick}
        handleDeleteChat={handleDeleteChat}
        handleClearChatHistory={handleClearChatHistory}
        navigate={navigate}
        setShowAboutModal={setShowAboutModal}
        setShowHelpModal={setShowHelpModal}
        toggleSettingsModal={toggleSettingsModal}
        closeSidebar={closeSidebar}
      />
      <StartChatModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        chatAddress={chatAddress}
        setChatAddress={setChatAddress}
        handleStartChat={handleStartChat}
        closeSidebar={closeSidebar}
      />
      <WalletModal
        isWalletModalOpen={isWalletModalOpen}
        closeWalletModal={closeWalletModal}
        account={account || ''}
        balance={balance}
        tcaBalance={tcaBalance}
        formatNumber={formatNumber}
      />
      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        toggleSettingsModal={toggleSettingsModal}
        notificationsEnabled={notificationsEnabled}
        soundAlertsEnabled={soundAlertsEnabled}
        desktopNotificationsEnabled={desktopNotificationsEnabled}
        handleToggleNotifications={handleToggleNotifications}
        handleToggleSoundAlerts={handleToggleSoundAlerts}
        handleToggleDesktopNotifications={handleToggleDesktopNotifications}
        toggleBlockedModal={toggleBlockedModal}
        handleSaveSettings={handleSaveSettings}
      />
      <BlockedModal
        isBlockedModalOpen={isBlockedModalOpen}
        toggleBlockedModal={toggleBlockedModal}
        blockedAddresses={blockedAddresses}
        handleUnblockAddress={handleUnblockAddress}
        handleBlockAddress={handleBlockAddress}
        handleSaveSettings={handleSaveSettings}
      />
      <div className="main-content">
        <SidebarToggle 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        <AboutModal 
          isOpen={showAboutModal} 
          onClose={() => setShowAboutModal(false)} 
        />
        <HelpModal 
          isOpen={showHelpModal} 
          onClose={() => setShowHelpModal(false)} 
        />
        {currentChat ? (
          <ChatWrapper
            account={account}
            toggleBlockedModal={toggleBlockedModal}
            handleDeleteChat={handleDeleteChat}
            openWalletModal={openWalletModal}
            setChatAddress={setChatAddress}
            formatNumber={formatNumber}
          />
        ) : (
          <WelcomePage handleOpenModal={handleOpenModal} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
