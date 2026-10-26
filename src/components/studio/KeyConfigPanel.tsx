import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { KeySoundConfig, SoundLayer, RandomizedSoundEntry } from '../../types/keysonic';
import {
  Volume2,
  Sliders,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Check,
  Disc,
  Radio
} from 'lucide-react';

export const KeyConfigPanel: React.FC = () => {
  const {
    selectedKeyId,
    activeProfile,
    updateActiveProfile,
    sounds,
    triggerKeyAction,
    previewSound,
  } = useKeySonic();

  if (!selectedKeyId) {
    return (
      <div className="h-full rounded-2xl bg-[#12141c] border border-white/5 p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <Disc className="w-10 h-10 mb-3 opacity-30 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Select any key to configure</p>
        <p className="text-xs text-slate-600 mt-1">Click a keycap on the interactive keyboard to inspect its acoustic properties</p>
      </div>
    );
  }

  // Get or initialize config for current selected key
  const existingConfig = activeProfile.keyMappings[selectedKeyId];
  const currentSoundId = existingConfig?.soundId || activeProfile.globalSoundId;
  const currentVolume = existingConfig?.volume ?? activeProfile.volume;
  const currentPitch = existingConfig?.pitch ?? activeProfile.pitch;
  const currentAttack = existingConfig?.attack ?? 0;
  const currentDecay = existingConfig?.decay ?? 120;
  const currentPan = existingConfig?.pan ?? 0;
  const isRandomEnabled = existingConfig?.randomizationEnabled ?? false;
  const randomizedSounds: RandomizedSoundEntry[] = existingConfig?.randomizedSounds ?? [
    { soundId: currentSoundId, name: sounds.find(s => s.id === currentSoundId)?.name || 'Primary', weight: 60 },
    { soundId: 'thock-deep', name: 'Deep Thock', weight: 40 }
  ];
  const isLayeringEnabled = existingConfig?.layeringEnabled ?? false;
  const layers: SoundLayer[] = existingConfig?.layers ?? [
    { id: 'layer-1', soundId: currentSoundId, name: 'Primary Click', volume: 80, pitch: 0, attack: 0, decay: 120, pan: 0, enabled: true },
    { id: 'layer-2', soundId: 'thock-deep', name: 'Acoustic Body Thock', volume: 40, pitch: -2, attack: 2, decay: 160, pan: 0, enabled: true }
  ];

  // Handler to update key config in active profile
  const updateConfig = (patch: Partial<KeySoundConfig>) => {
    updateActiveProfile(prev => {
      const prevConfig = prev.keyMappings[selectedKeyId] || {
        key: selectedKeyId,
        label: selectedKeyId.replace('Key', ''),
        soundId: currentSoundId,
        volume: currentVolume,
        pitch: currentPitch,
        attack: currentAttack,
        decay: currentDecay,
        pan: currentPan,
        randomizationEnabled: isRandomEnabled,
        randomizedSounds,
        layeringEnabled: isLayeringEnabled,
        layers,
      };

      return {
        ...prev,
        keyMappings: {
          ...prev.keyMappings,
          [selectedKeyId]: {
            ...prevConfig,
            ...patch,
          }
        }
      };
    });
  };

  const handleTestKey = () => {
    triggerKeyAction(selectedKeyId);
  };

  const handleAddRandomSound = () => {
    const newEntry: RandomizedSoundEntry = {
      soundId: 'mech-blue',
      name: 'Blue Switch',
      weight: 30,
    };
    updateConfig({
      randomizedSounds: [...randomizedSounds, newEntry]
    });
  };

  const handleRemoveRandomSound = (index: number) => {
    const next = [...randomizedSounds];
    next.splice(index, 1);
    updateConfig({ randomizedSounds: next });
  };

  const handleAddLayer = () => {
    const newLayer: SoundLayer = {
      id: `layer-${Date.now()}`,
      soundId: 'mech-creamy',
      name: `Layer ${layers.length + 1}`,
      volume: 50,
      pitch: 0,
      attack: 0,
      decay: 140,
      pan: 0,
      enabled: true,
    };
    updateConfig({ layers: [...layers, newLayer] });
  };

  const handleRemoveLayer = (id: string) => {
    updateConfig({ layers: layers.filter(l => l.id !== id) });
  };

  const handleUpdateLayer = (id: string, patch: Partial<SoundLayer>) => {
    updateConfig({
      layers: layers.map(l => l.id === id ? { ...l, ...patch } : l)
    });
  };

  const keyDisplayLabel = selectedKeyId.replace('Key', '').toUpperCase();

  return (
    <div className="rounded-2xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl overflow-y-auto max-h-[820px]">
      {/* Header with Key Badge and Test Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-lg text-cyan-400 shadow-lg shadow-cyan-500/10">
            {keyDisplayLabel}
          </div>
          <div>
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              Key Inspector: <span className="font-mono text-cyan-400">{selectedKeyId}</span>
            </h4>
            <p className="text-xs text-slate-400">
              Customize acoustic parameters, multi-sound layering, and random variance
            </p>
          </div>
        </div>

        <button
          onClick={handleTestKey}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Test Keystroke
        </button>
      </div>

      {/* Primary Sound Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Assigned Sound Switch</span>
          <span className="text-[11px] text-cyan-400 font-normal">
            Category: {sounds.find(s => s.id === currentSoundId)?.category || 'Custom'}
          </span>
        </label>
        <div className="flex gap-2">
          <select
            value={currentSoundId}
            onChange={(e) => {
              updateConfig({ soundId: e.target.value });
              previewSound(e.target.value);
            }}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {sounds.map(s => (
              <option key={s.id} value={s.id} className="bg-[#181924] text-white">
                [{s.category}] {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => previewSound(currentSoundId, currentPitch, currentVolume / 100)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 transition-all border border-white/10"
            title="Preview Sound"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Acoustic Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
        {/* Volume Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              Volume
            </span>
            <span className="font-mono text-cyan-400 font-bold">{currentVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentVolume}
            onChange={(e) => updateConfig({ volume: Number(e.target.value) })}
            className="accent-cyan-400 w-full cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Pitch Shift */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Pitch Tuning
            </span>
            <span className="font-mono text-purple-400 font-bold">
              {currentPitch > 0 ? `+${currentPitch}` : currentPitch} st
            </span>
          </div>
          <input
            type="range"
            min="-12"
            max="12"
            step="0.5"
            value={currentPitch}
            onChange={(e) => updateConfig({ pitch: Number(e.target.value) })}
            className="accent-purple-400 w-full cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Attack */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Attack Transient</span>
            <span className="font-mono text-amber-400 font-bold">{currentAttack} ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={currentAttack}
            onChange={(e) => updateConfig({ attack: Number(e.target.value) })}
            className="accent-amber-400 w-full cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Decay */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Decay / Release</span>
            <span className="font-mono text-emerald-400 font-bold">{currentDecay} ms</span>
          </div>
          <input
            type="range"
            min="20"
            max="400"
            step="5"
            value={currentDecay}
            onChange={(e) => updateConfig({ decay: Number(e.target.value) })}
            className="accent-emerald-400 w-full cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Stereo Pan */}
        <div className="sm:col-span-2 flex flex-col gap-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-pink-400" />
              Stereo Position Pan
            </span>
            <span className="font-mono text-pink-400 font-bold">
              {currentPan === 0 ? 'Center' : currentPan < 0 ? `${Math.round(Math.abs(currentPan) * 100)}% Left` : `${Math.round(currentPan * 100)}% Right`}
            </span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={currentPan}
            onChange={(e) => updateConfig({ pan: Number(e.target.value) })}
            className="accent-pink-400 w-full cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Left</span>
            <span>Center</span>
            <span>Right</span>
          </div>
        </div>
      </div>

      {/* Randomized Sound Engine */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-purple-950/10 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-white">Randomized Sound Variations</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isRandomEnabled}
              onChange={(e) => updateConfig({ randomizationEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <p className="text-[11px] text-slate-400">
          Randomly selects among multiple sounds on each press according to custom probability weights.
        </p>

        {isRandomEnabled && (
          <div className="flex flex-col gap-2 mt-1">
            {randomizedSounds.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5 text-xs">
                <select
                  value={item.soundId}
                  onChange={(e) => {
                    const next = [...randomizedSounds];
                    next[idx].soundId = e.target.value;
                    next[idx].name = sounds.find(s => s.id === e.target.value)?.name || e.target.value;
                    updateConfig({ randomizedSounds: next });
                  }}
                  className="flex-1 bg-transparent text-white border-0 focus:outline-none"
                >
                  {sounds.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#181924] text-white">
                      {s.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">Weight:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={item.weight}
                    onChange={(e) => {
                      const next = [...randomizedSounds];
                      next[idx].weight = Number(e.target.value);
                      updateConfig({ randomizedSounds: next });
                    }}
                    className="w-12 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-center font-mono text-purple-300 text-xs"
                  />
                  <span className="text-[10px] text-slate-500">%</span>
                </div>

                {randomizedSounds.length > 1 && (
                  <button
                    onClick={() => handleRemoveRandomSound(idx)}
                    className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddRandomSound}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs transition-all mt-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Sound Variation
            </button>
          </div>
        )}
      </div>

      {/* Sound Layering System */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-cyan-950/10 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">Multi-Sound Layering</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isLayeringEnabled}
              onChange={(e) => updateConfig({ layeringEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>

        <p className="text-[11px] text-slate-400">
          Combines and fires multiple acoustic layers simultaneously (e.g. Mechanical Click 60% + Deep Thock 40%).
        </p>

        {isLayeringEnabled && (
          <div className="flex flex-col gap-3 mt-1">
            {layers.map((layer, idx) => (
              <div key={layer.id} className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-semibold text-white">{layer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 cursor-pointer text-[11px] text-slate-400">
                      <input
                        type="checkbox"
                        checked={layer.enabled}
                        onChange={(e) => handleUpdateLayer(layer.id, { enabled: e.target.checked })}
                        className="rounded accent-cyan-400"
                      />
                      Active
                    </label>
                    {layers.length > 1 && (
                      <button
                        onClick={() => handleRemoveLayer(layer.id)}
                        className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={layer.soundId}
                    onChange={(e) => {
                      const soundName = sounds.find(s => s.id === e.target.value)?.name || e.target.value;
                      handleUpdateLayer(layer.id, { soundId: e.target.value, name: soundName });
                    }}
                    className="col-span-2 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {sounds.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#181924] text-white">
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Vol:</span>
                      <span className="font-mono text-cyan-300 font-bold">{layer.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.volume}
                      onChange={(e) => handleUpdateLayer(layer.id, { volume: Number(e.target.value) })}
                      className="accent-cyan-400 h-1 bg-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Pitch:</span>
                      <span className="font-mono text-purple-300 font-bold">{layer.pitch} st</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={layer.pitch}
                      onChange={(e) => handleUpdateLayer(layer.id, { pitch: Number(e.target.value) })}
                      className="accent-purple-400 h-1 bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}

            {layers.length < 4 && (
              <button
                onClick={handleAddLayer}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Acoustic Layer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
