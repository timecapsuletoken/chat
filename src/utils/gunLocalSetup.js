import Gun from 'gun';

const gun = Gun({
  peers: [
    'http://localhost:8765/gun', // Local Gun relay for testing
  ],
});

export default gun;