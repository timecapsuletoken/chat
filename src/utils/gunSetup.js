import Gun from 'gun';

const gun = Gun({
  peers: ['http://192.168.1.33:8765/gun'], // Local relay server
  //peers: ['https://41rk093t-8765.euw.devtunnels.ms/gun'],
  //peers: ['https://gun-manhattan.herokuapp.com/gun'], 
  //peers: ['https://peer.wallie.io/gun'],
  localStorage: false, // Disable browser localStorage
});

export default gun;
