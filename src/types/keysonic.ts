export type MappingMode = 'A' | 'B' | 'C' | 'D'; // A: Same all keys, B: Different keys, C: Key groups, D: Individual

export type KeyGroupType =
  | 'letters'
  | 'numbers'
  | 'function'
  | 'modifiers'
  | 'navigation'
  | 'arrows'
  | 'spacebar'
  | 'enter'
  | 'backspace'
  | 'special';

export interface SoundLayer {
  id: string;
  soundId: string;
  name: string;
  volume: number; // 0 - 100
  pitch: number; // -12 to +12 semitones
  attack: number; // 0 - 100 ms
  decay: number; // 10 - 500 ms
  pan: number; // -1 (left) to 1 (right)
  enabled: boolean;
}

export interface RandomizedSoundEntry {
  soundId: string;
  name: string;
  weight: number; // 1 - 100
}

export interface KeySoundConfig {
  key: string; // Key identifier e.g. "KeyA", "Space", "Enter"
  label: string;
  soundId: string;
  volume: number; // 0 - 100
  pitch: number; // -12 to +12
  attack: number; // ms
  decay: number; // ms
  pan: number; // -1 to 1
  randomizationEnabled: boolean;
  randomizedSounds: RandomizedSoundEntry[];
  layeringEnabled: boolean;
  layers: SoundLayer[];
}

export type SoundCategory =
  | 'Mechanical'
  | 'Thock'
  | 'Click'
  | 'Classic'
  | 'Gaming'
  | 'Futuristic'
  | 'Ambient'
  | 'Custom';

export interface SoundItem {
  id: string;
  name: string;
  category: SoundCategory;
  description: string;
  isCustom?: boolean;
  audioUrl?: string; // For uploaded/recorded sounds
  isFavorite?: boolean;
  tags: string[];
}

export interface AdaptiveClackSettings {
  enabled: boolean;
  thresholdLow: number; // e.g. 20 WPM
  thresholdMedium: number; // e.g. 50 WPM
  thresholdHigh: number; // e.g. 80 WPM
  pitchBoostPerTier: number; // Semitones per tier
  brightnessBoost: number; // Filter boost percentage
}

export interface TypingEnergySettings {
  enabled: boolean;
  intensity: number; // 0 - 100%
  punchBoost: number; // 0 - 100%
}

export interface SoundEvolutionSettings {
  enabled: boolean;
  intensity: number; // 0 - 100%
  sessionKeystrokes: number;
}

export type SpatialAudioMode = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface KeySonicProfile {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  mappingMode: MappingMode;
  globalSoundId: string;
  groupMappings: Record<KeyGroupType, string>;
  keyMappings: Record<string, KeySoundConfig>;
  volume: number; // 0 - 100
  pitch: number; // -12 to 12
  randomizationEnabled: boolean;
  naturalVariation: boolean; // Subtle organic micro-variations
  spatialAudio: SpatialAudioMode;
  adaptiveClack: AdaptiveClackSettings;
  typingEnergy: TypingEnergySettings;
  soundEvolution: SoundEvolutionSettings;
  specialKeySounds: {
    space: string;
    enter: string;
    backspace: string;
    escape: string;
    tab: string;
    shift: string;
    modifier: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface AppProfileMapping {
  appName: string;
  processName: string;
  profileId: string;
  icon: string;
}

export interface SoundPack {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  previewSoundId: string;
  sounds: SoundItem[];
  defaultProfile: Partial<KeySonicProfile>;
}

export interface LatencyDiagnostic {
  lastLatencyMs: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  activeVoices: number;
  audioSampleRate: number;
  audioState: AudioContextState;
}

export interface AppSettings {
  masterVolume: number; // 0 - 100
  muted: boolean;
  silentMode: boolean; // Smart silent mode
  nightModeEnabled: boolean;
  nightModeSchedule: boolean;
  nightModeStartHour: number; // 21 (9 PM)
  nightModeEndHour: number; // 7 (7 AM)
  nightModeVolumeReduction: number; // e.g. 50%
  keyboardLayout: 'qwerty' | 'colemak' | 'dvorak';
  keyboardSize: '60' | '75' | 'tkl' | 'full';
  keyboardStyle: 'modern-dark' | 'classic-beige' | 'cyberpunk';
  handsVisualizerEnabled: boolean;
  handsVisualizerStyle: 'cyber-hologram' | 'classic-warm';
  reducedMotion: boolean;
  highContrast: boolean;
  largeUI: boolean;
  privacyAcknowledged: boolean;
  onboardingCompleted: boolean;
}
