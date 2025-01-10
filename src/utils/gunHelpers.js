import gun from './gunSetup';
import 'gun/lib/unset.js';
import 'gun/lib/yson.js';

export const markMessagesAsRead = (receiver, chatAddress) => {
  if (!receiver || !chatAddress) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("[DEBUG] Receiver or chat address is missing.");
    }
    return;
  }

  const messageNode = gun.get(`chats/${receiver}/messages/${chatAddress}`);

  messageNode.map().once((message, id) => {
    if (!message) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Skipping null or undefined message: ${id}`);
      }
      return;
    }

    if (message.status !== 'unread') {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Skipping message not marked as unread: ${id}`);
      }
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Marking message ${id} as read for receiver: ${receiver}`);
    }

    gun.get(`chats/${receiver}/messages/${chatAddress}`).get(id).get('status').put('read', (ack) => {
      if (ack.err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[DEBUG] Failed to mark message ${id} as read:`, ack.err);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Successfully marked message ${id} as read.`);
        }
      }
    });
  });
};

export const hasUnreadMessages = (account, chatAddress) => {
  if (!account || !chatAddress) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("[DEBUG] Missing account or chat address.");
    }
    return false;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Setting up listener for unread messages for chatAddress: ${chatAddress}`);
  }

  let unreadExists = false;

  const receiverNode = gun.get(`chats/${account}/messages/${chatAddress}`);
  receiverNode.map().once((message, id) => {
    if (message && message.status === 'unread') {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Found unread message in receiverNode. ID: ${id}`);
      }
      unreadExists = true;
    }
  });

  return unreadExists;
};

// Fetch chats linked to the user's account
export const fetchChats = (account, setChats) => {
    if (!account) return;

    if (process.env.NODE_ENV !== 'production') {
      console.log("Fetching chats for account:", account.slice(-4));
    }

    const loadedChats = new Set();
    const chatNode = gun.get(account).get('chats');
    const messageNode = gun.get(`chats/${account}/messages`);

    chatNode.map().once((data, key) => {
        if (!data) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Empty or invalid data for chat key: ${key}`);
          }
            return;
        }

        // If the data is stored as a nested object, access its value
        const chatAddress = data[''] || data; // Adjust if structure differs
        if (chatAddress) {
          if (process.env.NODE_ENV !== 'production') {
            console.log("Resolved chat address:", data.slice(-4));
          }
            loadedChats.add(chatAddress);
            setChats(Array.from(loadedChats));
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`No valid chat address found in key: ${key}`);
          }
        }
    });

    // Monitor incoming messages to dynamically add new senders
    messageNode.map().on((message, id) => {
      if (!message || !message.sender) return;

      const senderAddress = message.sender;
      if (!loadedChats.has(senderAddress)) {
        if (process.env.NODE_ENV !== 'production') {
          console.log("New sender detected:", senderAddress.slice(-4));
        }
          loadedChats.add(senderAddress);
          setChats(Array.from(loadedChats));
      }
    });

    // Cleanup function to detach listeners
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Cleaning up chat subscriptions for account:", account.slice(-4));
      }
        chatNode.off();
        messageNode.off();
    };
}; 

