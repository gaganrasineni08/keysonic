import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  KeySonicProfile,
  KeySoundConfig,
  SoundItem,
  AppSettings,
  LatencyDiagnostic,
  KeyGroupType,
  MappingMode,
  SoundPack,
} from '../types/keysonic';
import { BUILT_IN_SOUNDS } from '../audio/SoundLibraryData';
import { DEFAULT_PROFILES } from '../audio/DefaultProfiles';
import { AudioEngine } from '../audio/AudioEngine';

interface KeySonicContextType {
  // Profiles
  profiles: KeySonicProfile[];
  activeProfile: KeySonicProfile;
  activeProfileId: string;
  createProfile: (name: string, templateId?: string) => string;
  duplicateProfile: (profileId: string) => string;
  updateActiveProfile: (updater: (prev: KeySonicProfile) => KeySonicProfile) => void;
  deleteProfile: (profileId: string) => boolean;
  activateProfile: (profileId: string) => void;
  exportProfile: (profileId: string) => string;
  importProfile: (jsonString: string) => boolean;

  // Sound Library
  sounds: SoundItem[];
  favorites: string[];
  toggleFavorite: (soundId: string) => void;
  addCustomSound: (sound: SoundItem, audioData?: ArrayBuffer) => void;
  deleteCustomSound: (soundId: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;

  // Real-time Keystrokes & Live stats
  pressedKeys: Record<string, boolean>; // key code -> pressed
  lastPressedKey: string;
  lastSoundPlayed: string;
  wpm: number;
  energy: number;
  sessionKeystrokes: number;
  diagnostics: LatencyDiagnostic;

  // Studio Selection
  selectedKeyId: string | null;
  setSelectedKeyId: (keyId: string | null) => void;

  // System-Wide Daemon Status & Controls
  systemWideEnabled: boolean;
  systemWideConnected: boolean;
  toggleSystemWide: (enable?: boolean) => Promise<void>;

  // Actions
  triggerKeyAction: (keyCode: string, keyLabel?: string, xRatio?: number) => void;
  previewSound: (soundId: string, pitch?: number, vol?: number) => void;

  // Sound Packs
  soundPacks: SoundPack[];
  createSoundPack: (pack: SoundPack) => void;
  exportSoundPack: (packId: string) => string;
  importSoundPack: (jsonString: string) => boolean;

  // Onboarding
  completeOnboarding: () => void;
}

const KeySonicContext = createContext<KeySonicContextType | null>(null);

const SETTINGS_STORAGE_KEY = 'keysonic_settings_v1';
const PROFILES_STORAGE_KEY = 'keysonic_profiles_v1';
const ACTIVE_PROFILE_KEY = 'keysonic_active_profile_v1';
const FAVORITES_STORAGE_KEY = 'keysonic_favorites_v1';
const CUSTOM_SOUNDS_KEY = 'keysonic_custom_sounds_v1';

export const KeySonicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioEngine = useRef(AudioEngine.getInstance()).current;

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return {
      masterVolume: 85,
      muted: false,
      silentMode: false,
      nightModeEnabled: false,
      nightModeSchedule: true,
      nightModeStartHour: 22,
      nightModeEndHour: 7,
      nightModeVolumeReduction: 50,
      keyboardLayout: 'qwerty',
      keyboardSize: 'full',
      keyboardStyle: 'modern-dark',
      handsVisualizerEnabled: true,
      handsVisualizerStyle: 'classic-warm',
      reducedMotion: false,
      highContrast: false,
      largeUI: false,
      privacyAcknowledged: true,
      onboardingCompleted: true,
    };
  });

  // Profiles state
  const [profiles, setProfiles] = useState<KeySonicProfile[]>(() => {
    try {
      const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (stored) return stored;
    } catch (_) {}
    return 'profile-deep-thock';
  });

  // Favorites & Custom sounds
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return ['thock-deep', 'mech-blue', 'classic-typewriter', 'future-cyber', 'thock-creamy'];
  });

  const [customSounds, setCustomSounds] = useState<SoundItem[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_SOUNDS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  });

  // Sound packs
  const [soundPacks, setSoundPacks] = useState<SoundPack[]>([
    {
      id: 'pack-cyberpunk',
      name: 'Cyberpunk Odyssey',
      author: 'KeySonic Audio Labs',
      description: 'Ionized plasma chirps, holographic actuation, and sub-bass impact.',
      version: '1.2.0',
      previewSoundId: 'future-cyber',
      sounds: BUILT_IN_SOUNDS.filter(s => s.category === 'Futuristic'),
      defaultProfile: DEFAULT_PROFILES.find(p => p.id === 'profile-cyberpunk') || {},
    },
    {
      id: 'pack-vintage-platen',
      name: 'Vintage Platen 1934',
      author: 'Remington Sound Works',
      description: 'Heavy metal keys striking genuine rubberized platen cylinder with distinct bell harmonic.',
      version: '2.0.1',
      previewSoundId: 'classic-vintage-typewriter',
      sounds: BUILT_IN_SOUNDS.filter(s => s.category === 'Classic'),
      defaultProfile: DEFAULT_PROFILES.find(p => p.id === 'profile-typewriter') || {},
    },
  ]);

  // Real-time typing activity state
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [lastPressedKey, setLastPressedKey] = useState<string>('Space');
  const [lastSoundPlayed, setLastSoundPlayed] = useState<string>('Deep Thock');
  const [wpm, setWpm] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [sessionKeystrokes, setSessionKeystrokes] = useState<number>(0);
  const [diagnostics, setDiagnostics] = useState<LatencyDiagnostic>(() => audioEngine.getDiagnostics());
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>('Space');

  // System-wide daemon status & sync
  const [systemWideEnabled, setSystemWideEnabled] = useState<boolean>(true);
  const [systemWideConnected, setSystemWideConnected] = useState<boolean>(false);

  // Poll native macOS daemon on 127.0.0.1:6123
  useEffect(() => {
    const checkDaemon = async () => {
      try {
        const res = await fetch('http://127.0.0.1:6123/api/status', { mode: 'cors' });
        if (res.ok) {
          const data = await res.json();
          setSystemWideConnected(true);
          setSystemWideEnabled(data.enabled);
        } else {
          setSystemWideConnected(false);
        }
      } catch (_) {
        setSystemWideConnected(false);
      }
    };

    checkDaemon();
    const interval = setInterval(checkDaemon, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleSystemWide = async (enable?: boolean) => {
    const targetState = enable !== undefined ? enable : !systemWideEnabled;
    setSystemWideEnabled(targetState);
    try {
      const endpoint = targetState ? 'http://127.0.0.1:6123/api/enable' : 'http://127.0.0.1:6123/api/disable';
      await fetch(endpoint, { method: 'POST', mode: 'cors' });
    } catch (_) {}
  };

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (_) {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
    } catch (_) {}
    // Sync active profile to native macOS daemon
    fetch(`http://127.0.0.1:6123/api/set_profile?profile=${encodeURIComponent(activeProfileId)}`, { mode: 'cors' }).catch(() => {});
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(customSounds));
    } catch (_) {}
  }, [customSounds]);

  // Active Profile lookup
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];

  // Pre-initialize audio on user gesture
  useEffect(() => {
    const onUserInteraction = () => {
      audioEngine.initAudio();
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
    };
    window.addEventListener('pointerdown', onUserInteraction);
    window.addEventListener('keydown', onUserInteraction);
    return () => {
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
    };
  }, []);

  // Check night mode schedule
  const isNightTime = useCallback(() => {
    if (!settings.nightModeEnabled) return false;
    if (!settings.nightModeSchedule) return true;
    const hour = new Date().getHours();
    if (settings.nightModeStartHour > settings.nightModeEndHour) {
      return hour >= settings.nightModeStartHour || hour < settings.nightModeEndHour;
    }
    return hour >= settings.nightModeStartHour && hour < settings.nightModeEndHour;
  }, [settings]);

  // Sync master volume to audio engine and native daemon
  useEffect(() => {
    audioEngine.setMasterVolume(
      settings.masterVolume,
      settings.muted,
      settings.silentMode,
      isNightTime(),
      settings.nightModeVolumeReduction
    );
    const vol = settings.muted || settings.silentMode ? 0 : Math.round(settings.masterVolume);
    fetch(`http://127.0.0.1:6123/api/set_volume?vol=${vol}`, { mode: 'cors' }).catch(() => {});
  }, [settings.masterVolume, settings.muted, settings.silentMode, isNightTime, settings.nightModeVolumeReduction]);

  // Diagnostics interval
  useEffect(() => {
    const timer = setInterval(() => {
      setDiagnostics(audioEngine.getDiagnostics());
      setWpm(audioEngine.getWpm());
      setEnergy(audioEngine.getEnergy());
      setSessionKeystrokes(audioEngine.getSessionCount());
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Determine group of key code
  const getKeyGroup = useCallback((code: string): KeyGroupType => {
    if (code === 'Space') return 'spacebar';
    if (code === 'Enter' || code === 'NumpadEnter') return 'enter';
    if (code === 'Backspace') return 'backspace';
    if (code.startsWith('Key')) return 'letters';
    if (code.startsWith('Digit') || code.startsWith('Numpad')) return 'numbers';
    if (code.startsWith('F') && code.length <= 3) return 'function';
    if (['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'].includes(code)) return 'modifiers';
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) return 'arrows';
    if (['Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'].includes(code)) return 'navigation';
    return 'special';
  }, []);

  // Determine sound config for a given key
  const resolveSoundConfigForKey = useCallback((code: string, profile: KeySonicProfile): { soundId: string; config?: KeySoundConfig } => {
    const mode: MappingMode = profile.mappingMode;

    // Check individual override first if Mode D or present
    if (profile.keyMappings[code]) {
      return { soundId: profile.keyMappings[code].soundId, config: profile.keyMappings[code] };
    }

    if (mode === 'A') {
      // Same sound for all keys
      return { soundId: profile.globalSoundId };
    }

    if (mode === 'B') {
      // Different sound for different keys (Special / Number / Letter)
      if (code === 'Space' && profile.specialKeySounds.space) return { soundId: profile.specialKeySounds.space };
      if (code === 'Enter' && profile.specialKeySounds.enter) return { soundId: profile.specialKeySounds.enter };
      if (code === 'Backspace' && profile.specialKeySounds.backspace) return { soundId: profile.specialKeySounds.backspace };
      if (code === 'Escape' && profile.specialKeySounds.escape) return { soundId: profile.specialKeySounds.escape };
      if (code.startsWith('Digit')) return { soundId: profile.groupMappings.numbers || profile.globalSoundId };
      if (code.startsWith('Key')) return { soundId: profile.groupMappings.letters || profile.globalSoundId };
      return { soundId: profile.globalSoundId };
    }

    if (mode === 'C') {
      // Key groups
      const group = getKeyGroup(code);
      const groupSound = profile.groupMappings[group] || profile.globalSoundId;
      return { soundId: groupSound };
    }

    // Default fallback
    return { soundId: profile.globalSoundId };
  }, [getKeyGroup]);

  // Trigger key playback and visual animation
  const triggerKeyAction = useCallback((keyCode: string, keyLabel?: string, xRatio = 0.5) => {
    const label = keyLabel || keyCode.replace('Key', '');
    setLastPressedKey(label);

    // Update metrics
    const metrics = audioEngine.recordKeystroke();
    setWpm(metrics.wpm);
    setEnergy(metrics.energy);
    setSessionKeystrokes(metrics.sessionCount);

    // Resolve sound
    const { soundId, config } = resolveSoundConfigForKey(keyCode, activeProfile);
    const soundItem = [...BUILT_IN_SOUNDS, ...customSounds].find(s => s.id === soundId);
    setLastSoundPlayed(soundItem?.name || soundId);

    // Play via engine
    audioEngine.playKey(keyCode, config, activeProfile, xRatio);

    // Update pressed visual state
    setPressedKeys(prev => ({ ...prev, [keyCode]: true }));
    setTimeout(() => {
      setPressedKeys(prev => {
        const next = { ...prev };
        delete next[keyCode];
        return next;
      });
    }, 150);
  }, [activeProfile, customSounds, resolveSoundConfigForKey]);

  // Preview sound
  const previewSound = useCallback((soundId: string, pitch = 0, vol = 0.8) => {
    audioEngine.previewSound(soundId, pitch, vol);
    const soundItem = [...BUILT_IN_SOUNDS, ...customSounds].find(s => s.id === soundId);
    if (soundItem) {
      setLastSoundPlayed(soundItem.name);
    }
  }, [customSounds]);

  // Global window keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting inside text inputs/textareas to allow natural typing without preventDefault
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // We still play the sound even in input! That's the core product: acoustic layer while typing!
      const code = e.code || e.key;

      // Approximate X ratio based on key code for spatial audio
      let xRatio = 0.5;
      if (['Escape', 'Tab', 'CapsLock', 'ShiftLeft', 'ControlLeft', 'KeyQ', 'KeyA', 'KeyZ', 'Digit1'].includes(code)) xRatio = 0.15;
      else if (['KeyW', 'KeyS', 'KeyX', 'KeyE', 'KeyD', 'KeyC', 'Digit2', 'Digit3'].includes(code)) xRatio = 0.3;
      else if (['KeyR', 'KeyF', 'KeyV', 'KeyT', 'KeyG', 'KeyB', 'Digit4', 'Digit5'].includes(code)) xRatio = 0.45;
      else if (['KeyY', 'KeyH', 'KeyN', 'KeyU', 'KeyJ', 'KeyM', 'Digit6', 'Digit7'].includes(code)) xRatio = 0.55;
      else if (['KeyI', 'KeyK', 'KeyO', 'KeyL', 'Digit8', 'Digit9'].includes(code)) xRatio = 0.7;
      else if (['KeyP', 'Semicolon', 'Quote', 'Enter', 'Backspace', 'ShiftRight', 'Digit0'].includes(code)) xRatio = 0.85;

      triggerKeyAction(code, e.key, xRatio);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code || e.key;
      setPressedKeys(prev => {
        const next = { ...prev };
        delete next[code];
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerKeyAction]);

  // Profile actions
  const createProfile = useCallback((name: string, templateId?: string): string => {
    const template = templateId ? profiles.find(p => p.id === templateId) : activeProfile;
    const newProfile: KeySonicProfile = {
      ...(template || DEFAULT_PROFILES[0]),
      id: `profile-${Date.now()}`,
      name: name.trim() || 'New Profile',
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
    return newProfile.id;
  }, [activeProfile, profiles]);

  const duplicateProfile = useCallback((profileId: string): string => {
    const target = profiles.find(p => p.id === profileId) || activeProfile;
    const duplicated: KeySonicProfile = {
      ...JSON.parse(JSON.stringify(target)),
      id: `profile-${Date.now()}`,
      name: `${target.name} (Copy)`,
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProfiles(prev => [duplicated, ...prev]);
    setActiveProfileId(duplicated.id);
    return duplicated.id;
  }, [activeProfile, profiles]);

  const updateActiveProfile = useCallback((updater: (prev: KeySonicProfile) => KeySonicProfile) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        const updated = updater(p);
        return { ...updated, updatedAt: Date.now() };
      }
      return p;
    }));
  }, [activeProfileId]);

  const deleteProfile = useCallback((profileId: string): boolean => {
    if (profiles.length <= 1) return false;
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    if (activeProfileId === profileId) {
      const remaining = profiles.filter(p => p.id !== profileId);
      setActiveProfileId(remaining[0].id);
    }
    return true;
  }, [activeProfileId, profiles]);

  const activateProfile = useCallback((profileId: string) => {
    if (profiles.some(p => p.id === profileId)) {
      setActiveProfileId(profileId);
    }
  }, [profiles]);

  const exportProfile = useCallback((profileId: string): string => {
    const target = profiles.find(p => p.id === profileId) || activeProfile;
    return JSON.stringify(target, null, 2);
  }, [activeProfile, profiles]);

  const importProfile = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !parsed.name || !parsed.globalSoundId) {
        return false;
      }
      const imported: KeySonicProfile = {
        ...DEFAULT_PROFILES[0],
        ...parsed,
        id: `profile-imported-${Date.now()}`,
        name: parsed.name ? `${parsed.name} (Imported)` : 'Imported Profile',
        isDefault: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setProfiles(prev => [imported, ...prev]);
      setActiveProfileId(imported.id);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  // Favorites & custom sounds
  const toggleFavorite = useCallback((soundId: string) => {
    setFavorites(prev =>
      prev.includes(soundId) ? prev.filter(id => id !== soundId) : [...prev, soundId]
    );
  }, []);

  const addCustomSound = useCallback((sound: SoundItem, audioData?: ArrayBuffer) => {
    setCustomSounds(prev => [sound, ...prev]);
    if (audioData) {
      audioEngine.decodeAndRegisterAudio(sound.id, audioData).catch(console.error);
    }
  }, []);

  const deleteCustomSound = useCallback((soundId: string) => {
    setCustomSounds(prev => prev.filter(s => s.id !== soundId));
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const completeOnboarding = useCallback(() => {
    updateSettings({ onboardingCompleted: true });
  }, [updateSettings]);

  // Sound pack actions
  const createSoundPack = useCallback((pack: SoundPack) => {
    setSoundPacks(prev => [pack, ...prev]);
  }, []);

  const exportSoundPack = useCallback((packId: string): string => {
    const pack = soundPacks.find(p => p.id === packId);
    return JSON.stringify(pack || {}, null, 2);
  }, [soundPacks]);

  const importSoundPack = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.name || !Array.isArray(parsed.sounds)) return false;
      const imported: SoundPack = {
        ...parsed,
        id: `pack-${Date.now()}`,
      };
      setSoundPacks(prev => [imported, ...prev]);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  const allSounds = [...BUILT_IN_SOUNDS, ...customSounds];

  return (
    <KeySonicContext.Provider
      value={{
        profiles,
        activeProfile,
        activeProfileId,
        createProfile,
        duplicateProfile,
        updateActiveProfile,
        deleteProfile,
        activateProfile,
        exportProfile,
        importProfile,
        sounds: allSounds,
        favorites,
        toggleFavorite,
        addCustomSound,
        deleteCustomSound,
        settings,
        updateSettings,
        pressedKeys,
        lastPressedKey,
        lastSoundPlayed,
        wpm,
        energy,
        sessionKeystrokes,
        diagnostics,
        selectedKeyId,
        setSelectedKeyId,
        systemWideEnabled,
        systemWideConnected,
        toggleSystemWide,
        triggerKeyAction,
        previewSound,
        soundPacks,
        createSoundPack,
        exportSoundPack,
        importSoundPack,
        completeOnboarding,
      }}
    >
      {children}
    </KeySonicContext.Provider>
  );
};

export const useKeySonic = (): KeySonicContextType => {
  const context = useContext(KeySonicContext);
  if (!context) {
    throw new Error('useKeySonic must be used within a KeySonicProvider');
  }
  return context;
};
