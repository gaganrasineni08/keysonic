import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { SoundLayer } from '../../types/keysonic';
import {
  Sliders,
  Play,
  Save,
  Volume2,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Layers,
  Radio,
  Check
} from 'lucide-react';

export const SoundMixerView: React.FC = () => {
  const { sounds, previewSound, triggerKeyAction, createProfile, addCustomSound } = useKeySonic();

  const [layers, setLayers] = useState<SoundLayer[]>([
    {
      id: 'layer-click',
      soundId: 'mech-blue',
      name: 'Transient Click Leaf',
      volume: 60,
      pitch: 1.0,
      attack: 0,
      decay: 80,
      pan: -0.2,
      enabled: true,
    },
    {
      id: 'layer-thock',
      soundId: 'thock-deep',
      name: 'Resonant Plate Thock',
      volume: 45,
      pitch: -1.5,
      attack: 2,
      decay: 180,
      pan: 0.1,
      enabled: true,
    },
    {
      id: 'layer-spring',
      soundId: 'classic-retro-keyboard',
      name: 'Buckling Spring Ring',
      volume: 25,
      pitch: 2.0,
      attack: 4,
      decay: 220,
      pan: 0.4,
      enabled: true,
    },
  ]);

  const [customSoundName, setCustomSoundName] = useState('Custom Acoustic Composite');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdateLayer = (id: string, patch: Partial<SoundLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const handleAddLayer = () => {
    if (layers.length >= 6) return;
    const newL: SoundLayer = {
      id: `layer-${Date.now()}`,
      soundId: 'mech-creamy',
      name: `Layer ${layers.length + 1}`,
      volume: 40,
      pitch: 0,
      attack: 0,
      decay: 120,
      pan: 0,
      enabled: true,
    };
    setLayers(prev => [...prev, newL]);
  };

  const handleRemoveLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  // Test play combined composite mix
  const handleTestComposite = () => {
    layers.filter(l => l.enabled).forEach(layer => {
      previewSound(layer.soundId, layer.pitch, layer.volume / 100);
    });
  };

  // Save the custom mix as a new sound item and create a dedicated profile!
  const handleSaveMix = () => {
    const soundId = `custom-mix-${Date.now()}`;
    const newSoundItem = {
      id: soundId,
      name: customSoundName || 'Custom Mix',
      category: 'Custom' as const,
      description: `Bespoke multi-layer acoustic composite created in KeySonic Sound Mixer with ${layers.length} layers.`,
      tags: ['custom-mix', 'layered'],
      isCustom: true,
    };

    addCustomSound(newSoundItem);

    // Also offer creating a new dedicated profile
    createProfile(`Mix: ${customSoundName}`);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-500/10">
            <Sliders className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Sound Mixer & Multi-Layer Studio</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sculpt custom hybrid keyboard switches by mixing transients, plate resonances, and harmonic springs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestComposite}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-semibold text-xs transition-all shadow-lg shadow-purple-500/25 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Audition Mix
          </button>

          <button
            onClick={handleSaveMix}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saveSuccess ? 'Saved to Profiles!' : 'Save as Custom Profile'}
          </button>
        </div>
      </div>

      {/* Composite Name Editor */}
      <div className="bg-[#12141c] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4">
        <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">
          Composite Sound Name:
        </label>
        <input
          type="text"
          value={customSoundName}
          onChange={(e) => setCustomSoundName(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          placeholder="Name your custom switch mix..."
        />
        <button
          onClick={handleAddLayer}
          disabled={layers.length >= 6}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Layer ({layers.length}/6)
        </button>
      </div>

      {/* Layer Strips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layers.map((layer, idx) => {
          return (
            <div
              key={layer.id}
              className={`rounded-2xl bg-[#12141c] border transition-all p-5 flex flex-col gap-4 shadow-lg ${
                layer.enabled ? 'border-purple-500/30 shadow-purple-950/20' : 'border-white/5 opacity-60'
              }`}
            >
              {/* Layer Title & Controls */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-mono text-xs text-purple-300">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={layer.name}
                    onChange={(e) => handleUpdateLayer(layer.id, { name: e.target.value })}
                    className="bg-transparent text-xs font-bold text-white border-0 focus:outline-none focus:underline"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layer.enabled}
                      onChange={(e) => handleUpdateLayer(layer.id, { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>

                  {layers.length > 1 && (
                    <button
                      onClick={() => handleRemoveLayer(layer.id)}
                      className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                      title="Remove Layer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sound Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-400">Switch Voice:</span>
                <select
                  value={layer.soundId}
                  onChange={(e) => {
                    handleUpdateLayer(layer.id, { soundId: e.target.value });
                    previewSound(e.target.value, layer.pitch, layer.volume / 100);
                  }}
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {sounds.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#181924] text-white">
                      [{s.category}] {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faders */}
              <div className="flex flex-col gap-3 pt-2">
                {/* Volume Fader */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Layer Volume</span>
                    <span className="font-mono text-purple-400 font-bold">{layer.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.volume}
                    onChange={(e) => handleUpdateLayer(layer.id, { volume: Number(e.target.value) })}
                    className="accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Pitch Tuning */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Pitch Tuning</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {layer.pitch > 0 ? `+${layer.pitch}` : layer.pitch} st
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={layer.pitch}
                    onChange={(e) => handleUpdateLayer(layer.id, { pitch: Number(e.target.value) })}
                    className="accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Attack Transient */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Attack</span>
                    <span className="font-mono text-amber-400 font-bold">{layer.attack} ms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={layer.attack}
                    onChange={(e) => handleUpdateLayer(layer.id, { attack: Number(e.target.value) })}
                    className="accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Decay */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Decay</span>
                    <span className="font-mono text-emerald-400 font-bold">{layer.decay} ms</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="350"
                    step="5"
                    value={layer.decay}
                    onChange={(e) => handleUpdateLayer(layer.id, { decay: Number(e.target.value) })}
                    className="accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Stereo Pan */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Stereo Balance</span>
                    <span className="font-mono text-pink-400 font-bold">
                      {layer.pan === 0 ? 'Center' : layer.pan < 0 ? `${Math.round(Math.abs(layer.pan) * 100)}% L` : `${Math.round(layer.pan * 100)}% R`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={layer.pan}
                    onChange={(e) => handleUpdateLayer(layer.id, { pan: Number(e.target.value) })}
                    className="accent-pink-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Solo Audition button */}
              <button
                onClick={() => previewSound(layer.soundId, layer.pitch, layer.volume / 100)}
                className="mt-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/5"
              >
                <Play className="w-3 h-3" /> Solo Audition
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
