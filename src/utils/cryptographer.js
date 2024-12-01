
/**
 * Convert a string to binary representation.
 * @param {string} text - The input text to convert.
 * @returns {string} The binary representation of the text.
 */
export const textToBinary = (text) => {
  return text
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
};

/**
* Convert binary representation back to a string.
* @param {string} binary - The binary string to convert back to text.
* @returns {string} The decoded text.
*/
export const binaryToText = (binary) => {
  return binary
      .split(' ')
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join('');
};

/**
* Encrypt a message using binary representation.
* @param {string} plainText - The text to encrypt.
* @returns {string} The binary representation of the message.
*/
export const encryptMessage = (plainText) => {
  return textToBinary(plainText);
};

/**
* Decrypt a binary message back to text.
* @param {string} binaryMessage - The binary representation of the message.
* @returns {string} The original text message.
*/
export const decryptMessage = (binaryMessage) => {
  return binaryToText(binaryMessage);
};
