import gun from './gunSetup';
import 'gun/lib/unset.js';
import 'gun/lib/yson.js';

export const markMessagesAsRead = (receiver, chatAddress) => {
  if (!receiver || !chatAddress) {
    console.error("[DEBUG] Receiver or chat address is missing.");
    return;
  }

  const messageNode = gun.get(`chats/${receiver}/messages/${chatAddress}`);

  messageNode.map().once((message, id) => {
    if (!message) {
      console.log(`[DEBUG] Skipping null or undefined message: ${id}`);
      return;
    }

    if (message.status !== 'unread') {
      console.log(`[DEBUG] Skipping message not marked as unread: ${id}`);
      return;
    }

    console.log(`[DEBUG] Marking message ${id} as read for receiver: ${receiver}`);

    gun.get(`chats/${receiver}/messages/${chatAddress}`).get(id).get('status').put('read', (ack) => {
      if (ack.err) {
        console.error(`[DEBUG] Failed to mark message ${id} as read:`, ack.err);
      } else {
        console.log(`[DEBUG] Successfully marked message ${id} as read.`);
      }
    });
  });
};

export const hasUnreadMessages = (account, chatAddress) => {
  if (!account || !chatAddress) {
    console.error("[DEBUG] Missing account or chat address.");
    return false;
  }

  console.log(`[DEBUG] Setting up listener for unread messages for chatAddress: ${chatAddress}`);

  let unreadExists = false;

  const receiverNode = gun.get(`chats/${account}/messages/${chatAddress}`);
  receiverNode.map().once((message, id) => {
    if (message && message.status === 'unread') {
      console.log(`[DEBUG] Found unread message in receiverNode. ID: ${id}`);
      unreadExists = true;
    }
  });

  return unreadExists;
};

// Fetch chats linked to the user's account
export const fetchChats = (account, setChats) => {
    if (!account) return;

    console.log("Fetching chats for account:", account.slice(-4));

    const loadedChats = new Set();
    const chatNode = gun.get(account).get('chats');
    const messageNode = gun.get(`chats/${account}/messages`);

    chatNode.map().once((data, key) => {
        if (!data) {
            console.warn(`Empty or invalid data for chat key: ${key}`);
            return;
        }

        // If the data is stored as a nested object, access its value
        const chatAddress = data[''] || data; // Adjust if structure differs
        if (chatAddress) {
            console.log("Resolved chat address:", data.slice(-4));
            loadedChats.add(chatAddress);
            setChats(Array.from(loadedChats));
        } else {
            console.warn(`No valid chat address found in key: ${key}`);
        }
    });

    // Monitor incoming messages to dynamically add new senders
    messageNode.map().on((message, id) => {
      if (!message || !message.sender) return;

      const senderAddress = message.sender;
      if (!loadedChats.has(senderAddress)) {
          console.log("New sender detected:", senderAddress.slice(-4));
          loadedChats.add(senderAddress);
          setChats(Array.from(loadedChats));
      }
    });

    // Cleanup function to detach listeners
    return () => {
        console.log("Cleaning up chat subscriptions for account:", account.slice(-4));
        chatNode.off();
        messageNode.off();
    };
}; 

// Fetch settings for the user's account
export const fetchSettings = async (account, setSettings) => {
    if (!account) return;
  
    console.log("Fetching settings for account:", account.slice(-4));
  
    try {
      const data = await new Promise((resolve) => {
        gun.get(account).once((fetchedData) => resolve(fetchedData || {}));
      });
  
      console.log("Fetched settings data:", data);

        const blockedAddressesArray = [];
        const blockedAddressesNode = gun.get(account).get('blockedAddresses');

        blockedAddressesNode.map().once((data, key) => {
            if (data === true) {
              blockedAddressesArray.push(key);
            }
          });          

      setSettings({
        notificationsEnabled: data.notificationsEnabled || false,
        soundAlertsEnabled: data.soundAlertsEnabled || false,
        desktopNotificationsEnabled: data.desktopNotificationsEnabled || false,
        blockedAddresses: blockedAddressesArray,

      });
    } catch (error) {
      console.error("Error fetching settings from Gun:", error);
    }
};  

// Save user settings
export const handleSaveSettings = (account, settings) => {
    if (!account) {
      console.error("No account provided for saving settings.");
      return;
    }
  
    console.log("Saving settings:", settings);
  
    // Transform blockedAddresses into an object for Gun.js compatibility
    const transformedSettings = {
      ...settings,
      blockedAddresses: settings.blockedAddresses
        ? settings.blockedAddresses.reduce((acc, address) => {
            acc[address] = true; // Store each address as a key with a value of `true`
            return acc;
          }, {})
        : undefined, // Retain compatibility if blockedAddresses is undefined
    };
  
    gun.get(account).put(transformedSettings, (ack) => {
      if (ack.err) {
        console.error("Failed to save settings:", ack.err);
      } else {
        console.log("Settings saved successfully:", transformedSettings);
      }
    });
};  