// Fetch settings for the user's account
export const fetchSettings = async (account, setSettings) => {
    if (!account) return;
      if (process.env.NODE_ENV !== 'production') {
        console.log("Fetching settings for account:", account.slice(-4));
      }
  
    try {
      const data = await new Promise((resolve) => {
        gun.get(account).once((fetchedData) => resolve(fetchedData || {}));
      });
  
      if (process.env.NODE_ENV !== 'production') {
        console.log("Fetched settings data:", data);
      }

        const blockedAddressesArray = [];
        const blockedAddressesNode = gun.get(account).get('blockedAddresses');

        blockedAddressesNode.map().once((data, key) => {
            if (data === true) {
              blockedAddressesArray.push(key);
            }
          });          

      setSettings({
        autoLockEnabled: data.autoLockEnabled || false,
        soundAlertsEnabled: data.soundAlertsEnabled || false,
        desktopNotificationsEnabled: data.desktopNotificationsEnabled || false,
        blockedAddresses: blockedAddressesArray,

      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Error fetching settings from Gun:", error);
      }
    }
};  

// Save user settings
export const handleSaveSettings = (account, settings, showSnackBar) => {
  if (!account) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("No account provided for saving settings.");
    }
    showSnackBar && showSnackBar('No account provided', 'error');
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log("Saving settings:", settings);
  }

  // Separate blockedAddresses from other settings
  const { blockedAddresses, ...otherSettings } = settings;

    // Optimistic snackbar
    showSnackBar && showSnackBar('Saving settings...', 'info');

  // Update other settings first
  gun.get(account).put(otherSettings, (ack) => {
    if (ack.err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Failed to save other settings:", ack.err);
      }
      showSnackBar && showSnackBar('Failed to save settings', 'error');
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Other settings saved successfully:", otherSettings);
      }
      showSnackBar && showSnackBar('Settings saved successfully', 'success');
    }
  });

  // Handle blockedAddresses separately
  const transformedBlockedAddresses =
    Array.isArray(blockedAddresses) && blockedAddresses.length > 0
      ? blockedAddresses.reduce((acc, address) => {
          acc[address] = true;
          return acc;
        }, {})
      : {}; // Set to an empty object if no blocked addresses

  gun.get(account).get('blockedAddresses').put(transformedBlockedAddresses, (ack) => {
    if (ack.err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Failed to save blocked addresses:", ack.err);
      }
      showSnackBar && showSnackBar('Failed to save blocked addresses', 'error');
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Blocked addresses saved successfully:", transformedBlockedAddresses);
      }
      showSnackBar && showSnackBar('Blocked addresses saved successfully', 'success');
    }
  });
};

// Block a specific address
export const handleBlockAddress = (account, address, setBlockedAddresses, showSnackBar) => {
  const trimmedAddress = address.trim();
  if (!trimmedAddress || trimmedAddress === account) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Invalid address to block:", address);
    }
    showSnackBar && showSnackBar('Invalid address', 'error');
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Saving blocked address:`, trimmedAddress);
  }

  // Save the address as a key in /blockedAddresses
  gun.get(account).get('blockedAddresses').get(trimmedAddress).put(true, (ack) => {
    if (ack.err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Failed to block address:", ack.err);
      }
      showSnackBar && showSnackBar('Failed to block address', 'error');
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Blocked address saved successfully:", trimmedAddress);
      }
      showSnackBar && showSnackBar(`Address ${trimmedAddress.slice(-5)} has been Blocked`, 'success');

      // Fetch the updated blocked addresses to avoid duplicates
      gun.get(account).get('blockedAddresses').once((data) => {
        if (data) {
          const updatedAddresses = Object.keys(data).filter((key) => data[key] === true);
          setBlockedAddresses(updatedAddresses);
        }
      });
    }
  });
};

// Unblock a specific address
export const handleUnblockAddress = (account, address, setBlockedAddresses, showSnackBar) => {
    if (!account || !address) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Invalid account or address provided for unblocking.");
      }
      showSnackBar && showSnackBar('Invalid account or address provided for unblocking','error');
      return;
    }
  
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Attempting to unblock address: ${address}`);
    }
  
    // Remove the address from the database
    gun.get(account).get('blockedAddresses').get(address).put(null, (ack) => {
      if (ack.err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error("Failed to unblock address:", ack.err);
        }
        showSnackBar && showSnackBar('Failed to unblock address','error');
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log("Address successfully unblocked:", address);
        }
        showSnackBar && showSnackBar(`Address ${address.slice(-5)} has been Unblocked`,'success');

        // Update the local state only after successful database deletion
        setBlockedAddresses((prev) =>
          prev.filter((blockedAddress) => blockedAddress !== address)
        );
      }
    });
};  

