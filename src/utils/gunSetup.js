// gunSetup.js
import Gun from 'gun';

const gun = Gun({
  peers: [
    'https://gun-manhattan.herokuapp.com/gun',
    //'http://localhost:8765/gun',
  ],
});

export default gun;
