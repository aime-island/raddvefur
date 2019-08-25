import { isNativeIOS } from '../../../../utility';
import { bool } from 'prop-types';

let AUDIO_TYPE = 'audio/ogg; codecs=opus';

var createObjectURL =
  (window.URL || window.webkitURL || {}).createObjectURL || function() {};

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

export default class AudioWeb {
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

  private isReady(): boolean {
    return !!this.microphone;
  }

  private getMicrophone(): Promise<MediaStream> {
    return new Promise(function(res: Function, rej: Function) {
      function deny(error: MediaStreamError) {
        rej(
          ({
            NotAllowedError: AudioError.NOT_ALLOWED,
            NotFoundError: AudioError.NO_MIC,
          } as { [errorName: string]: AudioError })[error.name] || error
        );
      }
      function resolve(stream: MediaStream) {
        res(stream);
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(resolve, deny);
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, resolve, deny);
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ audio: true }, resolve, deny);
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({ audio: true }, resolve, deny);
      } else {
        // Browser does not support getUserMedia
        rej(AudioError.NO_SUPPORT);
      }
    });
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
    return typeof MediaRecorder !== 'undefined';
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
  async init() {
    if (this.isReady()) {
      return;
    }

    const microphone = await this.getMicrophone();
    this.microphone = microphone;

    var AContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = await new AContext();

    // Set up the analyzer node, and allocate an array for its data
    // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
    // 22kHz or more, and we only care about visualizing lower frequencies
    // which is where most human voice lies, so we use fewer bins
    var analyzerNode = await audioContext.createAnalyser();
    analyzerNode.channelCount = 1;
    analyzerNode.fftSize = 128;
    analyzerNode.smoothingTimeConstant = 0.96;
    this.frequencyBins = new Uint8Array(analyzerNode.frequencyBinCount);

    if (this.isPolyfillRecording()) {
      // Safari and Edge
      AUDIO_TYPE = 'audio/wav';
      analyzerNode.connect(audioContext.destination);
      this.recorder = new MediaRecorder(microphone);
    } else {
      // Not Safari / Edge
      var sourceNode = audioContext.createMediaStreamSource(microphone);
      var volumeNode = audioContext.createGain();
      var outputNode = audioContext.createMediaStreamDestination();

      // Make sure we're doing mono everywhere.
      sourceNode.channelCount = 1;
      volumeNode.channelCount = 1;
      outputNode.channelCount = 1;

      // Connect the nodes together
      sourceNode.connect(volumeNode);
      volumeNode.connect(analyzerNode);
      analyzerNode.connect(outputNode);

      // and set up the recorder.
      this.recorder = new MediaRecorder(outputNode.stream);

      // Another audio node used by the beep() function
      var beeperVolume = audioContext.createGain();
      beeperVolume.connect(audioContext.destination);
    }

    // Setup audio visualizer.
    this.jsNode = audioContext.createScriptProcessor(256, 1, 1);
    this.jsNode.connect(audioContext.destination);

    //
    this.analyzerNode = analyzerNode;
    this.audioContext = audioContext;
  }

  start(): Promise<void> {
    if (!this.isReady()) {
      console.error('Cannot record audio before microhphone is ready.');
      return Promise.resolve();
    }

    return new Promise<void>((res: Function, rej: Function) => {
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
    if (!this.isReady()) {
      console.error('Cannot stop audio before microhphone is ready.');
      return Promise.reject();
    }

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
      this.release();
      this.init();
    });
  }

  release() {
    if (this.microphone) {
      for (const track of this.microphone.getTracks()) {
        track.stop();
      }
    }
    this.microphone = null;
    this.audioContext.close();
    this.recorder = null;
  }

  clear() {
    if (this.lastRecordingUrl) {
      URL.revokeObjectURL(this.lastRecordingUrl);
    }

    this.lastRecordingData = null;
    this.lastRecordingUrl = null;
  }
}
