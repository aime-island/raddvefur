const isMicrophoneSupported = () => {
  return (
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
  );
};

if (!isMicrophoneSupported() || !window.MediaRecorder) {
  window.MediaRecorder = require('./audio-recorder-polyfill');
}
