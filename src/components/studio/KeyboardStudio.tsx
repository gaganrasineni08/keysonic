import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { KeyboardVisualizer } from './KeyboardVisualizer';
import { ClassicHandsOverlay } from './ClassicHandsOverlay';
import { KeyConfigPanel } from './KeyConfigPanel';
import { MappingMode } from '../../types/keysonic';
import {
  Keyboard,
  Hand,
  Volume2,
  Power,
  Zap,
  Sliders,
  Sparkles,
  Check,
  Disc,
  Info,
  ShieldCheck
} from 'lucide-react';

const QUICK_PROFILES = [
  { id: 'profile-deep-thock', name: 'Holy Panda (Deep Thock)', icon: '🟣', desc: 'Resonant tactile cavity thock' },
  { id: 'profile-blue-switch', name: 'Cherry MX Blue', icon: '🔵', desc: 'Crisp loud clicky actuation' },
  { id: 'profile-creamy-thock', name: 'NovelKeys Cream', icon: '🟢', desc: 'Smooth lubed POM creamy clack' },
  { id: 'profile-brown-tactile', name: 'Cherry MX Brown', icon: '🟤', desc: 'Balanced office tactile bump' },
  { id: 'profile-black-heavy', name: 'Cherry MX Black', icon: '⚫', desc: 'Heavy linear plate bottom-out' },
  { id: 'profile-typewriter', name: 'Typewriter', icon: '🟡', desc: 'Vintage cast-iron impact & bell' },
  { id: 'profile-gaming', name: 'Tealios Linear', icon: '🔴', desc: 'Ultra-fast low latency gaming' },
  { id: 'profile-retro-ibm', name: 'Cyber RGB', icon: '⚪', desc: 'Snappy futuristic click' },
];

export const KeyboardStudio: React.FC = () => {
  const {
    activeProfile,
    profiles,
    activateProfile,
    updateActiveProfile,
    settings,
    updateSettings,
    previewSound,
    lastPressedKey,
    lastSoundPlayed,
    wpm,
    systemWideEnabled,
    systemWideConnected,
    toggleSystemWide,
    diagnostics
  } = useKeySonic();

  const [showHands, setShowHands] = useState<boolean>(true);
  const [showKeyInspector, setShowKeyInspector] = useState<boolean>(false);

  const handleModeChange = (mode: MappingMode) => {
    updateActiveProfile(prev => ({
      ...prev,
      mappingMode: mode,
    }));
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* ── SYSTEM-WIDE LAPTOP HERO STATUS BANNER ── */}
      <div className={`p-5 rounded-3xl border transition-all duration-300 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
        systemWideEnabled
          ? 'bg-gradient-to-r from-emerald-950/40 via-[#10191e] to-emerald-950/40 border-emerald-500/40 shadow-emerald-950/20'
          : 'bg-gradient-to-r from-rose-950/30 via-[#161214] to-rose-950/30 border-rose-500/30 shadow-rose-950/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            systemWideEnabled
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
          }`}>
            <Power className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {systemWideEnabled
                  ? 'System-Wide Laptop Sound: ACTIVE'
                  : 'System-Wide Laptop Sound: STOPPED'}
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                systemWideEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {systemWideEnabled ? 'Listening in all laptop apps' : 'Muted'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {systemWideEnabled
                ? 'Your keyboard makes sounds across EVERY app on your laptop (VS Code, Chrome, Terminal, Slack, etc.) until you stop it here.'
                : 'Global laptop keystrokes are paused. Click Resume below to re-enable sound across all applications.'}
            </p>
          </div>
        </div>

        {/* Master Stop / Resume Button */}
        <button
          onClick={() => toggleSystemWide()}
          className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 shrink-0 ${
            systemWideEnabled
              ? 'bg-rose-500 hover:bg-rose-400 text-black shadow-rose-500/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
          }`}
        >
          {systemWideEnabled ? '■ Stop System-Wide Sound' : '▶ Resume System-Wide Sound'}
        </button>
      </div>

      {/* ── QUICK SWITCH PROFILE PICKER ── */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          Quick Switch Switch Profile:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_PROFILES.map(item => {
            const isSelected = activeProfile.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  activateProfile(item.id);
                  const p = profiles.find(x => x.id === item.id);
                  if (p) previewSound(p.globalSoundId);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400'
                    : 'bg-[#12141c] border-white/5 hover:border-white/15 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg">{item.icon}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STUDIO TOOLBAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12141c] p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mapping Mode buttons */}
          <span className="text-xs text-slate-400 font-medium mr-1">Mode:</span>
          {(['A', 'B', 'C', 'D'] as MappingMode[]).map(m => {
            const labels = {
              A: 'Mode A (All Keys Same)',
              B: 'Mode B (Key Types)',
              C: 'Mode C (Key Groups)',
              D: 'Mode D (Custom Individual)'
            };
            const isSelected = activeProfile.mappingMode === m;
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {labels[m]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Hands Overlay Toggle */}
          <button
            onClick={() => setShowHands(prev => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showHands
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            {showHands ? 'Hide Typing Hands' : 'Show Typing Hands'}
          </button>

          {/* Key Inspector Toggle */}
          <button
            onClick={() => setShowKeyInspector(prev => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showKeyInspector
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {showKeyInspector ? 'Close Key Inspector' : 'Inspect Key Details'}
          </button>
        </div>
      </div>

      {/* ── CLASSIC HANDS OVERLAY ── */}
      {showHands && (
        <div className="w-full">
          <ClassicHandsOverlay />
        </div>
      )}

      {/* ── INTERACTIVE KEYBOARD MATRIX ── */}
      <div className="w-full">
        <KeyboardVisualizer />
      </div>

      {/* ── KEY INSPECTOR PANEL (IF TOGGLED OR MODE D) ── */}
      {showKeyInspector && (
        <div className="w-full max-w-4xl mx-auto">
          <KeyConfigPanel />
        </div>
      )}

      {/* ── CLEAN STATUS FOOTPRINT ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#12141c] p-4 rounded-2xl border border-white/10 text-xs font-mono">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Last Key Detected</span>
          <span className="text-white font-bold text-sm mt-0.5">{lastPressedKey}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Active Sound</span>
          <span className="text-cyan-400 font-bold text-sm mt-0.5 truncate">{lastSoundPlayed}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Typing Speed</span>
          <span className="text-amber-400 font-bold text-sm mt-0.5">{wpm} WPM</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Audio Latency</span>
          <span className="text-emerald-400 font-bold text-sm mt-0.5">{diagnostics.lastLatencyMs} ms</span>
        </div>
      </div>
    </div>
  );
};
