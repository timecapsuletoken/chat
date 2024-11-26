import gun from './gunSetup';

// Fetch chats linked to the user's account
export const fetchChats = (account, setChats) => {
  if (!account) return;

  console.log("Fetching chats for account:", account);

  const loadedChats = new Set();
  const subscription = gun
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

  return () => subscription.off(); // Clean up subscription
};

// Fetch settings for the user's account
export const fetchSettings = async (account, setSettings) => {
  if (!account) return;

  console.log("Fetching settings for account:", account);

  try {
    const data = await new Promise((resolve) => {
      gun.get(account).once((fetchedData) => resolve(fetchedData || {}));
    });

    console.log("Fetched data from Gun:", data);
    setSettings(data);
  } catch (error) {
    console.error("Error fetching settings from Gun:", error);
  }
};

// Save user settings
export const handleSaveSettings = (account, settings) => {
  console.log("Saving settings:", settings);

  gun.get(account).put(settings, (ack) => {
    if (ack.err) {
      console.error("Failed to save settings:", ack.err);
    } else {
      console.log("Settings saved successfully:", settings);
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
      setBlockedAddresses((prev) => [...prev, trimmedAddress]);
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

export const saveNicknameToGun = (account, nickname, callback) => {
    if (account && nickname.trim()) {
      gun.get(account).put({ nickname }, (ack) => {
        callback(ack);
      });
    }
  };
  