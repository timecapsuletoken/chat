import Gun from 'gun';

const gun = Gun({
  peers: ['https://tiny-kipp-timecapsule-eacffa51.koyeb.app/gun'],
  //peers: ['https://192.168.1.33:8765/gun'],
  localStorage: false, // Disable browser localStorage
});

export default gun;
