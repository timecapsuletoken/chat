import Gun from 'gun';

const gun = Gun({
  peers: ['http://192.168.1.2:8765/gun'], // Local relay server
  //peers: ['https://gun-manhattan.herokuapp.com/gun'], // Free hosted relay
  localStorage: false, // Disable browser localStorage
});

export default gun;
