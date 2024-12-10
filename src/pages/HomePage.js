import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gun from '../utils/gunSetup';

import {
  fetchChats,
  fetchSettings,
  fetchNickname,
  //hasUnreadMessages,
  fetchNicknameFromWallet,
  handleSaveSettings,
  handleStartChat,
  handleDeleteChat,
  handleClearChatHistory,
  handleBlockAddress,
  handleUnblockAddress,
} from '../utils/gunHelpers';

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

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(false);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false);
  const [blockedAddresses, setBlockedAddresses] = useState([]);

  const [findNick, setfindNick] = useState('Fetching...');
  const [nickname, setNickname] = useState(''); // State to hold the nickname
  const [loading, setLoading] = useState(true); // Initial loading state is true

  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  const fetchSettingsData = useCallback(() => {
    console.log("Initializing settings fetch for account:", account.slice(-4));
  
    fetchSettings(account, (settings) => {
  
      // Apply other settings as needed
      setNotificationsEnabled(settings.notificationsEnabled || false);
      setSoundAlertsEnabled(settings.soundAlertsEnabled || false);
      setDesktopNotificationsEnabled(settings.desktopNotificationsEnabled || false);
      setBlockedAddresses(settings.blockedAddresses || []);

    });
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

  const handleToggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const handleToggleSoundAlerts = () => setSoundAlertsEnabled((prev) => !prev);
  const handleToggleDesktopNotifications = () => setDesktopNotificationsEnabled((prev) => !prev); 

  useEffect(() => {
    if (!account || chats.length === 0) {
      console.log("[DEBUG] No account or chats to check unread messages.");
      return;
    }
  
    const unreadSet = new Set();
    const listeners = [];
  
    console.log("[DEBUG] Setting up real-time unread messages monitoring.");
  
    for (const chatAddress of chats) {
      const receiverNode = gun.get(`chats/${account}/messages/${chatAddress}`);
      console.log(`[DEBUG] Listening to messages for chat: ${chatAddress}`);
  
      const listener = receiverNode.map().on((message, id) => {
        if (!message || !id) return;
  
        console.log(`[DEBUG] Processing message ID: ${id} for chatAddress: ${chatAddress}`, message);
  
        if (message.status === 'unread') {
          console.log(`[DEBUG] Adding chat with unread messages: ${chatAddress}`);
          unreadSet.add(chatAddress);
        } else if (message.status === 'read' && unreadSet.has(chatAddress)) {
          console.log(`[DEBUG] Removing chat with read messages: ${chatAddress}`);
          unreadSet.delete(chatAddress);
        }
  
        setUnreadChats(new Set([...unreadSet]));
        console.log("[DEBUG] Updated unreadChats in HomePage:", Array.from(unreadSet));
      });
  
      listeners.push(listener);
    }
  
    return () => {
      console.log("[DEBUG] Cleaning up listeners for unread messages.");
      listeners.forEach((listener) => listener.off());
    };
  }, [account, chats, setUnreadChats]);    
  
  useEffect(() => {
    const debounceFetch = setTimeout(() => {

      if (!account) {
        console.log("Redirecting to login");
        setChats([]);
        navigate('/login');
        return;
      }          

      console.log("Initializing chats");
      setLoading(false);
      const cleanupChats = fetchChats(account, setChats);
      // Fetch nickname
      const cleanupNickname = fetchNickname(account, setNickname);
      setLoading(true);
      fetchSettingsData();

      return () => {
        console.log("Cleaning up chat subscriptions for account:", account);
        if (cleanupChats) cleanupChats();
        if (cleanupNickname) cleanupNickname();
      };
    }, 300); // Delay of 300ms to avoid rapid re-renders

    return () => clearTimeout(debounceFetch); // Clear timeout on unmount
  }, [account, navigate, fetchSettingsData]);  

  useEffect(() => {
    if (chatAddress || currentChat) {
      findNickname(currentChat);
    }
  }, [chatAddress, currentChat, findNick]);  
  
  const saveSettings = () => {
    const settings = {
      notificationsEnabled,
      soundAlertsEnabled,
      desktopNotificationsEnabled,
      blockedAddresses,
    };
    handleSaveSettings(account, settings);
  };

  const findNickname = async (wallet) => {
    try {
      const fetchedNickname = await fetchNicknameFromWallet(wallet);
      setfindNick(fetchedNickname);
    } catch (err) {
      console.error("Error fetching nickname:", err);
      setfindNick('No nickname found');
    }
  };

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

  const closetoggleSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      console.log("Sidebar closed.");
    }
  };  

   // Function to close sidebar
   const closeSidebar = () => {
    if (window.innerWidth <= 768) { // Check if on mobile
      setIsSidebarOpen(false);
    }
  };

  const startChat = () => {
    handleStartChat(account, chatAddress, setChats, setSearchParams, setShowModal);
  };

  const deleteChat = (chatToDelete) => {
    handleDeleteChat(account, chatToDelete, setChats);
    navigate('/home');
  };

  const clearChatHistory = () => {
    handleClearChatHistory(account, setChats);
  };

  const blockAddress = (address) => {
    handleBlockAddress(account, address, setBlockedAddresses);
  };

  const unblockAddress = (address) => {
    handleUnblockAddress(account, address, setBlockedAddresses);
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
        unreadChats={unreadChats}
        findNick={findNick}
        nickname={nickname}
        setNickname={setNickname}
        loading={loading}
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
        handleSaveSettings={saveSettings}
      />
      <BlockedModal
        isBlockedModalOpen={isBlockedModalOpen}
        toggleBlockedModal={toggleBlockedModal}
        blockedAddresses={blockedAddresses}
        handleUnblockAddress={unblockAddress}
        handleBlockAddress={blockAddress}
        handleSaveSettings={saveSettings}
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
            deleteChat={deleteChat}
            openWalletModal={openWalletModal}
            setChatAddress={setChatAddress}
            findNick={findNick}
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
