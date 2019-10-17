import { isNativeIOS } from '../../../../utility';
import { bool } from 'prop-types';

let AUDIO_TYPE = 'audio/wav';

var createObjectURL =
  (window.URL || window.webkitURL || {}).createObjectURL || function() {};

var AudioContext = window.AudioContext || window.webkitAudioContext;

interface BlobEvent extends Event {
  data: Blob;
}

export enum AudioError {
  NOT_ALLOWED = 'NOT_ALLOWED',
  NO_MIC = 'NO_MIC',
  NO_SUPPORT = 'NO_SUPPORT',
}

export interface AudioInfo {
  url: string;
  blob: Blob;
}

export default class AudioSafariIOS {
  microphone: MediaStream;
  analyzerNode: AnalyserNode;
  audioContext: AudioContext;
  recorder: any;
  chunks: any[];
  last: AudioInfo;
  lastRecordingData: Blob;
  lastRecordingUrl: string;
  frequencyBins: Uint8Array;
  volumeCallback: Function;
  jsNode: any;

  constructor() {
    // Make sure we are in the right context before we allow instantiation.
    if (isNativeIOS()) {
      throw new Error('cannot use web audio in iOS app');
    }

    this.visualize = this.visualize.bind(this);
  }

  // Check all the browser prefixes for microhpone support.
  isMicrophoneSupported() {
    return (
      (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    );
  }

  // Check if audio recording is supported
  isAudioRecordingSupported() {
    return typeof MediaRecorder !== 'undefined' || this.isPolyfillRecording();
  }

  isPolyfillRecording() {
    return MediaRecorder.notSupported !== undefined;
  }

  private visualize() {
    this.analyzerNode.getByteFrequencyData(this.frequencyBins);

    let sum = 0;
    for (var i = 0; i < this.frequencyBins.length; i++) {
      sum += this.frequencyBins[i];
    }

    let average = sum / this.frequencyBins.length;

    if (this.volumeCallback) {
      this.volumeCallback(average);
    }
  }

  private startVisualize() {
    this.jsNode.onaudioprocess = this.visualize;
  }

  private stopVisualize() {
    this.jsNode.onaudioprocess = undefined;
    if (this.volumeCallback) {
      this.volumeCallback(100);
    }
  }

  setVolumeCallback(cb: Function) {
    this.volumeCallback = cb;
  }

  /**
   * Initialize the recorder, opening the microphone media stream.
   *
   * If microphone access is currently denied, the user is asked to grant
   * access. Since these permission changes take effect only after a reload,
   * the page is reloaded if the user decides to do so.
   *
   */
  init() {
    return;
  }
  start(): Promise<void> {
    return new Promise<void>(async (res: Function, rej: Function) => {
      var audioContext = await new AudioContext();

      // Set up the analyzer node, and allocate an array for its data
      // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
      // 22kHz or more, and we only care about visualizing lower frequencies
      // which is where most human voice lies, so we use fewer bins
      var analyzerNode = await audioContext.createAnalyser();
      analyzerNode.channelCount = 1;
      analyzerNode.fftSize = 128;
      analyzerNode.smoothingTimeConstant = 0.96;
      this.frequencyBins = new Uint8Array(analyzerNode.frequencyBinCount);

      analyzerNode.connect(audioContext.destination);
      this.recorder = new MediaRecorder(null, { audio: true });

      // Setup audio visualizer.
      this.jsNode = audioContext.createScriptProcessor(256, 1, 1);
      this.jsNode.connect(audioContext.destination);

      //
      this.analyzerNode = analyzerNode;
      this.audioContext = audioContext;

      this.chunks = [];

      this.recorder.addEventListener('dataavailable', (e: BlobEvent) => {
        this.chunks.push(e.data);
      });

      this.recorder.addEventListener('start', (e: Event) => {
        this.clear();
        res();
      });

      // We want to be able to record up to 60s of audio in a single blob.
      // Without this argument to start(), Chrome will call dataavailable
      // very frequently.
      this.startVisualize();
      this.recorder.start(20000);
    });
  }

  stop(): Promise<AudioInfo> {
    return new Promise((res: Function, rej: Function) => {
      this.stopVisualize();

      this.recorder.addEventListener('start', (e: Event) => {
        this.clear();
        res();
      });

      this.recorder.addEventListener('stop', (e: Event) => {
        let blob = new Blob(this.chunks, { type: AUDIO_TYPE });
        this.last = {
          url: createObjectURL(blob),
          blob: blob,
        };
        res(this.last);
      });
      this.recorder.stop();
      this.audioContext.close();
    });
  }

  release() {
    if (this.microphone) {
      for (const track of this.microphone.getTracks()) {
        track.stop();
      }
    }
    this.microphone = null;
    return 'nothing';
  }

  clear() {
    if (this.lastRecordingUrl) {
      URL.revokeObjectURL(this.lastRecordingUrl);
    }

    this.lastRecordingData = null;
    this.lastRecordingUrl = null;
  }
}
