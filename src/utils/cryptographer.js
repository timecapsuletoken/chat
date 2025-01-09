import CryptoJS from 'crypto-js';

/**
 * Convert a string to an enhanced binary representation using AES encryption.
 * Includes Dynamic IV, Salt, and MAC.
 * @param {string} text - The input text to convert.
 * @returns {string} The encrypted binary representation of the text.
 */
export const secureTextToBinary = (text) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Replace with a securely generated key

  // Generate random salt and IV
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  // Derive a key using PBKDF2 with the salt
  const derivedKey = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  // Encrypt the text with AES using the derived key and IV
  const encrypted = CryptoJS.AES.encrypt(text, derivedKey, { iv: iv });

  // Compute HMAC for the encrypted data
  const hmac = CryptoJS.HmacSHA256(encrypted.toString(), secretKey);

  // Combine salt, IV, encrypted text, and HMAC into one payload
  const payload = {
    salt: salt.toString(CryptoJS.enc.Hex),
    iv: iv.toString(CryptoJS.enc.Hex),
    ciphertext: encrypted.toString(),
    hmac: hmac.toString(CryptoJS.enc.Hex),
  };

  // Convert payload to JSON string and then to binary
  const payloadString = JSON.stringify(payload);
  return payloadString
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
};

/**
 * Convert an enhanced binary representation back to a string using AES decryption.
 * Validates the MAC to ensure data integrity.
 * @param {string} binary - The binary string to convert back to text.
 * @returns {string} The decrypted original text.
 */
export const secureBinaryToText = (binary) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Use the same key as in encryption

  // Convert binary back to the JSON string payload
  const payloadString = binary
    .split(' ')
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join('');

  // Parse the payload JSON
  const payload = JSON.parse(payloadString);
  const { salt, iv, ciphertext, hmac } = payload;

  // Verify the HMAC
  const computedHmac = CryptoJS.HmacSHA256(ciphertext, secretKey).toString(CryptoJS.enc.Hex);
  if (computedHmac !== hmac) {
    throw new Error('Data integrity check failed: HMAC does not match');
  }

  // Derive the key using the salt
  const derivedKey = CryptoJS.PBKDF2(secretKey, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });

  // Decrypt the ciphertext with AES using the derived key and IV
  const decrypted = CryptoJS.AES.decrypt(ciphertext, derivedKey, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * Encrypt a message using enhanced binary representation.
 * @param {string} plainText - The text to encrypt.
 * @returns {string} The enhanced binary representation of the message.
 */
export const encryptMessage = (plainText) => {
  return secureTextToBinary(plainText);
};

/**
 * Decrypt an enhanced binary message back to text.
 * @param {string} binaryMessage - The enhanced binary representation of the message.
 * @returns {string} The original text message.
 */
export const decryptMessage = (binaryMessage) => {
  return secureBinaryToText(binaryMessage);
};
