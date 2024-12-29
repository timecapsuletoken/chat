import { Buffer } from 'buffer';
import crypto from 'crypto-browserify';

if (!global.Buffer) global.Buffer = Buffer;

// Fallback for window.crypto
if (!window.crypto) {
  console.warn('Window.crypto not available. Using crypto-browserify.');
  window.crypto = {
    subtle: {
      encrypt: async () => {
        throw new Error('SubtleCrypto is not supported in this environment.');
      },
      decrypt: async () => {
        throw new Error('SubtleCrypto is not supported in this environment.');
      },
      importKey: async () => {
        throw new Error('SubtleCrypto.importKey is not supported.');
      },
    },
    getRandomValues: (arr) => {
      if (!arr) throw new TypeError('Array is required');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  };
} else if (!window.crypto.subtle) {
  console.warn('SubtleCrypto is not available in this environment. Some features might not work.');
}

// Polyfill for crypto.randomUUID
if (!crypto.randomUUID) {
  crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}