// Block a specific address
export const handleBlockAddress = (account, address, setBlockedAddresses) => {
    const trimmedAddress = address;
    if (!trimmedAddress || trimmedAddress === account) {
      console.warn("Invalid address to block:", address);
      return;
    }
  
    console.log(`Saving blocked address:`, trimmedAddress);
  
    // Save the address as a key in /blockedAddresses
    gun.get(account).get('blockedAddresses').get(trimmedAddress).put(true, (ack) => {
      if (ack.err) {
        console.error("Failed to block address:", ack.err);
      } else {
        console.log("Blocked address saved successfully:", trimmedAddress);
        setBlockedAddresses((prev) =>
          Array.isArray(prev) ? [...prev, trimmedAddress] : [trimmedAddress]
        );
      }
    });
};    

// Unblock a specific address
export const handleUnblockAddress = (account, address, setBlockedAddresses) => {
    if (!account || !address) {
      console.error("Invalid account or address provided for unblocking.");
      return;
    }
  
    console.log(`Attempting to unblock address: ${address}`);
  
    // Remove the address from the database
    gun.get(account).get('blockedAddresses').get(address).put(null, (ack) => {
      if (ack.err) {
        console.error("Failed to unblock address:", ack.err);
      } else {
        console.log("Address successfully unblocked:", address);
  
        // Update the local state only after successful database deletion
        setBlockedAddresses((prev) =>
          prev.filter((blockedAddress) => blockedAddress !== address)
        );
      }
    });
};  

