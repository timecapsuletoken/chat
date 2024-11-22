import Gun from 'gun';

const gun = Gun({
  peers: [
    'https://gun-private-relay.onrender.com/gun', // Local Gun relay for testing
  ],
});

export default gun;