import React, { useState, useEffect, useCallback } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ethers } from 'ethers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gun from '../utils/gunSetup';
import LockedScreen from '../utils/LockedScreen';

import {
  fetchChats,
  fetchSettings,
  fetchNickname,
  handleSaveSettings,
  handleStartChat,
  handleDeleteChat,
  handleClearChatHistory,
  handleBlockAddress,
  handleUnblockAddress,
} from '../utils/gunHelpers';

import Snackbar from '../utils/Snackbar';

import AboutModal from '../components/HomePage/Modals/AboutModal';
import HelpModal from '../components/HomePage/Modals/HelpModal';
import Sidebar from '../components/HomePage/Sidebar/Sidebar';
import StartChatModal from '../components/HomePage/Modals/StartChatModal';
import WalletModal from '../components/HomePage/Modals/WalletModal';
import SettingsModal from '../components/HomePage/Modals/SettingsModal';
import PinModal from '../components/HomePage/Modals/PinModal';
import BlockedModal from '../components/HomePage/Modals/BlockedModal';
import WelcomePage from '../components/HomePage/WelcomePage';
import ChatWrapper from '../components/HomePage/ChatWrapper';
import useBrowserNotification from '../hooks/useBrowserNotification';
import { initializeAudio, playNotificationSound } from '../hooks/useAudioNotification';

import '../assets/css/HomePage/HomePage.css';

// Binance Smart Chain provider and TCA token setup
const bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const TCA_TOKEN_ADDRESS = '0x31aab810b51f499340fc1e1b08716d2bc92c7a56';
const BEP20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const tcaTokenContract = new ethers.Contract(TCA_TOKEN_ADDRESS, BEP20_ABI, bscProvider);

