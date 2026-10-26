/**
 * Procedural Audio Synthesizer for Mechanical Keyboard Switches
 * Uses Web Audio API nodes: Oscillators, Noise Buffers, BiquadFilters, Envelopes, Waveshapers.
 * Zero external audio file download required for built-in switches — instant, zero-latency playback!
 */

export class SwitchSynthesizer {
  private ctx: AudioContext;
  private noiseBuffer: AudioBuffer | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.initNoiseBuffer();
  }

  private initNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of white noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  /**
   * Synthesizes and plays a procedural switch sound
   */
  public playSwitch(
    soundId: string,
    destination: AudioNode,
    pitchShiftSemitones: number = 0,
    volumeFactor: number = 1.0,
    attackMs: number = 0,
    decayMs: number = 100,
    energyBoost: number = 0 // 0 to 1
  ): void {
    const now = this.ctx.currentTime;
    const pitchMultiplier = Math.pow(2, (pitchShiftSemitones + energyBoost * 3) / 12);
    const gainScale = Math.max(0.01, volumeFactor * (1 + energyBoost * 0.35));

    switch (soundId) {
      case 'mech-blue':
      case 'mech-clicky':
        this.synthBlueSwitch(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'mech-brown':
      case 'mech-tactile':
        this.synthBrownSwitch(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'mech-red':
      case 'mech-linear':
        this.synthRedSwitch(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'mech-black':
        this.synthBlackSwitch(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'mech-creamy':
        this.synthCreamySwitch(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'thock-deep':
        this.synthDeepThock(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'thock-soft':
        this.synthSoftThock(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'thock-creamy':
        this.synthCreamyThock(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'thock-heavy':
        this.synthHeavyThock(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'click-crisp':
      case 'click-sharp':
      case 'click-light':
      case 'click-heavy':
        this.synthClickSwitch(destination, now, pitchMultiplier, gainScale, soundId, decayMs);
        break;

      case 'classic-typewriter':
      case 'classic-vintage-typewriter':
        this.synthTypewriter(destination, now, pitchMultiplier, gainScale, soundId, decayMs);
        break;

      case 'classic-retro-keyboard':
        this.synthModelM(destination, now, pitchMultiplier, gainScale, decayMs);
        break;

      case 'gaming-mech':
      case 'gaming-rapid-click':
      case 'gaming-esports':
      case 'gaming-rgb':
        this.synthGamingSwitch(destination, now, pitchMultiplier, gainScale, soundId, decayMs);
        break;

      case 'future-scifi':
      case 'future-cyber':
      case 'future-digital':
      case 'future-robotic':
      case 'future-holographic':
        this.synthFuturistic(destination, now, pitchMultiplier, gainScale, soundId, decayMs);
        break;

      case 'ambient-rain':
      case 'ambient-wooden':
      case 'ambient-glassy':
      case 'ambient-soft':
      default:
        this.synthAmbient(destination, now, pitchMultiplier, gainScale, soundId, decayMs);
        break;
    }
  }

  // Helper: Play a burst of filtered noise
  private playNoiseBurst(
    dest: AudioNode,
    startTime: number,
    freq: number,
    q: number,
    durationSec: number,
    gainLevel: number,
    type: BiquadFilterType = 'bandpass'
  ) {
    if (!this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;
    noise.playbackRate.value = 1.0;

    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, startTime);
    filter.Q.setValueAtTime(q, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(startTime);
    noise.stop(startTime + durationSec + 0.05);
  }

  // Blue Switch: Click Leaf (sharp click) + Bottom out clack + Spring Ping
  private synthBlueSwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.04, decayMs / 1000);

    // 1. Click leaf high impulse (3.8 kHz)
    this.playNoiseBurst(dest, now, 3800 * pitch, 8, 0.015, volume * 0.9, 'bandpass');

    // 2. Secondary release snap after 6ms
    this.playNoiseBurst(dest, now + 0.006, 4600 * pitch, 6, 0.018, volume * 0.7, 'bandpass');

    // 3. Bottom out clack (plastic plate hit 800 Hz)
    this.playNoiseBurst(dest, now + 0.002, 850 * pitch, 3, dur * 0.6, volume * 0.6, 'lowpass');

    // 4. Spring metallic ping (sine ringing at 1.4 kHz)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1420 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(1380 * pitch, now + dur);

    oscGain.gain.setValueAtTime(volume * 0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);
  }

  // Brown Switch: Mild tactile bump clack + dampened bottom out
  private synthBrownSwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.035, decayMs / 1000);
    // Tactile scrape (1.2 kHz)
    this.playNoiseBurst(dest, now, 1200 * pitch, 4, 0.012, volume * 0.45, 'bandpass');
    // Mild bottom out (650 Hz)
    this.playNoiseBurst(dest, now + 0.003, 650 * pitch, 2.5, dur, volume * 0.6, 'lowpass');
  }

  // Red Switch: Linear, zero tactile click, clean bottom out impact
  private synthRedSwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.03, decayMs / 1000);
    // Direct plastic stem contact (950 Hz)
    this.playNoiseBurst(dest, now, 950 * pitch, 3.5, 0.02, volume * 0.7, 'bandpass');
    // Body resonance (320 Hz)
    this.playNoiseBurst(dest, now, 320 * pitch, 1.8, dur, volume * 0.5, 'lowpass');
  }

  // Black Switch: Heavy linear, deep plate thud
  private synthBlackSwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.05, decayMs / 1000);
    this.playNoiseBurst(dest, now, 680 * pitch, 2.5, 0.025, volume * 0.75, 'bandpass');

    // Deep sub-impact
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(70 * pitch, now + dur);

    oscGain.gain.setValueAtTime(volume * 0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);
  }

  // Creamy Switch: Heavily lubed, rounded frequencies, soothing bottom out
  private synthCreamySwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.045, decayMs / 1000);
    // Lubed warm transient (720 Hz)
    this.playNoiseBurst(dest, now, 720 * pitch, 2.0, 0.025, volume * 0.6, 'bandpass');
    // Low body thud (220 Hz)
    this.playNoiseBurst(dest, now + 0.002, 220 * pitch, 1.4, dur, volume * 0.7, 'lowpass');
  }

  // Deep Thock: Legendary satisfying deep keyboard sound
  private synthDeepThock(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.06, decayMs / 1000);

    // 1. Crisp stem pop (1.1 kHz)
    this.playNoiseBurst(dest, now, 1100 * pitch, 3.0, 0.015, volume * 0.5, 'bandpass');

    // 2. Brass / aluminum desk resonance cavity (135 Hz)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(80 * pitch, now + dur);

    oscGain.gain.setValueAtTime(volume * 0.9, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);

    // 3. Dense warm air cavity impulse
    this.playNoiseBurst(dest, now, 280 * pitch, 1.6, dur * 0.8, volume * 0.65, 'lowpass');
  }

  // Soft Thock: Silicone dampened
  private synthSoftThock(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.05, decayMs / 1000);
    this.playNoiseBurst(dest, now, 420 * pitch, 1.8, 0.02, volume * 0.45, 'bandpass');

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(65 * pitch, now + dur);

    oscGain.gain.setValueAtTime(volume * 0.55, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);
  }

  // Creamy Thock: POM plate + PE foam tape mod sound
  private synthCreamyThock(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.065, decayMs / 1000);
    this.playNoiseBurst(dest, now, 860 * pitch, 2.8, 0.022, volume * 0.55, 'bandpass');

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(95 * pitch, now + dur);

    oscGain.gain.setValueAtTime(volume * 0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);
  }

  // Heavy Thock: 90 Hz sub-bass punch
  private synthHeavyThock(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.08, decayMs / 1000);
    this.playNoiseBurst(dest, now, 600 * pitch, 2.0, 0.03, volume * 0.7, 'bandpass');

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(50 * pitch, now + dur);

    oscGain.gain.setValueAtTime(volume * 1.0, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);
  }

  // Click variants: Crisp, Sharp, Light, Heavy
  private synthClickSwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    variant: string,
    decayMs: number
  ) {
    const dur = Math.max(0.025, decayMs / 1000);
    let freq = 4200;
    let q = 7;
    let boost = 0.8;

    if (variant === 'click-sharp') {
      freq = 5400;
      q = 9;
      boost = 0.95;
    } else if (variant === 'click-light') {
      freq = 3600;
      q = 5;
      boost = 0.5;
    } else if (variant === 'click-heavy') {
      freq = 2800;
      q = 4;
      boost = 1.0;
      this.playNoiseBurst(dest, now + 0.003, 450 * pitch, 2, dur, volume * 0.6, 'lowpass');
    }

    this.playNoiseBurst(dest, now, freq * pitch, q, dur, volume * boost, 'bandpass');
  }

  // Classic Typewriter: Metal hammer hit + platen thud + mechanical gear
  private synthTypewriter(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    variant: string,
    decayMs: number
  ) {
    const dur = Math.max(0.06, decayMs / 1000);
    // 1. High metal hammer strike (2.8 kHz triangle)
    const hammer = this.ctx.createOscillator();
    const hammerGain = this.ctx.createGain();
    hammer.type = 'triangle';
    const baseFreq = variant === 'classic-vintage-typewriter' ? 2400 : 3100;
    hammer.frequency.setValueAtTime(baseFreq * pitch, now);
    hammer.frequency.exponentialRampToValueAtTime(1800 * pitch, now + 0.02);

    hammerGain.gain.setValueAtTime(volume * 0.75, now);
    hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    hammer.connect(hammerGain);
    hammerGain.connect(dest);
    hammer.start(now);
    hammer.stop(now + 0.04);

    // 2. Platen cylinder dull thump (180 Hz)
    this.playNoiseBurst(dest, now + 0.003, 240 * pitch, 2, dur, volume * 0.8, 'lowpass');

    // 3. Metallic link bar rattle
    this.playNoiseBurst(dest, now + 0.008, 1600 * pitch, 5, 0.04, volume * 0.4, 'bandpass');
  }

  // IBM Model M Buckling Spring: Buckle snap + characteristic 2.2 kHz spring ping
  private synthModelM(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    decayMs: number
  ) {
    const dur = Math.max(0.08, decayMs / 1000);
    // 1. Initial buckle snap (2.6 kHz)
    this.playNoiseBurst(dest, now, 2600 * pitch, 6, 0.015, volume * 0.85, 'bandpass');

    // 2. Legendary coiled spring acoustic ring (2.2 kHz sine with slow decay)
    const spring = this.ctx.createOscillator();
    const springGain = this.ctx.createGain();
    spring.type = 'sine';
    spring.frequency.setValueAtTime(2230 * pitch, now);
    spring.frequency.exponentialRampToValueAtTime(2180 * pitch, now + dur);

    springGain.gain.setValueAtTime(volume * 0.45, now);
    springGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    spring.connect(springGain);
    springGain.connect(dest);
    spring.start(now);
    spring.stop(now + dur);

    // 3. Heavy industrial plastic case impact (400 Hz)
    this.playNoiseBurst(dest, now + 0.004, 400 * pitch, 2.2, 0.045, volume * 0.7, 'lowpass');
  }

  // Gaming switches: Snappy, ultra-short travel, bright
  private synthGamingSwitch(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    variant: string,
    decayMs: number
  ) {
    const dur = Math.max(0.025, decayMs / 1000);
    let freq = 3200;
    if (variant === 'gaming-rapid-click') freq = 4400;
    if (variant === 'gaming-esports') freq = 3800;
    if (variant === 'gaming-rgb') freq = 2600;

    this.playNoiseBurst(dest, now, freq * pitch, 5.5, dur, volume * 0.8, 'bandpass');
    this.playNoiseBurst(dest, now + 0.001, 750 * pitch, 2.5, dur * 0.8, volume * 0.5, 'lowpass');
  }

  // Futuristic: Cyber, Sci-Fi, Holographic
  private synthFuturistic(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    variant: string,
    decayMs: number
  ) {
    const dur = Math.max(0.05, decayMs / 1000);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    if (variant === 'future-cyber') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(220 * pitch, now + dur);
    } else if (variant === 'future-scifi') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(400 * pitch, now + dur);
    } else if (variant === 'future-holographic') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + dur);
    } else {
      // Digital / robotic
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(300 * pitch, now + 0.02);
    }

    oscGain.gain.setValueAtTime(volume * 0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + dur);

    this.playNoiseBurst(dest, now, 3200 * pitch, 4, 0.012, volume * 0.4, 'bandpass');
  }

  // Ambient: Rain, Wooden marimba, Glassy, Soft
  private synthAmbient(
    dest: AudioNode,
    now: number,
    pitch: number,
    volume: number,
    variant: string,
    decayMs: number
  ) {
    const dur = Math.max(0.05, decayMs / 1000);

    if (variant === 'ambient-wooden') {
      // Marimba wooden bar strike
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(260 * pitch, now + dur);

      oscGain.gain.setValueAtTime(volume * 0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + dur);

      this.playNoiseBurst(dest, now, 800 * pitch, 3, 0.015, volume * 0.4, 'bandpass');
    } else if (variant === 'ambient-glassy') {
      // Crystal chime
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2093 * pitch, now); // C7

      oscGain.gain.setValueAtTime(volume * 0.55, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 1.5);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + dur * 1.5);
    } else if (variant === 'ambient-rain') {
      // Water droplet tap
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(600 * pitch, now + 0.03);

      oscGain.gain.setValueAtTime(volume * 0.6, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.04);
    } else {
      // Soft office membrane
      this.playNoiseBurst(dest, now, 500 * pitch, 1.5, dur, volume * 0.4, 'lowpass');
    }
  }
}