export const generatePinFromAddress = (account) => {
  if (account.length !== 42 || !account.startsWith("0x")) {
    throw new Error("Invalid Ethereum address");
  }
  return `${account[4]}${account[13]}${account[26]}${account[39]}`.toUpperCase();
};

// Start a new chat
export const handleStartChat = (account, chatAddress, setChats, setSearchParams, setShowModal, showSnackBar) => {
  const trimmedAddress = chatAddress;

  if (account === chatAddress)
  {
    showSnackBar && showSnackBar("You can not Speak to yourself", 'warning');
    return;
  }

  if (!trimmedAddress || trimmedAddress === account) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Invalid chat address:", chatAddress);
    }
    showSnackBar && showSnackBar("Invalid chat address", 'warning');
    return;
  }

  // Step 1: Add the chat to the sender's `chats` node
  const senderChatsNode = gun.get(account).get('chats');
  senderChatsNode.set(trimmedAddress, (senderAck) => {
    if (senderAck.err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Failed to add chat for sender:", senderAck.err);
      }
      showSnackBar && showSnackBar("Failed to Create a chat", 'error');
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Chat added for sender: ${account} with ${trimmedAddress}`);
      }
      showSnackBar && showSnackBar(`Chat created for ${trimmedAddress.slice(-5)}`, 'success');
      // Update the UI for the sender
      setChats((prev) => [...new Set([...prev, trimmedAddress])]);
      setSearchParams({ chatwith: trimmedAddress });
      setShowModal(false);
    }
  });
};

// Handle chat item click
export const handleChatItemClick = (chatAddress, setSearchParams) => {
  setSearchParams({ chatwith: chatAddress });
};

// Fully delete a chat, its metadata, and associated keys
export const handleDeleteChat = (account, chatAddress, setChats, showSnackBar) => {
  const userChatsNode = gun.get(account).get('chats');
  const messagesBasePath = `chats/${chatAddress}/messages`;

  // Step 1: Find the chat reference in the user's chats
  userChatsNode.map().once((data, chatKey) => {
    if (data === chatAddress) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Found chat to delete: Address = ${chatAddress}, Key = ${chatKey}`);
      }
      // Step 2: Delete all messages under the messages node
      const messagesNode = gun.get(messagesBasePath);
      messagesNode.map().once((_, messageKey) => {
        if (!messageKey) return; // Skip null or invalid keys
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Deleting message: Key = ${messageKey}`);
          }
        messagesNode.get(messageKey).put(null, (msgAck) => {
          if (msgAck.err) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Failed to delete message with Key = ${messageKey}:`, msgAck.err);
            }
            showSnackBar && showSnackBar('Failed to hide','error');
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Message deleted: Key = ${messageKey}`);
            }
            showSnackBar && showSnackBar('Message has been hidden','success');
          }
        });
      });

      // Step 3: Delete the chat reference from the user's chats node
      setTimeout(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Deleting chat metadata for Key = ${chatKey}`);
        }
        userChatsNode.get(chatKey).put(null, (ack) => {
          if (ack.err) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Failed to delete chat metadata with Key = ${chatKey}:`, ack.err);
            }
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Chat metadata deleted: Key = ${chatKey}`);
            }
            // Step 4: Update the UI state
            setChats((prevChats) => prevChats.filter((chat) => chat !== chatAddress));
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Chat removed from UI for Address = ${chatAddress}`);
            }
          }
        });
      }, 500); // Delay to ensure messages are deleted first
    }
  });
};

// Clear all chat history and associated metadata
export const handleClearChatHistory = (account, setChats) => {
  const recursiveDelete = (node) => {
    node.map().once((data, key) => {
      const childNode = node.get(key);

      // Recursively delete child nodes
      childNode.map().once((childData, childKey) => {
        recursiveDelete(childNode.get(childKey));
      });

      // Delete the current node
      childNode.put(null, (ack) => {
        if (ack.err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error(`Failed to delete node (${key}):`, ack.err);
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Node (${key}) deleted successfully.`);
          }
        }
      });
    });

    // Finally, delete the parent node itself
    node.put(null, (ack) => {
      if (ack.err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error("Failed to delete parent node:", ack.err);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log("Parent node deleted successfully.");
        }
      }
    });
  };

  const chatsNode = gun.get(account).get('chats');

  // Recursively delete all data under 'chats'
  recursiveDelete(chatsNode);

  // Clear local state
  setChats([]);
  if (process.env.NODE_ENV !== 'production') {
    console.log("All chat history and metadata cleared.");
  }
};

