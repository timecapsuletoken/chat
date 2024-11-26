import Gun from 'gun';

const gun = Gun({
  peers: ['http://localhost:8765/gun'], // Local relay server
  localStorage: false, // Disable browser localStorage
});

export default gun;