const HomePage = ({ account, disconnectWallet, switchAccount, switchToBSC }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility

  const [chatAddress, setChatAddress] = useState('');
  const currentChat = searchParams.get('chatwith');
  const [chats, setChats] = useState([]);
  const [unreadChats, setUnreadChats] = useState(new Set());

  const [balance, setBalance] = useState(0); // Placeholder balance
  const [tcaBalance, setTcaBalance] = useState(0); // TCA token balance
  const [isHovered, setIsHovered] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false); // State for HelpModal
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false); // State for wallet modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const [autoLockEnabled, setautoLockEnabled] = useState(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(false);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false);
  const [blockedAddresses, setBlockedAddresses] = useState([]);
  const providerType = localStorage.getItem('providerType');
  const [nickname, setNickname] = useState(''); // State to hold the nickname
  const [loading, setLoading] = useState(true); // Initial loading state is true
  const [isLocked, setIsLocked] = useState(false);
  const { showNotification } = useBrowserNotification();

  useEffect(() => {
    if (!account) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Redirecting to login");
      }
      setChats([]); // Clear chats
      navigate('/login'); // Redirect to login
    }
  }, [account, navigate]);
  
  const showSnackBar = (message, severity) => {
    Snackbar.handleShowSnackBar(message, severity);
  };

  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  const fetchSettingsData = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("Initializing settings fetch for account:", account.slice(-4));
    }
    
    fetchSettings(account, (settings) => {
  
      // Apply other settings as needed
      setautoLockEnabled(settings.autoLockEnabled || false);
      setSoundAlertsEnabled(settings.soundAlertsEnabled || false);
      setDesktopNotificationsEnabled(settings.desktopNotificationsEnabled || false);
      setBlockedAddresses(settings.blockedAddresses || []);

    });
  }, [account]);   

  useEffect(() => {
    let cleanupChats;
    let cleanupNickname;
    
    const initialize = async () => {
  
      if (process.env.NODE_ENV !== 'production') {
        console.log("Initializing chats");
      }
      setLoading(true);
  
      // Fetch chats
      cleanupChats = fetchChats(account, setChats);
  
      // Fetch nickname and verify reverse mapping
      cleanupNickname = fetchNickname(account, (nickname) => {
        setNickname(nickname);
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Nickname set to: "${nickname}" for account: ${account}`);
        }
      });
  
      // Fetch settings
      await fetchSettingsData();
  
      setLoading(false);
    };
  
    initialize();
  
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Cleaning up subscriptions for account:", account);
      }
      if (cleanupChats) cleanupChats();
      if (cleanupNickname) cleanupNickname();
    };
  }, [account, navigate, fetchSettingsData]);  

  useEffect(() => {
    if (!autoLockEnabled) return;
  
    const lockTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
  
    let timer;
  
    const resetTimestamp = () => {
      const currentTime = Date.now();
      localStorage.setItem('screen:auto:lock:timestamp', JSON.stringify({ timestamp: currentTime }));
    };
  
    const startAutoLockCountdown = () => {
      const savedTimestamp = JSON.parse(localStorage.getItem('screen:auto:lock:timestamp'))?.timestamp;
      if (!savedTimestamp) {
        if (process.env.NODE_ENV !== 'production') {
          console.error("Timestamp not found. Cannot enable auto-lock.");
        }
        return;
      }
  
      const currentTime = Date.now();
      const elapsedTime = currentTime - savedTimestamp; // Time elapsed since last interaction
      const remainingTime = lockTimeout - elapsedTime;
  
      if (remainingTime <= 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.log("Auto-lock time expired. Locking screen now.");
        }
        setIsLocked(true);
        return;
      }
  
      clearTimeout(timer); // Clear any previous timeout
      timer = setTimeout(() => {
        setIsLocked(true);
        if (process.env.NODE_ENV !== 'production') {
          console.log("Auto-lock activated. Screen is now locked.");
        }
      }, remainingTime);
    };
  
    const activityHandler = () => {
      if (isLocked) return; // Ignore events when screen is locked
      resetTimestamp(); // Update timestamp on interaction
      startAutoLockCountdown(); // Restart countdown
    };
  
    const addEventListeners = () => {
      window.addEventListener('mousemove', activityHandler);
      window.addEventListener('keydown', activityHandler);
      window.addEventListener('click', activityHandler);
    };
  
    const removeEventListeners = () => {
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keydown', activityHandler);
      window.removeEventListener('click', activityHandler);
    };
  
    // Start countdown and add listeners
    startAutoLockCountdown();
    addEventListeners();
  
    // Cleanup on unmount or when auto-lock is disabled
    return () => {
      clearTimeout(timer);
      removeEventListeners();
    };
  }, [autoLockEnabled, isLocked]);  

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!("Notification" in window)) {
        if (process.env.NODE_ENV !== 'production') {
          console.error("This browser does not support desktop notifications.");
        }
        return;
      }
  
      if (Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            if (process.env.NODE_ENV !== 'production') {
              console.log("Notification permission granted.");
            }
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.warn("Notification permission denied.");
            }
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error("Error while requesting notification permission:", error);
          }
        }
      } else if (Notification.permission === "granted") {
        if (process.env.NODE_ENV !== 'production') {
          console.log("Notification permission already granted.");
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "Notification permission already denied. Please enable it manually in browser settings."
          );
        }
      }
    };
  
    if (desktopNotificationsEnabled) {
      requestNotificationPermission();
    }
  }, [desktopNotificationsEnabled]);  

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

  const handleToggleautoLockEnabled = () => {
    setautoLockEnabled((prev) => {
      const newState = !prev;
  
      // Save the timestamp when Auto-Lock is enabled
      if (newState) {
        localStorage.setItem(
          'screen:auto:lock:timestamp',
          JSON.stringify({ timestamp: Date.now() }) // Save current time
        );
        setIsPinModalOpen(true); 
      }
  
      // Save the updated Auto-Lock setting to localStorage or backend
      //saveSettings(); // This function ensures settings are persisted
      //toggleSettingsModal(false);
      return newState;
    });
  };

  const handleClosePinModal = () => {
    setIsPinModalOpen(false);
  };
  
  const handleToggleSoundAlerts = () => setSoundAlertsEnabled((prev) => !prev);
  const handleToggleDesktopNotifications = () => setDesktopNotificationsEnabled((prev) => !prev); 

  useEffect(() => {
    if (!account || chats.length === 0) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[DEBUG] No account or chats to check unread messages.");
      }
      return;
    }
  
    const unreadSet = new Set();
    const activeListeners = new Map(); // Track active listeners
  
    if (process.env.NODE_ENV !== 'production') {
      console.log("[DEBUG] Setting up real-time unread messages monitoring.");
    }
    
    for (const chatAddress of chats) {
      if (activeListeners.has(chatAddress)) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Listener already exists for chat: ${chatAddress}`);
        }
        continue;
      }
  
      const receiverNode = gun.get(`chats/${account}/messages/${chatAddress}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Listening to messages for chat: ${chatAddress}`);
      }
      
      const listener = receiverNode.map().on((message, id) => {
        if (!message || !id) return;
  
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Processing message ID: ${id} for chatAddress: ${chatAddress}`, message);
        }
        
        if (message.status === 'unread') {
          if (!unreadSet.has(chatAddress)) {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`[DEBUG] Adding chat with unread messages: ${chatAddress}`);
            }
            unreadSet.add(chatAddress);
            setUnreadChats(new Set([...unreadSet]));
            if (Notification.permission === "granted") {
              showNotification("New Message", {
                body: `You have a new message from ${chatAddress.slice(-5)}!`,
                icon: '/assets/images/logo.png', // Optional icon for the notification
              });     
            }   
            if (soundAlertsEnabled === true) {
              playNotificationSound(); 
            }
          }
        } else if (message.status === 'read' && unreadSet.has(chatAddress)) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEBUG] Removing chat with read messages: ${chatAddress}`);
          }
          unreadSet.delete(chatAddress);
          setUnreadChats(new Set([...unreadSet]));
        }
      });
  
      activeListeners.set(chatAddress, listener);
    }
  
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[DEBUG] Cleaning up listeners for unread messages.");
      }
      activeListeners.forEach((listener, chatAddress) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Cleaning up listener for chat: ${chatAddress}`);
        }
        listener.off();
      });
      activeListeners.clear();
    };
  }, [account, chats, setUnreadChats, showNotification, soundAlertsEnabled]);    

  useEffect(() => {
    initializeAudio(); // Preload sound when the app starts
  }, []);  
  
  const saveSettings = () => {  
    const settings = {
      autoLockEnabled: autoLockEnabled || false,
      soundAlertsEnabled: soundAlertsEnabled || false,
      desktopNotificationsEnabled: desktopNotificationsEnabled || false,
      blockedAddresses: Array.isArray(blockedAddresses) ? blockedAddresses : [], // Ensure valid array
    };
  
    handleSaveSettings(account, settings, showSnackBar);
  };  

  const toggleBlockedModal = () => {  
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
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching BNB balance:', error);
      }
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
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching TCA token balance:', error);
      }
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
      if (process.env.NODE_ENV !== 'production') {
        console.error("Failed to fetch wallet data:", error);
      }
      return { balance: 0, tcaBalance: 0 }; // Return defaults on error
    }
  };    

  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closetoggleSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };  

   // Function to close sidebar
   const closeSidebar = () => {
    if (window.innerWidth <= 768) { // Check if on mobile
      setIsSidebarOpen(false);
    }
  };

  const startChat = () => {
    handleStartChat(account, chatAddress, setChats, setSearchParams, setShowModal, showSnackBar);
  };

  const deleteChat = (chatToDelete) => {
    handleDeleteChat(account, chatToDelete, setChats, showSnackBar);
    navigate('/home');
  };

  const clearChatHistory = () => {
    handleClearChatHistory(account, setChats);
  };

  const blockAddress = (address) => {
    handleBlockAddress(account, address, setBlockedAddresses, showSnackBar);
  };

  const unblockAddress = (address) => {
    handleUnblockAddress(account, address, setBlockedAddresses, showSnackBar);
  };

  return isLocked ? (
    <LockedScreen account={account} disconnectWallet={disconnectWallet} onUnlock={() => setIsLocked(false)} showSnackBar={showSnackBar} />
  ) : (
        <>
          {/* Meta Tags */}
          <HelmetProvider>
          <Helmet>
            <title>Home - TimeCapsule Chat</title>
            <meta name="description" content="Welcome to TimeCapsule Chat, your gateway to secure decentralized communication. Connect, chat, and explore the future of messaging." />
            <meta name="keywords" content="TimeCapsule Chat, decentralized communication, Web3 messaging, secure chat" />
            <meta name="author" content="TimeCapsule Team" />            
          </Helmet>
          </HelmetProvider>
          <div className="home-container">
            <Sidebar
              account={account}
              disconnectWallet={disconnectWallet}
              switchAccount={switchAccount}
              switchToBSC={switchToBSC}
              providerType={providerType} 
              gun={gun}
              isSidebarOpen={isSidebarOpen}
              showDropdown={showDropdown}
              chats={chats}
              setChats={setChats}
              unreadChats={unreadChats}
              nickname={nickname}
              setNickname={setNickname}
              loading={loading}
              showSnackBar={showSnackBar}
              isHovered={isHovered}
              toggleSidebar={toggleSidebar}
              closetoggleSidebar={closetoggleSidebar}
              toggleDropdown={toggleDropdown}
              setIsHovered={setIsHovered}
              openWalletModal={openWalletModal}
              handleOpenModal={handleOpenModal}
              handleChatItemClick={(chatAddress) => setSearchParams({ chatwith: chatAddress })}
              deleteChat={deleteChat}
              handleClearChatHistory={clearChatHistory}
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
              handleStartChat={startChat}
              closeSidebar={closeSidebar}
              showSnackBar={showSnackBar}
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
              autoLockEnabled={autoLockEnabled}
              soundAlertsEnabled={soundAlertsEnabled}
              desktopNotificationsEnabled={desktopNotificationsEnabled}
              handleToggleautoLockEnabled={handleToggleautoLockEnabled}
              handleToggleSoundAlerts={handleToggleSoundAlerts}
              handleToggleDesktopNotifications={handleToggleDesktopNotifications}
              toggleBlockedModal={toggleBlockedModal}
              handleSaveSettings={saveSettings}
              account={account}
            />
            {isPinModalOpen && account && (
              <PinModal
                isOpen={isPinModalOpen}
                account={account}
                onClose={handleClosePinModal}
              />
            )}
            <BlockedModal
              isBlockedModalOpen={isBlockedModalOpen}
              toggleBlockedModal={toggleBlockedModal}
              blockedAddresses={blockedAddresses}
              handleUnblockAddress={unblockAddress}
              handleBlockAddress={blockAddress}
              handleSaveSettings={saveSettings}
              showSnackBar={showSnackBar}
            />
            <div className="main-content">
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
                  deleteChat={deleteChat}
                  openWalletModal={openWalletModal}
                  setChatAddress={setChatAddress}
                  formatNumber={formatNumber}
                  isSidebarOpen={isSidebarOpen} 
                  toggleSidebar={toggleSidebar}   
                  toggleSidebarText="Dashboard"
                  showSnackBar={showSnackBar}
                />
              ) : (
                <WelcomePage 
                  handleOpenModal={handleOpenModal}
                  isSidebarOpen={isSidebarOpen} 
                  toggleSidebar={toggleSidebar}   
                />
              )}
            </div>
          </div>
        </>
      );
};

export default HomePage;
