if (!window.MediaRecorder) {
  window.MediaRecorder = require('./services/audio-recorder-polyfill');
}
