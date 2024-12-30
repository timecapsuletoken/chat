let audioContext;
let notificationSound;

export const initializeAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    fetch('/assets/sounds/notification.mp3') // Ensure the path points to your sound file
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioContext.decodeAudioData(buffer))
      .then((decodedData) => {
        notificationSound = decodedData;
      })
      .catch((error) => console.error("Failed to load notification sound:", error));
  }
};

export const playNotificationSound = () => {
  if (audioContext && notificationSound) {
    const source = audioContext.createBufferSource();
    source.buffer = notificationSound;
    source.connect(audioContext.destination);
    source.start(0);
  } else {
    console.error("AudioContext not initialized or sound not loaded.");
  }
};