// Fetch the nickname
export const fetchNickname = (account, setNickname) => {
  if (!account) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[WARN] Account is required to fetch nickname.");
    }
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Fetching nickname for account: ${account.slice(-4)}`);
  }

  const nicknameNode = gun.get(account).get("nickname");

  nicknameNode.once(
    (data) => {
      if (data) {
        // Data is the nickname directly
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Nickname fetched: "${data}" for account: ${account}`);
        }
        setNickname(data);

        // Verify the reverse mapping
        verifyReverseMapping(account, data);
      } else {
        // No nickname exists, assign and save the default nickname
        const defaultNickname = account.slice(-5);
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[WARN] No nickname found. Assigning default nickname: "${defaultNickname}"`);
        }
        gun.get(account).put({ nickname: defaultNickname }, (ack) => {
          if (ack.err) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`[ERROR] Failed to save default nickname for account: ${account}`, ack.err);
            }
            return;
          }

          if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEBUG] Default nickname "${defaultNickname}" saved for account: ${account}`);
          }
          setNickname(defaultNickname);

          // Save the reverse mapping
          saveNicknameToGun(account, defaultNickname, (mappingAck) => {
            if (mappingAck.err) {
              if (process.env.NODE_ENV !== 'production') {
                console.error(
                  `[ERROR] Failed to save reverse mapping for default nickname: "${defaultNickname}"`,
                  mappingAck.err
                );
              }
            } else {
              if (process.env.NODE_ENV !== 'production') {
                console.log(`[DEBUG] Reverse mapping saved for default nickname: "${defaultNickname}"`);
              }
            }
          });
        });
      }
    },
    { 
      err: (err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[ERROR] Failed to fetch nickname for account: ${account}`, err);
        }
      }
    }    
  );

  // Cleanup function to detach listeners
  return () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Cleaning up nickname subscription for account: ${account.slice(-4)}`);
    }
    nicknameNode.off();
  };
};

// Verify reverse mapping and nickname
const verifyReverseMapping = (account, nickname) => {
  const reverseNode = gun.get("findWallet").get(nickname);

  reverseNode.once((data) => {
    if (!data || data.wallet !== account) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[WARN] Reverse mapping missing or incorrect for nickname: "${nickname}". Repairing...`);
      }

      saveNicknameMapping(nickname, account, (ack) => {
        if (ack.err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error(`[ERROR] Failed to repair reverse mapping: "${nickname}" -> "${account}"`, ack.err);
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEBUG] Reverse mapping repaired: "${nickname}" -> "${account}"`);
          }
        }
      });
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Reverse mapping verified for nickname: "${nickname}"`);
      }
    }
  });
};

export const hasUserSavedNickname = async (account) => {
  if (!account) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[WARN] Account is required to check if the user has saved a nickname.");
    }
    return true; // Default to disabling input if no account is provided
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Checking if user has already saved a custom nickname for account: "${account}"`);
  }

  const accountNode = gun.get(account);

  return new Promise((resolve) => {
    accountNode.get('nickname').once((data) => {
      const currentNickname = data;
      const defaultNickname = account.slice(-5);

      if (currentNickname && currentNickname !== defaultNickname) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("[WARN] User has already saved a custom nickname.");
        }
        resolve(true); // User has already saved a nickname
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log("[DEBUG] User has not saved a custom nickname yet.");
        }
        resolve(false); // User has not saved a nickname
      }
    });
  });
};

