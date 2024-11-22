import Gun from 'gun';

const gun = Gun({
  peers: [
    {
      url: 'https://gun-private-relay.onrender.com/gun',
      headers: {
        'x-api-key': '940a7906641dd6bdf6fcd39eefe757248395e6cbe7b292a8f55c3a8e1fcceee5', // The same key you set in Render
      },
    },
  ],
});

export default gun;
