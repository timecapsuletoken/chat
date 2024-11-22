import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_CRYPTOGRAPHER_SECRET_KEY || 'fallback-secret-key';

// Encrypt data
export const encryptData = (data) => {
  const jsonData = JSON.stringify(data); // Convert data to JSON string
  const ciphertext = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
  return ciphertext;
};

// Decrypt data
export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData); // Convert back to JSON
};
