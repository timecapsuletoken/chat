// gunSetup.js
import Gun from 'gun';

const gun = Gun({
  peers: ['https://gun-manhattan.herokuapp.com/gun'], // Use a public relay peer for testing
});

export default gun;
