import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import gun from '../utils/gunSetup';
import 'gun/lib/webrtc'; // Real-time peer connections (if needed)
import { encryptMessage, decryptMessage } from '../utils/cryptographer';
import SidebarToggle from '../components/HomePage/Sidebar/SidebarToggle';
import ChatOptionsMenu from '../components/HomePage/ChatOptionsMenu'; // Adjust path as necessary
import { markMessagesAsRead, fetchNicknameFromWallet } from '../utils/gunHelpers'; // Adjust the import path if needed
import { FaSmile, FaPaperPlane } from 'react-icons/fa';
import 'emoji-picker-element';
import '../assets/css/ChatPage.css';
import TCACoin from '../assets/images/logos/logo.png';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { RiBnbLine } from "react-icons/ri";
import {
  Box,
  Avatar,
  TextField,
  Typography,
  Stack, 
  Link, 
  Chip,
  Button, 
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { generateJazzicon } from '../utils/jazzAvatar';

// Binance Smart Chain provider and TCA token setup
const bscProvider = new ethers.providers.JsonRpcProvider(`https://bsc-dataseed.binance.org/`);
const TCA_TOKEN_ADDRESS = '0x31aab810b51f499340fc1e1b08716d2bc92c7a56';
const BEP20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const tcaTokenContract = new ethers.Contract(TCA_TOKEN_ADDRESS, BEP20_ABI, bscProvider);

const ChatPage = ({ account, toggleBlockedModal, deleteChat, formatNumber, isSidebarOpen, toggleSidebar, toggleSidebarText, showSnackBar }) => {
  const [messages, setMessages] = useState([]); // All chat messages
  const [message, setMessage] = useState(''); // Current input message
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatAddress = params.get('chatwith');
  const [chatNickname, setChatNickname] = useState(''); // State to hold the nickname
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const navigate = useNavigate();
  const [isWalletInfoModalOpen, setIsWalletInfoModalOpen] = useState(false);
  const [balance, setBalance] = useState(0); // Placeholder balance
  const [tcaBalance, setTcaBalance] = useState(0); // TCA token balance
  const [blockedAddresses, setBlockedAddresses] = useState([]);
  const avatarRef = useRef(null);
  const chatBodyRef = useRef(null); // Reference for the chat-body container
  const processedMessageIds = useRef(new Set()); // Use ref to track processed messages
  const isAddressBlocked = blockedAddresses.includes(chatAddress);
  const [isLoading, setIsLoading] = useState(false);

  const isBlocked = async (account, chatAddress) => {
    if (!account || !chatAddress) return false;
  
    const blockedBySender = await new Promise((resolve) => {
      gun.get(account).get('blockedAddresses').get(chatAddress).once((data) => {
        resolve(data === true);
      });
    });
  
    const blockedByReceiver = await new Promise((resolve) => {
      gun.get(chatAddress).get('blockedAddresses').get(account).once((data) => {
        resolve(data === true);
      });
    });
  
    return blockedBySender || blockedByReceiver;
  };
  
  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setIsLoading(false);
      handleSendMessage();
    }, 500);
  };

  useEffect(() => {
    if (!account) return;
  
    const fetchBlockedAddresses = () => {
      console.log("Fetching blocked addresses for account:", account);
  
      const blockedAddressesNode = gun.get(account).get('blockedAddresses');
      const addresses = new Set();
  
      blockedAddressesNode.map().on((data, key) => {
        if (data === true) {
          addresses.add(key);
        } else {
          addresses.delete(key);
        }
        // Ensure no duplicates in state
        setBlockedAddresses([...addresses]);
      });
    };
  
    fetchBlockedAddresses();
  
    return () => {
      gun.get(account).get('blockedAddresses').off();
    };
  }, [account]);

  useEffect(() => {
    if (!chatAddress || !account) return;
  
    console.log('Subscribing to messages for chatAddress:', chatAddress);
  
    // Clear messages and processed IDs when switching chats
    setMessages([]);
    processedMessageIds.current.clear();
  
    if (chatAddress && avatarRef.current) {
      generateJazzicon(chatAddress, avatarRef.current, 40); // Generate Jazzicon for the chat
    }

    const senderNode = gun.get(`chats/${account}/messages/${chatAddress}`); // Messages sent by the sender
    const receiverNode = gun.get(`chats/${chatAddress}/messages/${account}`); // Messages received from the receiver
  
    const processMessage = async (message, id, source) => {
      if (!message || processedMessageIds.current.has(id)) return; // Skip duplicates
      processedMessageIds.current.add(id);
  
      try {
        // Ensure message belongs to the current chat
        if (
          (source === 'receiver' && message.sender !== chatAddress) || // Received message from the other party
          (source === 'sender' && message.sender !== account) // Sent message by the current user
        ) {
          return; // Ignore messages not related to the current chat
        }
  
        const decryptedContent = decryptMessage(
          message.content,
          message.sender,
          message.sender === account ? chatAddress : account
        );
  
        const processedMessage = { ...message, content: decryptedContent || '[Unable to decrypt]', id };
  
        console.log(`[DEBUG] Processed message from ${source}:`, processedMessage);
        setMessages((prev) =>
          [...prev, processedMessage].sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp
        );

      } catch (error) {
        console.error(`[DEBUG] Decryption failed for message ID: ${id}`, error);
        setMessages((prev) =>
          [...prev, { ...message, content: '[Unable to decrypt]', id }].sort((a, b) => a.timestamp - b.timestamp)
        );
      }
    };
  
    const fetchMessages = async () => {
      // Fetch messages for the current chat from both sender and receiver nodes
      const senderMessages = await gun.get(`chats/${account}/messages/${chatAddress}`).once();
      const receiverMessages = await gun.get(`chats/${chatAddress}/messages/${account}`).once();
  
      // Combine and process fetched messages
      Object.entries(senderMessages || {}).forEach(([id, message]) =>
        processMessage(message, id, 'sender')
      );
      Object.entries(receiverMessages || {}).forEach(([id, message]) =>
        processMessage(message, id, 'receiver')
      );
    };
  
    fetchMessages();
  
    const senderListener = senderNode.map().on((message, id) => processMessage(message, id, 'sender'));
    const receiverListener = receiverNode.map().on((message, id) => processMessage(message, id, 'receiver'));
  
    return () => {
      senderListener.off();
      receiverListener.off();
    };
  }, [account, chatAddress]);

  useEffect(() => {
    const handleClick = (event) => {
      const targetClasses = [
        'chat-box',
        'chat-header',
        'chat-container',
        'chat-body',
      ];

      // Check if the clicked element belongs to the target classes
      if (targetClasses.some((cls) => event.target.closest(`.${cls}`))) {
        console.log('[DEBUG] Click detected in chat area. Marking messages as read.');
        markMessagesAsRead(account, chatAddress); // Mark messages as read
      }
    };

    // Attach event listener to the document
    document.addEventListener('click', handleClick);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [account, chatAddress]);

  useEffect(() => {
    const chatFetchNickname = async () => {
      if (!chatAddress) return;
  
      try {
        const getchatNickname = await fetchNicknameFromWallet(chatAddress);
        console.log(`[DEBUG] ChatNickname fetched: ${getchatNickname}`);
        setChatNickname(getchatNickname); // Assuming you have a state like `chatNickname`
      } catch (error) {
        console.error(`[ERROR] Failed to fetch ChatNickname for "${chatAddress}":`, error);
      }
    };
  
    chatFetchNickname();
  }, [chatAddress]);  
  
  useEffect(() => {
    if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showSnackBar('Cannot send an empty message.', 'error'); // Optional: Provide user feedback
      return;
    }

    console.log('[DEBUG] Checking block status...');
    const isChatBlocked = await isBlocked(account, chatAddress);
  
    if (isChatBlocked) {
      console.warn(`[WARN] Chat is blocked between ${account} and ${chatAddress}`);
      showSnackBar('Message cannot be sent. One of the parties has blocked the other.', 'error');
      return;
    }  
    
    console.log('[DEBUG] Sending message:', message);
  
    // Encrypt the message content
    const encryptedMessage = encryptMessage(message);
    console.log('[DEBUG] Encrypted message:', encryptedMessage);
  
    const timestamp = Date.now();
  
    // Message for the sender (status: 'read')
    const senderMessage = {
      sender: account,
      content: encryptedMessage,
      timestamp,
      status: 'read', // Sender's message is marked as read
    };
  
    // Message for the receiver (status: 'unread')
    const receiverMessage = {
      sender: account,
      content: encryptedMessage,
      timestamp,
      status: 'unread', // Receiver's message is marked as unread
    };
  
    // Save the message for the sender
    gun.get(`chats/${account}/messages/${chatAddress}`).set(senderMessage, (senderAck) => {
      if (senderAck.err) {
        console.error('[DEBUG] Failed to save message for sender:', senderAck.err);
      } else {
        console.log('[DEBUG] Message saved for sender.');
      }
    });
  
    // Save the message for the receiver and add the chat to their node
    gun.get(`chats/${chatAddress}/messages/${account}`).set(receiverMessage, (receiverAck) => {
      if (receiverAck.err) {
        console.error('[DEBUG] Failed to save message for receiver:', receiverAck.err);
      } else {
        console.log('[DEBUG] Message saved for receiver.');
  
        // Add the chat to the receiver's `chats` node
        const receiverChatsNode = gun.get(chatAddress).get('chats');
        receiverChatsNode.set(account, (receiverAck) => {
          if (receiverAck.err) {
            console.error("Failed to add chat for receiver:", receiverAck.err);
          } else {
            console.log(`Chat added for receiver: ${chatAddress} with ${account}`);
          }
        });
      }
    });
  
    // Clear the input field
    setMessage('');
  };  

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiSelect = (event) => {
    console.log('Emoji event received:', event); // Debug: Log the event
    if (!event?.detail?.unicode) {
      console.warn("Invalid emoji select event", event);
      return;
    }
    const emoji = event.detail.unicode;
    console.log('Selected Emoji:', emoji); // Debug: Log the selected emoji
    setMessage((prevMessage) => `${prevMessage}${emoji}`); // Append emoji to the message
    setShowEmojiPicker(false); // Close the emoji picker
  };  

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      console.log('Click detected outside emoji picker'); // Debug: Log outside click
      setShowEmojiPicker(false);
    }
  };  

  useEffect(() => {
    const picker = emojiPickerRef.current;
    if (picker) {
      picker.addEventListener('emoji-click', onEmojiSelect);
    }

    // Add click event listener to close the picker
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (picker) {
        picker.removeEventListener('emoji-click', onEmojiSelect);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const getBnbBalance = async (chatAddress) => {
    try {
      // Fetch the balance (in Wei)
      const balanceWei = await bscProvider.getBalance(chatAddress);
      
      // Convert the balance from Wei to BNB
      const balanceBnb = ethers.utils.formatEther(balanceWei);
      
      return balanceBnb;
    } catch (error) {
      console.error('Error fetching BNB balance:', error);
      return null;
    }
  };

  // Function to fetch TCA token balance
  const getTcaBalance = async (chatAddress) => {
    try {
      const balance = await tcaTokenContract.balanceOf(chatAddress);
      const decimals = await tcaTokenContract.decimals();
      return ethers.utils.formatUnits(balance, decimals); // Convert balance to readable format
    } catch (error) {
      console.error('Error fetching TCA token balance:', error);
      return null;
    }
  };

  // Simulate fetching wallet balance and transaction count
  // Updated fetchBalanceAndTxns function
  const fetchBalanceAndTxns = async () => {
    try {
      if (chatAddress) {
        const fetchedBalance = await getBnbBalance(chatAddress);
        setBalance(parseFloat(fetchedBalance));

        // Fetch TCA balance
        const tcaTokenBalance = await getTcaBalance(chatAddress);
        setTcaBalance(parseFloat(tcaTokenBalance));

      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

    // Function to toggle wallet modal visibility
    const handleWalletInfo = () => {
      fetchBalanceAndTxns();
      setIsWalletInfoModalOpen(true);
    };

    const closeinfoWalletModal = () => setIsWalletInfoModalOpen(false);
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent default behavior of Enter
        handleSendMessage(); // Send the message
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // Prevent default behavior
        setMessage((prevMessage) => `${prevMessage}\n`); // Add a new line
      }
    }; 
    
    const adjustHeight = (e) => {
      const element = e.target;
      element.style.height = "40px"; // Reset height
      element.style.height = `${element.scrollHeight}px`; // Adjust to content
    };

    const reversedMessages = [...messages].reverse();

  return (
    <Box
      className="chat-box"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: {
          xs: '100%', // 100% for mobile screens
          sm: '100%', // 90% for tablets
          lg: '100%', // 80% for large screens
        },
        height: {
          xs: 'calc(100vh - 0px)', // Adjusted height for small screens
          lg: '100vh', // Max height for large screens
        },
        maxHeight: { lg: '100vh' }, // Leave margin for aesthetics on large screens
        margin: { lg: '0 auto' }, // Center the chat box on large screens
        overflow: 'hidden', // Prevent scrolling within the box
        boxSizing: 'border-box', // Include padding in height
        padding: { xs: '0', sm: '0 30px 0 30px', lg: '0 30px 0 30px' }, // Padding for smaller screens
      }}
    >
      <Box
        className="chat-header"
        sx={{
          position: {
            xs: 'fixed', // Fixed position for small screens
            sm: 'relative', // Default position for medium and larger screens
          },
          backgroundColor: '#333',
          top: 0, // Aligns it to the top of the viewport
          width: {
            xs: '100%',
            sm: '100%',
            lg: '100%',
          }, // Ensures it spans the full width
          zIndex: 2, // Keeps it above other content
          display: 'flex', // Flexbox layout
          justifyContent: {
            xs: 'space-around',
            sm: 'space-between', // Default position for medium and larger screens
          },
          alignItems: 'center', // Align items vertically
          padding: {
            xs: '5px', // Small screens
            sm: '10px', // Medium screens
            lg: '5px', // Large screens
          },
          borderBottom: {
            xs: '1px solid #ccc', // Thin border for smaller screens
            lg: '2px solid #ccc', // Thicker border for larger screens
          },
          flexDirection: {
            xs: 'row', // Items aligned horizontally on smaller screens
            sm: 'row', // Horizontal alignment remains on medium screens
            lg: 'row', // Horizontal alignment on larger screens
          },
          textAlign: {
            xs: 'center', // Centered text alignment on smaller screens
            sm: 'left',   // Default for medium and larger screens
          },
        }}      
      >
        <SidebarToggle 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: {
              xs: 'row', // Stack items vertically on small screens
              sm: 'row', // Keep them horizontal for medium and larger screens
            },
            textAlign: { xs: 'center', sm: 'left' }, // Center text for small screens
          }}
        >
          <Avatar
            ref={avatarRef}
            className="chatroom-icon"
            sx={{
              marginRight: 2, // Space between the avatar and address
            }}
          />
          <Box>
            <Typography
              sx={{
                fontWeight: 'bold', // Matches the `.chat-address` font-weight
                margin: 0, // No margin for the typography
                textAlign: 'left',
              }}
            >
              {chatNickname 
                ? chatNickname 
                : chatAddress.length > 10
                  ? `${chatAddress.slice(0, 6)}...${chatAddress.slice(-4)}`
                  : chatAddress}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: '12px', // Matches `.status` font-size
                color: '#ccc', // Matches `.status` color
              }}
            >
              {isAddressBlocked ? 'Address is Blocked' : `${chatAddress.length > 10
                ? `${chatAddress.slice(0, 6)}...${chatAddress.slice(-4)}`
                : chatAddress}`}
            </Typography>
          </Box>
        </Box>
        <ChatOptionsMenu
          account={account}
          chatAddress={chatAddress}
          blockedAddresses={blockedAddresses}
          setBlockedAddresses={setBlockedAddresses}
          gun={gun}
          deleteChat={deleteChat}
          handleWalletInfo={handleWalletInfo}
          toggleBlockedModal={toggleBlockedModal}
          navigate={navigate}
          showSnackBar={showSnackBar}
        />
      </Box>
      <Box
        className="chat-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1, // Takes remaining space in the parent container
          overflowY: 'auto', // Enables vertical scrolling
          padding: 0, // No extra padding
          marginTop: {
            xs: '40px', // Height of the fixed header on mobile
            sm: '20px', // Medium screens
            lg: '0px', // Large screens
          },
          marginBottom: {
            xs: '40px', // Height of the fixed footer on mobile
            sm: '20px', // Medium screens
            lg: '0px', // Large screens
          },
          height: {
            xs: 'calc(100vh - 110px)', // Dynamically adjust height for mobile (header + footer height)
            sm: 'auto', // Default height for medium and larger screens
          },
        }}          
      >
        <Box
          className="chat-body" 
          ref={chatBodyRef}
          sx={{
            flex: 1, // Takes remaining height in the container
            overflowY: 'auto', // Enables vertical scrolling
            maxHeight: {
              xs: 'calc(100vh - 110px)', // For smaller screens
              sm: 'calc(100vh - 150px)', // For medium and larger screens
            },
            padding: {
              xs: '0 15px 0 15px', // Small screens
              sm: '0 15px 0 15px', // Medium screens
              lg: '0 15px 0 15px', // Large screens
            },
            paddingTop: {
              xs: '50px', // Add extra padding to account for the footer height
              sm: '20px', // Medium screens
              lg: '15px', // Large screens
            },  
            paddingBottom: {
              xs: '50px', // Add extra padding to account for the footer height
              sm: '20px', // Medium screens
              lg: '15px', // Large screens
            },        
            display: 'flex', // Flexbox layout
            flexDirection: 'column-reverse', // Reverse stacking for chat messages
            gap: {
              xs: '10px', // Small screens
              lg: '15px', // Large screens
            },
          }}
        >
          {reversedMessages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender === account ? 'sent-wrapper' : 'received-wrapper'}`}>
              <div
                className="message-avatar"
                ref={(el) => {
                  if (el) generateJazzicon(msg.sender, el, 20); // Generate avatar for each sender/receiver
                }}
              />
              <div className={`message ${msg.sender === account ? 'sent' : 'received'}`}>
                <p>{msg.content}</p>
                <small>{new Date(msg.timestamp).toLocaleString()}</small>              
              </div>
            </div>
          ))}
        </Box>
      </Box>
      <Box 
        className="chat-footer"
        sx={{
          position: {
            xs: 'fixed', // Fix the footer at the bottom of the screen for small screens
            sm: 'relative', // Default position for medium and larger screens
          },
          bottom: 0, // Align it to the bottom of the viewport
          width: '100%', // Full width of the screen
          zIndex: 2, // Ensures it's above other content
          backgroundColor: '#333', // Footer background color
        }}
      >
        <Box
          className="chat-input-container"
          sx={{
            display: 'flex', // Flex layout
            gap: {
              xs: '5px', // Small screens
              sm: '10px', // Medium screens
              lg: '15px', // Large screens
            },
            padding: {
              xs: '10px', // Default padding for smaller screens
              lg: '15px', // Larger padding for large screens
            },
            alignItems: {
              xs: 'stretch', // Stretch items for smaller screens
              sm: 'center', // Align center for larger screens
            },
            flexDirection: {
              xs: 'row', // Horizontal alignment for all screen sizes
            },
            borderTop: '1px solid #ccc', // Separator from chat body
            backgroundColor: '#333', // Background color for contrast
            width: '100%', // Full width
            boxSizing: 'border-box', // Include padding in width calculation
            position: 'relative', // Avoid unintended overlaps
            zIndex: 1, // Ensure it is above other content
          }}
        > 
          <Button 
            variant="outlined" 
            className="emoji-icon" 
            onClick={isAddressBlocked ? null : toggleEmojiPicker}                               
          >
            <FaSmile />
          </Button>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <emoji-picker ref={emojiPickerRef}></emoji-picker>
            </div>
          )}
          <TextField
            //className="chat-input"
            id="outlined-multiline-static"
            label="Your Message Goes in Here"
            multiline
            fullWidth
            maxRows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight(e);
            }}      
            onKeyDown={(e) => handleKeyDown(e)}
            disabled={isAddressBlocked}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when focused
                },
              },
              '& .MuiInputBase-input': {
                color: 'white', // Text color
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Default label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Label color when focused
              },
            }}
          />
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            onClick={handleSubmit}
            disabled={isAddressBlocked}
          >
            <FaPaperPlane/>
          </LoadingButton>
        </Box>
      </Box>
      {isWalletInfoModalOpen && (
        <div className="wallet-modal-overlay" onClick={() => setIsWalletInfoModalOpen(false)}>
          <div className="wallet-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-info-modal" onClick={(e) => e.stopPropagation()}>
              <div className="wallet-modal-header">
                <h2>{`${chatAddress.slice(0, 6)}...${chatAddress.slice(-4)}`} Profile</h2>
                <button className="wallet-close-button" onClick={closeinfoWalletModal}>×</button>
              </div>
              <div className="wallet-details wallet-addr-details">
                <p><strong>Address</strong></p>
                <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
                  <Link 
                    href={`https://bscscan.com/address/${chatAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    <Chip
                      icon={<FaExternalLinkAlt />}
                      label={chatAddress}
                      size="medium"
                      variant="outlined"
                      sx={{
                        backgroundColor: 'transparent !important',
                        color: '#ffffff',
                        fontSize: { xs: '0.7rem', sm: '0.9rem' }, // Adjust font size for the label
                        height: { xs: 24, sm: 32 }, // Adjust height for smaller chips on mobile              
                        '& .MuiChip-icon': {
                          fontSize: { xs: '0.8rem', sm: '1rem' }, // Adjust icon size
                          color: '#bd3ef4', // Change the icon color here
                        },
                        '& .MuiChip-label': {
                          padding: { xs: '0 8px', sm: '0 12px' }, // Adjust padding for smaller chips
                        },
                      }}                
                    />
                  </Link>
                </Stack>
              </div>
              <div className="wallet-stats">
                <div className="wallet-balance">
                  <p>BNB Balance:</p>
                  <span className="coins-data">
                    <Chip
                      icon={<RiBnbLine className="bnb-coin-logo" />} 
                      label={formatNumber(balance)}
                      size="medium"
                      variant="outlined"
                      sx={{
                        backgroundColor: 'transparent !important',
                        color: '#ffffff',
                      }}                
                    />
                  </span>
                </div>
                <div className="wallet-txns">
                  <p>TCA Balance:</p>
                  <span className="coins-data">
                  <Chip
                      avatar={<Avatar alt="TCA Coin" src={TCACoin} />} 
                      label={formatNumber(tcaBalance)}
                      size="medium"
                      variant="outlined"
                      sx={{
                        backgroundColor: 'transparent !important',
                        color: '#ffffff',
                      }}                
                    />
                  </span>
                </div>
              </div>
              <div className="qr-code-section">
                <p><strong>Your QR Code address</strong></p>
                <p>(Safe to share with your contacts)</p>
                <QRCodeCanvas value={chatAddress} size={128} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default ChatPage;
