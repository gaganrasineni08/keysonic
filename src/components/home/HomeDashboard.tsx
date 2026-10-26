import React from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import {
  Keyboard,
  Sliders,
  Volume2,
  VolumeX,
  Zap,
  Flame,
  Activity,
  ArrowRight,
  Shield,
  Disc,
  Play,
  Moon,
  Sparkles,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const {
    activeProfile,
    profiles,
    activateProfile,
    settings,
    updateSettings,
    lastPressedKey,
    lastSoundPlayed,
    wpm,
    energy,
    diagnostics,
    triggerKeyAction,
    previewSound
  } = useKeySonic();

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#12141c] via-[#151926] to-[#12141c] border border-cyan-500/20 shadow-2xl p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono tracking-wider uppercase text-emerald-400 font-bold">
                KEYSONIC ACOUSTIC ENGINE ACTIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              A Programmable Acoustic Layer for Any Keyboard
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Transform your physical laptop or desktop keyboard into a resonant custom mechanical build, vintage cast-iron typewriter, or futuristic cyberpunk console.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('studio')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Keyboard className="w-5 h-5" />
                Open Keyboard Studio
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('library')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all"
              >
                Browse 30+ Switches
              </button>
            </div>
          </div>

          {/* Active Profile HUD Card */}
          <div className="rounded-2xl bg-black/60 border border-white/10 p-6 flex flex-col gap-4 min-w-[280px] backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase text-slate-400">Current Profile</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                Active
              </span>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white">{activeProfile.name}</h2>
              <span className="text-xs font-mono text-cyan-400 mt-0.5">
                Mode {activeProfile.mappingMode} • {activeProfile.globalSoundId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
              <div>Volume: {activeProfile.volume}%</div>
              <div>Spatial: {activeProfile.spatialAudio}</div>
              <div>Adaptive: {activeProfile.adaptiveClack.enabled ? 'ON' : 'OFF'}</div>
              <div>Latency: {diagnostics.lastLatencyMs} ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Keyboard Activity & Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Last Keystroke */}
        <div className="rounded-2xl bg-[#12141c] border border-white/10 p-5 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Input</span>
            <Keyboard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-white">{lastPressedKey}</span>
            <span className="text-xs font-mono text-cyan-400 truncate">({lastSoundPlayed})</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Real-time physical keydown</span>
        </div>

        {/* Metric 2: Typing Speed (WPM) */}
        <div className="rounded-2xl bg-[#12141c] border border-white/10 p-5 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Typing Speed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-amber-400">{wpm}</span>
            <span className="text-xs font-mono text-slate-400">WPM</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Rolling 6s word window</span>
        </div>

        {/* Metric 3: Keystroke Energy */}
        <div className="rounded-2xl bg-[#12141c] border border-white/10 p-5 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Typing Energy</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-rose-400">{Math.round(energy * 100)}%</span>
            <span className="text-xs font-mono text-slate-400">Burst Density</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-100"
              style={{ width: `${Math.round(energy * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Audio Latency */}
        <div className="rounded-2xl bg-[#12141c] border border-white/10 p-5 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audio Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-emerald-400">{diagnostics.lastLatencyMs}</span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">Interactive Web Audio Buffer</span>
        </div>
      </div>

      {/* Quick Controls Deck */}
      <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Global Quick Audio Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Master Volume */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                Master Volume
              </span>
              <span className="font-mono text-cyan-400 font-bold">{settings.masterVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.masterVolume}
              onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
              className="accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              {settings.muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span className="text-xs font-semibold text-white">Mute Sound</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.muted}
                onChange={(e) => updateSettings({ muted: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* Smart Silent Mode */}
          <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Silent Mode</span>
                <span className="text-[10px] text-slate-500">No audio, input normal</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.silentMode}
                onChange={(e) => updateSettings({ silentMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Spatial Audio Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-pink-400" />
              Spatial Keyboard Audio
            </span>
            <select
              value={activeProfile.spatialAudio}
              onChange={(e) => {
                activateProfile(activeProfile.id);
              }}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="OFF">Spatial: OFF</option>
              <option value="LOW">Spatial: LOW</option>
              <option value="MEDIUM">Spatial: MEDIUM</option>
              <option value="HIGH">Spatial: HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Profiles Quick Switcher */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-wide">Recent Sound Profiles</h3>
          <button
            onClick={() => onNavigate('profiles')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            Manage Profiles <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.slice(0, 4).map(p => {
            const isActive = p.id === activeProfile.id;
            return (
              <div
                key={p.id}
                onClick={() => activateProfile(p.id)}
                className={`p-5 rounded-2xl bg-[#12141c] border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 hover:translate-y-[-2px] ${
                  isActive
                    ? 'border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                    : 'border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Mode {p.mappingMode} • {p.globalSoundId}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-500">
                  <span>Vol: {p.volume}%</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previewSound(p.globalSoundId);
                    }}
                    className="p-1 text-slate-400 hover:text-cyan-300"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
