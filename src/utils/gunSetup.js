import Gun from 'gun';
import { encryptData, decryptData } from './cryptographer';

const gun = Gun({
  peers: [
    {
      url: 'https://gun-private-relay.onrender.com/gun',
      headers: {
        'x-api-key': '940a7906641dd6bdf6fcd39eefe757248395e6cbe7b292a8f55c3a8e1fcceee5', // The same key you set in Render
      },
    },
  ],
});

// Wrap Gun's `put` for encryption
const originalPut = gun.put.bind(gun);

gun.put = (data, callback) => {
  const encryptedData = encryptData(data);
  originalPut(encryptedData, callback);
};

// Decrypt on data fetch
gun.on('in', (msg) => {
  if (msg.put) {
    Object.keys(msg.put).forEach((key) => {
      msg.put[key] = decryptData(msg.put[key]);
    });
  }
});

export default gun;