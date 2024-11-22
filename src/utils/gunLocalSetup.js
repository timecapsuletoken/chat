import Gun from 'gun';

const gun = Gun({
  peers: [
    {
      url: 'https://gun-private-relay.onrender.com/gun',
      headers: {
        'x-api-key': process.env.REACT_APP_GUN_API_KEY, // Ensure this variable is set in your environment
      },
    },
  ],
});

export default gun;