// Start a new chat
export const handleStartChat = (account, chatAddress, setChats, setSearchParams, setShowModal) => {
  const trimmedAddress = chatAddress;

  if (account === chatAddress)
  {
    alert("You can not Speak to yourself:", chatAddress);
    return;
  }

  if (!trimmedAddress || trimmedAddress === account) {
    console.warn("Invalid chat address:", chatAddress);
    return;
  }

  // Step 1: Add the chat to the sender's `chats` node
  const senderChatsNode = gun.get(account).get('chats');
  senderChatsNode.set(trimmedAddress, (senderAck) => {
    if (senderAck.err) {
      console.error("Failed to add chat for sender:", senderAck.err);
    } else {
      console.log(`Chat added for sender: ${account} with ${trimmedAddress}`);

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
export const handleDeleteChat = (account, chatAddress, setChats) => {
  const userChatsNode = gun.get(account).get('chats');
  const messagesBasePath = `chats/${chatAddress}/messages`;

  // Step 1: Find the chat reference in the user's chats
  userChatsNode.map().once((data, chatKey) => {
    if (data === chatAddress) {
      console.log(`Found chat to delete: Address = ${chatAddress}, Key = ${chatKey}`);

      // Step 2: Delete all messages under the messages node
      const messagesNode = gun.get(messagesBasePath);
      messagesNode.map().once((_, messageKey) => {
        if (!messageKey) return; // Skip null or invalid keys

        console.log(`Deleting message: Key = ${messageKey}`);
        messagesNode.get(messageKey).put(null, (msgAck) => {
          if (msgAck.err) {
            console.error(`Failed to delete message with Key = ${messageKey}:`, msgAck.err);
          } else {
            console.log(`Message deleted: Key = ${messageKey}`);
          }
        });
      });

      // Step 3: Delete the chat reference from the user's chats node
      setTimeout(() => {
        console.log(`Deleting chat metadata for Key = ${chatKey}`);
        userChatsNode.get(chatKey).put(null, (ack) => {
          if (ack.err) {
            console.error(`Failed to delete chat metadata with Key = ${chatKey}:`, ack.err);
          } else {
            console.log(`Chat metadata deleted: Key = ${chatKey}`);

            // Step 4: Update the UI state
            setChats((prevChats) => prevChats.filter((chat) => chat !== chatAddress));
            console.log(`Chat removed from UI for Address = ${chatAddress}`);
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
          console.error(`Failed to delete node (${key}):`, ack.err);
        } else {
          console.log(`Node (${key}) deleted successfully.`);
        }
      });
    });

    // Finally, delete the parent node itself
    node.put(null, (ack) => {
      if (ack.err) {
        console.error("Failed to delete parent node:", ack.err);
      } else {
        console.log("Parent node deleted successfully.");
      }
    });
  };

  const chatsNode = gun.get(account).get('chats');

  // Recursively delete all data under 'chats'
  recursiveDelete(chatsNode);

  // Clear local state
  setChats([]);
  console.log("All chat history and metadata cleared.");
};

// Fetch the nickname
export const fetchNickname = (account, setNickname) => {
  if (!account) {
    console.warn("Account is required to fetch nickname.");
    return;
  }

  console.log("Fetching nickname for account:", account.slice(-4));

  const nicknameNode = gun.get(account).get('nickname');

  nicknameNode.once(
    (data) => {
      if (!data || !data.nickname) {
        const defaultNickname = account.slice(-5);
        console.log(`[DEBUG] Saving default nickname: ${defaultNickname}`);

        // Save default nickname and mapping
        gun.get(account).put({ nickname: defaultNickname }, (ack) => {
          if (ack.err) {
            console.error(`[ERROR] Failed to save default nickname for account: ${account}`, ack.err);
            return;
          }

          console.log(`[DEBUG] Default nickname "${defaultNickname}" saved for account: ${account}`);
          setNickname(defaultNickname);

          saveNicknameToGun(account, defaultNickname, (ack) => {
            if (ack.err) {
              console.error(`[ERROR] Failed to save mapping for nickname: "${defaultNickname}"`, ack.err);
            } else {
              console.log(`[DEBUG] Mapping saved for nickname: "${defaultNickname}"`);
            }
          });
        });
      } else {
        const nickname = data[''] || data;
        console.log(`Resolved nickname for account ${account.slice(-4)}:`, nickname);
        setNickname(nickname);
      }
    },
    { err: (err) => console.error(`[ERROR] Failed to fetch nickname for account: ${account}`, err) }
  );

  return () => {
    console.log("Cleaning up nickname subscription for account:", account.slice(-4));
    nicknameNode.off();
  };
};

export const saveNicknameToGun = (account, nickname, callback) => {
  if (!account || !nickname) {
    console.warn("Both account and nickname are required.");
    callback({ err: "Invalid parameters" });
    return;
  }

  console.log(`[DEBUG] Saving nickname: "${nickname}" for account: "${account}"`);

  // Save nickname under the account node
  gun.get(account).put({ nickname }, (ack) => {
    if (ack.err) {
      console.error(`[ERROR] Failed to save nickname for account: "${account}"`, ack.err);
      callback(ack);
      return;
    }

    console.log(`[DEBUG] Nickname "${nickname}" saved for account: "${account}"`);

    // Save the reverse mapping
    saveNicknameMapping(nickname, account, (mappingAck) => { // Corrected order here
      if (mappingAck.err) {
        console.error(`[ERROR] Failed to save reverse mapping: "${nickname}" -> "${account}"`, mappingAck.err);
      } else {
        console.log(`[DEBUG] Reverse mapping updated: "${nickname}" -> "${account}"`);
      }

      callback(mappingAck); // Notify about the reverse mapping
    });
  });
};

export const saveNicknameMapping = (nickname, account, callback) => {
  if (!nickname || !account) {
    console.warn("Both nickname and account are required to save mapping.");
    callback({ err: "Invalid parameters" });
    return;
  }

  console.log(`[DEBUG] Saving nickname mapping: "${nickname}" -> "${account}"`);

  const nicknamesNode = gun.get('findWallet');

  // Create the mapping data
  const mappingData = {
    value: nickname,
    wallet: account,
  };

  // Log the structure before saving
  console.log("[DEBUG] Mapping data to save:", mappingData);

  // Save nickname mapping under the new structure
  nicknamesNode.get(nickname).put(mappingData, (ack) => {
    if (ack.err) {
      console.error(`[ERROR] Failed to save mapping for nickname: "${nickname}"`, ack.err);
      callback({ err: ack.err });
    } else {
      console.log(`[DEBUG] Nickname mapping saved successfully:`, mappingData);
      callback({ success: true });
    }
  });
};

export const fetchWalletFromNickname = (nickname, callback) => {
  if (!nickname) {
    console.warn("Nickname is required to fetch wallet address.");
    callback({ err: "Invalid parameters" });
    return;
  }

  console.log(`[DEBUG] Fetching wallet for nickname: "${nickname}"`);

  const nicknamesNode = gun.get('findWallet');

  nicknamesNode.get(nickname).once((data) => {
    if (!data || !data.wallet) {
      console.warn(`[DEBUG] No wallet found for nickname: "${nickname}"`);
      callback({ err: "No wallet found" });
    } else {
      console.log(`[DEBUG] Wallet address for nickname "${nickname}": ${data.wallet}`);
      callback({ wallet: data.wallet });
    }
  });
};  

export const fetchNicknameFromWallet = (wallet) => {
  return new Promise((resolve, reject) => {
    if (!wallet) {
      console.warn("Wallet address is required to fetch nickname.");
      reject("Invalid parameters");
      return;
    }

    console.log(`[DEBUG] Fetching nickname for wallet: "${wallet}"`);

    const walletNode = gun.get(wallet).get('nickname');

    walletNode.once((data) => {
      if (!data) {
        console.warn(`[DEBUG] No nickname found for wallet: "${wallet}"`);
        reject("No nickname found");
      } else {
        const nickname = data[''] || data; // Handle flat or structured data
        console.log(`[DEBUG] Nickname for wallet "${wallet}": ${nickname}`);
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
          console.error('Failed to delete message:', ack.err);
        } else {
          console.log('Message deleted successfully:', messageId);
        }
      });
  };
  