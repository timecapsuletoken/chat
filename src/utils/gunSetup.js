import Gun from 'gun';

const gun = Gun({
  peers: [process.env.REACT_APP_GUN_PEER_URL],
  //peers: [process.env.REACT_APP_GUN_LOCAL_PEER_URL],
  localStorage: false, // Disable browser localStorage
});

export default gun;
