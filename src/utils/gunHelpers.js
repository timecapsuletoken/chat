import gun from './gunSetup';

// Fetch chats linked to the user's account
export const fetchChats = (account, setChats) => {
    if (!account) return;

    console.log("Fetching chats for account:", account.slice(-4));

    const loadedChats = new Set();
    const chatNode = gun.get(account).get('chats');

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

    // Cleanup function to detach listeners
    return () => {
        console.log("Cleaning up chat subscriptions for account:", account.slice(-4));
        chatNode.off();
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
      setSettings({
        notificationsEnabled: data.notificationsEnabled || false,
        soundAlertsEnabled: data.soundAlertsEnabled || false,
        desktopNotificationsEnabled: data.desktopNotificationsEnabled || false,
        blockedAddresses: data.blockedAddresses || [], // Ensure this is properly fetched
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
  
    gun.get(account).get('blockedAddresses').set(trimmedAddress, (ack) => {
      if (ack.err) {
        console.error("Failed to block address:", ack.err);
      } else {
        setBlockedAddresses((prev) => (Array.isArray(prev) ? [...prev, trimmedAddress] : [trimmedAddress]));
        console.log("Blocked address:", trimmedAddress);
      }
    });
};  

// Unblock a specific address
export const handleUnblockAddress = (account, address, setBlockedAddresses) => {
  const updatedBlockedAddresses = setBlockedAddresses((prev) =>
    prev.filter((a) => a !== address)
  );

  gun.get(account).get('blockedAddresses').map().once((data, key) => {
    if (data === address) {
      gun.get(account).get('blockedAddresses').get(key).put(null, (ack) => {
        if (ack.err) {
          console.error("Failed to unblock address:", ack.err);
        } else {
          console.log("Address unblocked:", address);
        }
      });
    }
  });

  setBlockedAddresses(updatedBlockedAddresses);
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

// Delete a chat
export const handleDeleteChat = (account, chatToDelete, setChats) => {
  gun.get(account).get('chats').map().once((data, key) => {
    if (data === chatToDelete) {
      gun.get(account).get('chats').get(key).put(null, (ack) => {
        if (ack.err) {
          console.error("Failed to delete chat:", ack.err);
        } else {
          console.log("Chat deleted:", chatToDelete);
          setChats((prev) => prev.filter((chat) => chat !== chatToDelete));
        }
      });
    }
  });
};

// Clear all chat history
export const handleClearChatHistory = (account, setChats) => {
  gun.get(account).get('chats').map().once((data, key) => {
    gun.get(account).get('chats').get(key).put(null, (ack) => {
      if (ack.err) {
        console.error("Failed to clear chat history:", ack.err);
      }
    });
  });

  setChats([]);
  console.log("Chat history cleared.");
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
  