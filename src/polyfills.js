import { Buffer } from 'buffer';
import crypto from 'crypto-browserify';

if (!global.Buffer) global.Buffer = Buffer;
if (!window.crypto) window.crypto = crypto.webcrypto || crypto;

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
