import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || 'fallback-secret-key';

// Encrypt data
export const encryptData = (data) => {
  const jsonData = JSON.stringify(data); // Convert data to JSON string
  const ciphertext = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
  return ciphertext;
};

// Decrypt data
export const decryptData = (ciphertext) => {
    if (!ciphertext || typeof ciphertext !== 'string') {
      console.warn('Invalid ciphertext, skipping decryption:', ciphertext);
      return ciphertext; // Return as-is if not valid ciphertext
    }
  
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  
      return JSON.parse(decryptedData); // Convert back to JSON
    } catch (error) {
      console.error('Error decrypting data:', error.message, ciphertext);
      return ciphertext; // Return as-is if decryption fails
    }
  };
  
