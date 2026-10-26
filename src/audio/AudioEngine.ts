import { SwitchSynthesizer } from './SwitchSynthesizer';
import {
  KeySonicProfile,
  KeySoundConfig,
  LatencyDiagnostic,
  SpatialAudioMode,
  SoundItem,
} from '../types/keysonic';

export interface SwitchAudioPack {
  id: string;
  generics: AudioBuffer[];
  space: AudioBuffer | null;
  enter: AudioBuffer | null;
  backspace: AudioBuffer | null;
}

const PACK_DEFINITIONS: Record<
  string,
  { folder: string; generics: string[]; space: string; enter: string; backspace: string }
> = {
  'holy-panda': {
    folder: 'holy-panda',
    generics: ['GENERIC_R0.mp3', 'GENERIC_R1.mp3', 'GENERIC_R2.mp3', 'GENERIC_R3.mp3', 'GENERIC_R4.mp3'],
    space: 'SPACE.mp3',
    enter: 'ENTER.mp3',
    backspace: 'BACKSPACE.mp3',
  },
  'cherry-blue': {
    folder: 'cherry-blue',
    generics: ['GENERIC_R0.mp3', 'GENERIC_R1.mp3', 'GENERIC_R2.mp3', 'GENERIC_R3.mp3', 'GENERIC_R4.mp3'],
    space: 'SPACE.mp3',
    enter: 'ENTER.mp3',
    backspace: 'BACKSPACE.mp3',
  },
  'nk-cream': {
    folder: 'nk-cream',
    generics: ['GENERIC_R0.mp3', 'GENERIC_R1.mp3', 'GENERIC_R2.mp3', 'GENERIC_R3.mp3', 'GENERIC_R4.mp3'],
    space: 'SPACE.mp3',
    enter: 'ENTER.mp3',
    backspace: 'BACKSPACE.mp3',
  },
  'cherry-brown': {
    folder: 'cherry-brown',
    generics: ['GENERIC_R0.mp3', 'GENERIC_R1.mp3', 'GENERIC_R2.mp3', 'GENERIC_R3.mp3', 'GENERIC_R4.mp3'],
    space: 'SPACE.mp3',
    enter: 'ENTER.mp3',
    backspace: 'BACKSPACE.mp3',
  },
  'cherry-black': {
    folder: 'cherry-black',
    generics: ['GENERIC_R0.mp3', 'GENERIC_R1.mp3', 'GENERIC_R2.mp3', 'GENERIC_R3.mp3', 'GENERIC_R4.mp3'],
    space: 'SPACE.mp3',
    enter: 'ENTER.mp3',
    backspace: 'BACKSPACE.mp3',
  },
  'turquoise': {
    folder: 'turquoise',
    generics: ['GENERIC_R0.mp3', 'GENERIC_R1.mp3', 'GENERIC_R2.mp3', 'GENERIC_R3.mp3', 'GENERIC_R4.mp3'],
    space: 'SPACE.mp3',
    enter: 'ENTER.mp3',
    backspace: 'BACKSPACE.mp3',
  },
  'typewriter': {
    folder: 'typewriter',
    generics: ['key.wav', 'key2.wav'],
    space: 'space.wav',
    enter: 'enter.wav',
    backspace: 'delete.wav',
  },
  'cyber': {
    folder: 'cyber',
    generics: ['1real.wav', '2real.wav', '3real.wav', '4real.wav'],
    space: 'space.wav',
    enter: 'enter.wav',
    backspace: 'backspace.wav',
  },
};

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nightFilter: BiquadFilterNode | null = null;
  private synthesizer: SwitchSynthesizer | null = null;

  // Authentic Switch Audio Packs
  private switchPacks: Map<string, SwitchAudioPack> = new Map();
  private packsLoaded = false;
  private packsLoading = false;

  // Custom audio buffers cache: soundId -> AudioBuffer
  private customAudioBuffers: Map<string, AudioBuffer> = new Map();

  // Diagnostics & state
  private activeVoicesCount = 0;
  private latencyHistory: number[] = [];
  private lastLatency = 1.8;

  // Keystroke metrics for Adaptive Clack and Typing Energy
  private recentKeystrokes: number[] = [];
  private currentWpm = 0;
  private currentEnergy = 0; // 0 to 1
  private sessionTotalKeystrokes = 0;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public async initAudio(): Promise<boolean> {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      if (!this.packsLoaded && !this.packsLoading) {
        this.preloadSwitchPacks().catch((err) => console.warn('Packs load error:', err));
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });

      // Night mode warm filter
      this.nightFilter = this.ctx.createBiquadFilter();
      this.nightFilter.type = 'lowpass';
      this.nightFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.nightFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.synthesizer = new SwitchSynthesizer(this.ctx);

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.preloadSwitchPacks().catch((err) => console.warn('Packs load error:', err));
      return true;
    } catch (e) {
      console.warn('AudioContext initialization deferred until user interaction', e);
      return false;
    }
  }

  public async preloadSwitchPacks(): Promise<void> {
    if (!this.ctx || this.packsLoaded || this.packsLoading) return;
    this.packsLoading = true;

    const loadBuffer = async (url: string): Promise<AudioBuffer | null> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        if (!this.ctx) return null;
        return await this.ctx.decodeAudioData(arrayBuffer);
      } catch (_) {
        return null;
      }
    };

    for (const [packId, def] of Object.entries(PACK_DEFINITIONS)) {
      try {
        const genericPromises = def.generics.map((g) => loadBuffer(`/sounds/${def.folder}/${g}`));
        const spacePromise = loadBuffer(`/sounds/${def.folder}/${def.space}`);
        const enterPromise = loadBuffer(`/sounds/${def.folder}/${def.enter}`);
        const backspacePromise = loadBuffer(`/sounds/${def.folder}/${def.backspace}`);

        const [genericResults, spaceBuf, enterBuf, backspaceBuf] = await Promise.all([
          Promise.all(genericPromises),
          spacePromise,
          enterPromise,
          backspacePromise,
        ]);

        const validGenerics = genericResults.filter((b): b is AudioBuffer => b !== null);
        if (validGenerics.length > 0) {
          const pack: SwitchAudioPack = {
            id: packId,
            generics: validGenerics,
            space: spaceBuf || validGenerics[0],
            enter: enterBuf || validGenerics[validGenerics.length - 1],
            backspace: backspaceBuf || validGenerics[0],
          };
          this.switchPacks.set(packId, pack);
        }
      } catch (err) {
        console.warn(`Failed preloading switch pack ${packId}:`, err);
      }
    }

    this.packsLoaded = true;
    this.packsLoading = false;
  }

  public isReady(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  public getContextState(): AudioContextState {
    return this.ctx ? this.ctx.state : 'suspended';
  }

  public getSampleRate(): number {
    return this.ctx ? this.ctx.sampleRate : 48000;
  }

  public setMasterVolume(
    volumePercent: number,
    muted: boolean,
    silentMode: boolean,
    nightModeActive: boolean,
    nightModeReduction: number
  ) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (muted || silentMode) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.01);
      return;
    }

    let vol = Math.max(0, Math.min(1, volumePercent / 100));
    if (nightModeActive) {
      vol *= Math.max(0.1, 1 - nightModeReduction / 100);
      if (this.nightFilter) {
        this.nightFilter.frequency.setTargetAtTime(4200, now, 0.05);
      }
    } else {
      if (this.nightFilter) {
        this.nightFilter.frequency.setTargetAtTime(20000, now, 0.05);
      }
    }

    this.masterGain.gain.setTargetAtTime(vol, now, 0.01);
  }

  public registerCustomBuffer(soundId: string, buffer: AudioBuffer) {
    this.customAudioBuffers.set(soundId, buffer);
  }

  public async decodeAndRegisterAudio(soundId: string, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    await this.initAudio();
    if (!this.ctx) throw new Error('AudioContext not available');
    const buffer = await this.ctx.decodeAudioData(arrayBuffer.slice(0));
    this.customAudioBuffers.set(soundId, buffer);
    return buffer;
  }

  public resolvePackId(soundIdOrProfile: string): string {
    const s = (soundIdOrProfile || '').toLowerCase();
    if (s.includes('blue') || s.includes('click') || s.includes('sharp')) return 'cherry-blue';
    if (s.includes('cream') || s.includes('lubed')) return 'nk-cream';
    if (s.includes('brown') || s.includes('tactile')) return 'cherry-brown';
    if (s.includes('black') || s.includes('heavy') || s.includes('firm')) return 'cherry-black';
    if (s.includes('typewriter') || s.includes('vintage') || s.includes('retro-type')) return 'typewriter';
    if (s.includes('cyber') || s.includes('retro') || s.includes('rgb') || s.includes('future') || s.includes('ibm')) return 'cyber';
    if (s.includes('linear') || s.includes('gaming') || s.includes('turquoise') || s.includes('red') || s.includes('smooth')) return 'turquoise';
    // Default to the king of deep tactile mechanical thock
    return 'holy-panda';
  }

  public recordKeystroke(): { wpm: number; energy: number; sessionCount: number } {
    const now = Date.now();
    this.sessionTotalKeystrokes++;
    this.recentKeystrokes.push(now);

    const cutoffWpm = now - 6000;
    this.recentKeystrokes = this.recentKeystrokes.filter((t) => t > cutoffWpm);

    if (this.recentKeystrokes.length > 2) {
      const windowSec = (now - this.recentKeystrokes[0]) / 1000;
      if (windowSec > 0.4) {
        const words = this.recentKeystrokes.length / 5;
        this.currentWpm = Math.round((words / windowSec) * 60);
      }
    } else {
      this.currentWpm = 0;
    }

    const energyWindow = now - 1800;
    const rapidPresses = this.recentKeystrokes.filter((t) => t > energyWindow).length;
    this.currentEnergy = Math.min(1.0, rapidPresses / 12);

    return {
      wpm: this.currentWpm,
      energy: this.currentEnergy,
      sessionCount: this.sessionTotalKeystrokes,
    };
  }

  public getWpm(): number {
    return this.currentWpm;
  }

  public getEnergy(): number {
    return this.currentEnergy;
  }

  public getSessionCount(): number {
    return this.sessionTotalKeystrokes;
  }

  public async playKey(
    keyId: string,
    keyConfig: KeySoundConfig | undefined,
    profile: KeySonicProfile,
    keyXRatio: number = 0.5
  ): Promise<void> {
    const startDispatch = performance.now();
    await this.initAudio();
    if (!this.ctx || !this.nightFilter) return;

    let targetSoundId = profile.globalSoundId;
    let baseVolume = profile.volume;
    let basePitch = profile.pitch;
    let attack = 0;
    let decay = 140;
    let panOffset = 0;

    if (keyConfig) {
      baseVolume = keyConfig.volume;
      basePitch = keyConfig.pitch;
      attack = keyConfig.attack;
      decay = keyConfig.decay;
      panOffset = keyConfig.pan;

      if (keyConfig.randomizationEnabled && keyConfig.randomizedSounds && keyConfig.randomizedSounds.length > 0) {
        targetSoundId = this.pickRandomSound(keyConfig.randomizedSounds);
      } else {
        targetSoundId = keyConfig.soundId || profile.globalSoundId;
      }
    }

    // Natural variation micro-jitter
    let pitchJitter = 0;
    let volJitter = 1.0;
    if (profile.naturalVariation) {
      pitchJitter = (Math.random() - 0.5) * 0.6;
      volJitter = 0.95 + Math.random() * 0.1;
    }

    // Adaptive Clack boost
    let adaptivePitchBoost = 0;
    if (profile.adaptiveClack.enabled) {
      const wpm = this.currentWpm;
      if (wpm >= profile.adaptiveClack.thresholdHigh) {
        adaptivePitchBoost = profile.adaptiveClack.pitchBoostPerTier * 2;
      } else if (wpm >= profile.adaptiveClack.thresholdMedium) {
        adaptivePitchBoost = profile.adaptiveClack.pitchBoostPerTier;
      } else if (wpm >= profile.adaptiveClack.thresholdLow) {
        adaptivePitchBoost = profile.adaptiveClack.pitchBoostPerTier * 0.4;
      }
    }

    // Typing Energy boost
    let energyBoost = 0;
    if (profile.typingEnergy.enabled) {
      energyBoost = this.currentEnergy * (profile.typingEnergy.intensity / 100);
    }

    // Calculate Spatial Pan: -1 (left) to 1 (right)
    let spatialPan = 0;
    if (profile.spatialAudio !== 'OFF') {
      const physicalPan = (keyXRatio - 0.5) * 2;
      const spatialMultiplier =
        profile.spatialAudio === 'HIGH' ? 0.75 : profile.spatialAudio === 'MEDIUM' ? 0.5 : 0.25;
      spatialPan = Math.max(-0.95, Math.min(0.95, physicalPan * spatialMultiplier + panOffset));
    } else {
      spatialPan = panOffset;
    }

    // Destination node with panning
    this.activeVoicesCount++;
    let voiceDest: AudioNode = this.nightFilter;
    let panner: StereoPannerNode | null = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(spatialPan, this.ctx.currentTime);
      panner.connect(this.nightFilter);
      voiceDest = panner;
    }

    // Check if soundId maps to an authentic switch pack
    const packId = this.resolvePackId(targetSoundId || profile.globalSoundId || profile.id);
    const pack = this.switchPacks.get(packId);

    if (pack) {
      let buffer: AudioBuffer;
      const k = keyId.toLowerCase();
      if (k === 'space') {
        buffer = pack.space || pack.generics[0];
      } else if (k === 'enter' || k === 'numpadenter') {
        buffer = pack.enter || pack.generics[0];
      } else if (k === 'backspace' || k === 'delete') {
        buffer = pack.backspace || pack.generics[0];
      } else {
        const randIdx = Math.floor(Math.random() * pack.generics.length);
        buffer = pack.generics[randIdx];
      }

      this.playCustomBuffer(
        buffer,
        voiceDest,
        basePitch + pitchJitter + adaptivePitchBoost,
        (baseVolume / 100) * volJitter,
        attack,
        decay,
        energyBoost
      );
    } else {
      // Check user uploaded custom buffer
      const customBuf = this.customAudioBuffers.get(targetSoundId);
      if (customBuf) {
        this.playCustomBuffer(
          customBuf,
          voiceDest,
          basePitch + pitchJitter + adaptivePitchBoost,
          (baseVolume / 100) * volJitter,
          attack,
          decay,
          energyBoost
        );
      } else if (this.synthesizer) {
        this.synthesizer.playSwitch(
          targetSoundId,
          voiceDest,
          basePitch + pitchJitter + adaptivePitchBoost,
          (baseVolume / 100) * volJitter,
          attack,
          decay,
          energyBoost
        );
      }
    }

    setTimeout(() => {
      this.activeVoicesCount = Math.max(0, this.activeVoicesCount - 1);
      if (panner) {
        try {
          panner.disconnect();
        } catch (_) {}
      }
    }, Math.max(120, decay + attack + 80));

    const durationMs = performance.now() - startDispatch;
    this.recordLatency(durationMs);
  }

  public async previewSound(soundId: string, pitch = 0, volume = 0.85, decay = 140, pan = 0): Promise<void> {
    await this.initAudio();
    if (!this.ctx || !this.nightFilter) return;

    const packId = this.resolvePackId(soundId);
    const pack = this.switchPacks.get(packId);

    let voiceDest: AudioNode = this.nightFilter;
    let panner: StereoPannerNode | null = null;
    if (this.ctx.createStereoPanner && pan !== 0) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, this.ctx.currentTime);
      panner.connect(this.nightFilter);
      voiceDest = panner;
    }

    if (pack && pack.generics.length > 0) {
      const randIdx = Math.floor(Math.random() * pack.generics.length);
      this.playCustomBuffer(pack.generics[randIdx], voiceDest, pitch, volume, 0, decay, 0);
      return;
    }

    const customBuf = this.customAudioBuffers.get(soundId);
    if (customBuf) {
      this.playCustomBuffer(customBuf, voiceDest, pitch, volume, 0, decay, 0);
      return;
    }

    if (this.synthesizer) {
      this.synthesizer.playSwitch(soundId, voiceDest, pitch, volume, 0, decay, 0);
    }
  }

  private playCustomBuffer(
    buffer: AudioBuffer,
    dest: AudioNode,
    pitchSemitones: number,
    volumeFactor: number,
    attackMs: number,
    decayMs: number,
    energyBoost: number
  ) {
    if (!this.ctx) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const pitchRate = Math.max(0.2, Math.min(4.0, Math.pow(2, (pitchSemitones + energyBoost * 1.5) / 12)));
    source.playbackRate.setValueAtTime(pitchRate, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const naturalDuration = buffer.duration / pitchRate;
    const attackSec = attackMs / 1000;
    const decaySec = Math.max(naturalDuration, decayMs / 1000);

    const targetGain = Math.max(0.01, volumeFactor * (1 + energyBoost * 0.25));

    if (attackSec > 0.005) {
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + attackSec);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + attackSec + decaySec);
    } else {
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);
    }

    source.connect(gain);
    gain.connect(dest);
    source.start(now);
    source.stop(now + attackSec + decaySec + 0.05);
  }

  private pickRandomSound(sounds: Array<{ soundId: string; weight: number }>): string {
    const totalWeight = sounds.reduce((sum, s) => sum + Math.max(1, s.weight), 0);
    let rand = Math.random() * totalWeight;
    for (const item of sounds) {
      rand -= Math.max(1, item.weight);
      if (rand <= 0) return item.soundId;
    }
    return sounds[0]?.soundId || 'holy-panda';
  }

  private recordLatency(latMs: number) {
    this.lastLatency = Math.round(latMs * 10) / 10;
    this.latencyHistory.push(latMs);
    if (this.latencyHistory.length > 50) {
      this.latencyHistory.shift();
    }
  }

  public getDiagnostics(): LatencyDiagnostic {
    const sum = this.latencyHistory.reduce((a, b) => a + b, 0);
    const avg = this.latencyHistory.length > 0 ? sum / this.latencyHistory.length : 1.8;
    const min = this.latencyHistory.length > 0 ? Math.min(...this.latencyHistory) : 1.2;
    const max = this.latencyHistory.length > 0 ? Math.max(...this.latencyHistory) : 3.5;

    return {
      lastLatencyMs: Math.round(this.lastLatency * 10) / 10,
      averageLatencyMs: Math.round(avg * 10) / 10,
      minLatencyMs: Math.round(min * 10) / 10,
      maxLatencyMs: Math.round(max * 10) / 10,
      activeVoices: this.activeVoicesCount,
      audioSampleRate: this.ctx?.sampleRate || 48000,
      audioState: this.ctx?.state || 'suspended',
    };
  }
}
