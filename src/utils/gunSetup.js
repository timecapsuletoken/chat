import Gun from 'gun';

const gun = Gun({
  peers: ['http://192.168.1.2:8765/gun'], // Local relay server
  //peers: ['https://3lswclmj-8765.euw.devtunnels.ms/gun'],
  //peers: ['https://gun-manhattan.herokuapp.com/gun'], 
  localStorage: false, // Disable browser localStorage
});

export default gun;