export const isNicknameAvailable = async (nickname) => {
  if (!nickname) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[WARN] Nickname is required to check availability.");
    }
    return false; // Default to not available if no nickname is provided
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Checking nickname availability for: "${nickname}"`);
  }

  const nicknamesNode = gun.get('findWallet');

  return new Promise((resolve) => {
    nicknamesNode.get(nickname).once((data) => {
      if (data && data.wallet) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[WARN] Nickname "${nickname}" is already taken.`);
        }
        resolve(false); // Nickname is not available
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Nickname "${nickname}" is available.`);
        }
        resolve(true); // Nickname is available
      }
    });
  });
};

export const saveNicknameToGun = (account, nickname, callback) => {
  if (!account || !nickname) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Both account and nickname are required.");
    }
    callback({ err: "Invalid parameters" });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Saving nickname: "${nickname}" for account: "${account}"`);
  }
  // Save nickname under the account node
  gun.get(account).put({ nickname }, (ack) => {
    if (ack.err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[ERROR] Failed to save nickname for account: "${account}"`, ack.err);
      }
      callback(ack);
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Nickname "${nickname}" saved for account: "${account}"`);
    }

    // Save the reverse mapping
    saveNicknameMapping(nickname, account, (mappingAck) => { // Corrected order here
      if (mappingAck.err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[ERROR] Failed to save reverse mapping: "${nickname}" -> "${account}"`, mappingAck.err);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Reverse mapping updated: "${nickname}" -> "${account}"`);
        }
      }

      callback(mappingAck); // Notify about the reverse mapping
    });
  });
};

export const saveNicknameMapping = (nickname, account, callback) => {
  if (!nickname || !account) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Both nickname and account are required to save mapping.");
    }
    callback({ err: "Invalid parameters" });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Saving nickname mapping: "${nickname}" -> "${account}"`);
  }

  const nicknamesNode = gun.get("findWallet");

  // Create the mapping data
  const mappingData = {
    value: nickname,
    wallet: account,
  };

  nicknamesNode.get(nickname).put(mappingData, (ack) => {
    if (ack.err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[ERROR] Failed to save mapping for nickname: "${nickname}"`, ack.err);
      }
      callback({ err: ack.err });
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Nickname mapping saved successfully: "${nickname}" -> "${account}"`);
      }
      callback({ success: true });
    }
  });
};

export const fetchWalletFromNickname = (nickname, callback) => {
  if (!nickname) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Nickname is required to fetch wallet address.");
    }
    callback({ err: "Invalid parameters" });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Fetching wallet for nickname: "${nickname}"`);
  }

  const nicknamesNode = gun.get('findWallet');

  nicknamesNode.get(nickname).once((data) => {
    if (!data || !data.wallet) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[DEBUG] No wallet found for nickname: "${nickname}"`);
      }
      callback({ err: "No wallet found" });
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Wallet address for nickname "${nickname}": ${data.wallet}`);
      }
      callback({ wallet: data.wallet });
    }
  });
};  

export const fetchNicknameFromWallet = (wallet) => {
  return new Promise((resolve, reject) => {
    if (!wallet) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Wallet address is required to fetch nickname.");
      }
      reject("Invalid parameters");
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Fetching nickname for wallet: "${wallet}"`);
    }

    const walletNode = gun.get(wallet).get('nickname');

    walletNode.once((data) => {
      if (!data) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[DEBUG] No nickname found for wallet: "${wallet}"`);
        }
        reject("No nickname found");
      } else {
        const nickname = data[''] || data; // Handle flat or structured data
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEBUG] Nickname for wallet "${wallet}": ${nickname}`);
        }
        resolve(nickname);
      }
    });
  });
};
  
  export const deleteMessage = (account, chatAddress, messageId) => {
    gun.get(account)
      .get('chats')
      .get(chatAddress)
      .get('messages')
      .get(messageId)
      .put(null, (ack) => {
        if (ack.err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to delete message:', ack.err);
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Message deleted successfully:', messageId);
          }
        }
      });
  };
  