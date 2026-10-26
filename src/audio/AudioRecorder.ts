/**
 * Microphone Recorder with Waveform Visualizer, Trimmer, and Normalizer
 */
export class AudioRecorder {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioCtx: AudioContext | null = null;
  private recordedBuffer: AudioBuffer | null = null;

  public async requestMicPermission(): Promise<boolean> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      return true;
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      return false;
    }
  }

  public isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }

  public async startRecording(): Promise<void> {
    if (!this.mediaStream) {
      const granted = await this.requestMicPermission();
      if (!granted) throw new Error('Microphone permission not granted');
    }

    this.audioChunks = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : MediaRecorder.isTypeSupported('audio/ogg')
      ? 'audio/ogg'
      : '';

    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.mediaStream!, { mimeType })
      : new MediaRecorder(this.mediaStream!);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(50);
  }

  public async stopRecording(): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Recorder not active'));
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();

          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          this.audioCtx = new AudioCtx();
          const decoded = await this.audioCtx.decodeAudioData(arrayBuffer);
          this.recordedBuffer = decoded;
          resolve(decoded);
        } catch (e) {
          reject(e);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  public getRecordedBuffer(): AudioBuffer | null {
    return this.recordedBuffer;
  }

  /**
   * Trims the AudioBuffer between startFraction (0.0 to 1.0) and endFraction (0.0 to 1.0)
   */
  public trimBuffer(startFraction: number, endFraction: number): AudioBuffer | null {
    if (!this.recordedBuffer || !this.audioCtx) return null;

    const channels = this.recordedBuffer.numberOfChannels;
    const rate = this.recordedBuffer.sampleRate;
    const totalSamples = this.recordedBuffer.length;

    const startSample = Math.floor(Math.max(0, startFraction) * totalSamples);
    const endSample = Math.min(totalSamples, Math.floor(Math.max(startFraction + 0.01, endFraction) * totalSamples));
    const newLength = Math.max(1, endSample - startSample);

    const trimmed = this.audioCtx.createBuffer(channels, newLength, rate);

    for (let c = 0; c < channels; c++) {
      const srcData = this.recordedBuffer.getChannelData(c);
      const destData = trimmed.getChannelData(c);
      for (let i = 0; i < newLength; i++) {
        destData[i] = srcData[startSample + i];
      }
    }

    this.recordedBuffer = trimmed;
    return trimmed;
  }

  /**
   * Peak Normalize the AudioBuffer to maximum peak volume 0.98 (-0.2 dBFS)
   */
  public normalizeBuffer(): AudioBuffer | null {
    if (!this.recordedBuffer) return null;

    let peak = 0;
    const channels = this.recordedBuffer.numberOfChannels;

    for (let c = 0; c < channels; c++) {
      const data = this.recordedBuffer.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        const abs = Math.abs(data[i]);
        if (abs > peak) peak = abs;
      }
    }

    if (peak > 0.0001) {
      const multiplier = 0.98 / peak;
      for (let c = 0; c < channels; c++) {
        const data = this.recordedBuffer.getChannelData(c);
        for (let i = 0; i < data.length; i++) {
          data[i] = data[i] * multiplier;
        }
      }
    }

    return this.recordedBuffer;
  }

  /**
   * Encodes AudioBuffer to standard 16-bit PCM WAV ArrayBuffer
   */
  public bufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const numSamples = buffer.length;
    const dataSize = numSamples * blockAlign;
    const totalSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    // RIFF chunk descriptor
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');

    // "fmt " sub-chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // "data" sub-chunk
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Interleave channels & write 16-bit PCM samples
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  public stopStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }
}
