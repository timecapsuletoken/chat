import gun from './gunSetup';

export const markMessagesAsRead = (receiver, chatAddress) => {
  if (!receiver || !chatAddress) {
    console.error("[DEBUG] Receiver or chat address is missing.");
    return;
  }

  const messageNode = gun.get(`chats/${receiver}/messages`);

  messageNode.map().once((message, id) => {
    console.log("[DEBUG] Checking message:", { id, message });

    // Validate the message
    if (!message) {
      console.log(`[DEBUG] Skipping null or undefined message: ${id}`);
      return;
    }

    if (message.status !== 'unread') {
      console.log(`[DEBUG] Skipping message not marked as unread: ${id}`);
      return;
    }

    if (message.sender !== chatAddress) {
      console.log(`[DEBUG] Skipping message from a different sender: ${id}`);
      return;
    }

    console.log(`[DEBUG] Marking message ${id} as read for receiver: ${receiver}`);

    // Update only the status field
    gun.get(`chats/${receiver}/messages`).get(id).get('status').put(
      'read',
      (ack) => {
        if (ack.err) {
          console.error(`[DEBUG] Failed to mark message ${id} as read:`, ack.err);
        } else {
          console.log(`[DEBUG] Successfully marked message ${id} as read.`);
        }
      }
    );
  });
};

export const hasUnreadMessages = async (account, chatAddress) => {
  if (!account || !chatAddress) {
    console.error("[DEBUG] Missing account or chat address.");
    return false;
  }

  return new Promise((resolve) => {
    const messageNode = gun.get(`chats/${account}/messages`);
    let unreadExists = false;

    messageNode.map().once((message, id) => {
      if (message && message.status === 'unread' && message.sender === chatAddress) {
        unreadExists = true;
      }
    });

    setTimeout(() => resolve(unreadExists), 200); // Allow time for Gun.js async calls
  });
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
    const trimmedAddress = address.trim();
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
  const trimmedAddress = chatAddress.trim();

  if (!trimmedAddress || trimmedAddress === account) {
    console.warn("Invalid chat address:", chatAddress);
    return;
  }

  gun.get(account).get('chats').set(trimmedAddress, (ack) => {
    if (ack.err) {
      console.error("Failed to start chat:", ack.err);
    } else {
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
  const chatsNode = gun.get(account).get("chats");
  const messagesBasePath = `chats/0x/${account}/messages`;

  // Step 1: Traverse the chats node to find the chat key for the chat address
  chatsNode.map().once((data, chatKey) => {
    if (data === chatAddress) {
      console.log(`Found chat to delete: Address = ${chatAddress}, Key = ${chatKey}`);

      // Step 2: Delete all messages for this chatKey under the current user
      const messagesNode = gun.get(`${messagesBasePath}/${chatKey}`);
      messagesNode.map().once((_, messageKey) => {
        console.log(`Deleting message: Key = ${messageKey}`);
        messagesNode.get(messageKey).put(null, (msgAck) => {
          if (msgAck.err) {
            console.error(`Failed to delete message with Key = ${messageKey}:`, msgAck.err);
          } else {
            console.log(`Message deleted: Key = ${messageKey}`);
          }
        });
      });

      // Step 3: Remove the chat metadata from the chats node
      chatsNode.get(chatKey).put(null, (ack) => {
        if (ack.err) {
          console.error(`Failed to delete chat metadata with Key = ${chatKey}:`, ack.err);
        } else {
          console.log(`Chat metadata deleted: Key = ${chatKey}`);

          // Step 4: Update the UI state
          setChats((prevChats) =>
            prevChats.filter((chat) => chat !== chatAddress)
          );
          console.log(`Chat removed from UI for Address = ${chatAddress}`);
        }
      });
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

    // Access the account node and get the 'nickname' field
    const nicknameNode = gun.get(account).get('nickname');

    nicknameNode.once((data, key) => {
        if (!data) {
            console.warn(`No nickname found for account: ${account.slice(-4)}`);
            setNickname(`TCA#${account.slice(-3)}`); // Clear the nickname if not found
            return;
        }

        // Extract the nickname value
        const nickname = data[''] || data; // Handle flat or structured data
        if (nickname) {
            console.log(`Resolved nickname for account ${account.slice(-4)}:`, nickname);
            setNickname(nickname); // Update the state with the fetched nickname
        } else {
            console.warn(`Invalid or empty nickname found for account: ${account.slice(-4)}`);
            setNickname(`TCA#${account.slice(-3)}`); // Clear if invalid
        }
    });

    // Cleanup function to detach listeners
    return () => {
        console.log("Cleaning up nickname subscription for account:", account.slice(-4));
        nicknameNode.off();
    };
}; 

export const saveNicknameToGun = (account, nickname, callback) => {
    if (account && nickname.trim()) {
      gun.get(account).put({ nickname }, (ack) => {
        callback(ack);
      });
    }
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
  