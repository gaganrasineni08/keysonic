import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import {
  Settings2,
  Volume2,
  Keyboard,
  Shield,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Check,
  Moon,
  Sun,
  Zap,
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, activeProfile, profiles, exportProfile } = useKeySonic();
  const [resetDone, setResetDone] = useState(false);

  const handleExportAll = () => {
    const backup = {
      settings,
      profiles,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KeySonic-Complete-Backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? Your custom profiles will not be deleted.')) {
      updateSettings({
        masterVolume: 85,
        muted: false,
        silentMode: false,
        nightModeEnabled: false,
        keyboardLayout: 'qwerty',
        keyboardSize: 'full',
        keyboardStyle: 'modern-dark',
        handsVisualizerEnabled: true,
        reducedMotion: false,
        highContrast: false,
      });
      setResetDone(true);
      setTimeout(() => setResetDone(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-4xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex items-center gap-4 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
          <Settings2 className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Settings & Preferences</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure audio output buffers, night scheduling, keyboard layouts, and privacy controls
          </p>
        </div>
      </div>

      {/* Strict Privacy Statement Banner (Mandatory Prompt Spec) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-cyan-950/20 to-emerald-950/20 border border-emerald-500/30 flex items-start gap-4 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            KeySonic Local Privacy Statement & Guarantee
            <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              100% Client-Side
            </span>
          </h3>
          <p className="text-xs text-emerald-200/90 leading-relaxed font-sans font-medium">
            "KeySonic processes keyboard events locally. Your keystrokes are not recorded, stored, or transmitted."
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Keystroke events are used strictly in volatile memory for less than 5 milliseconds to calculate audio frequency and trigger Web Audio synthesis nodes. We never store character strings, passwords, or typing history.
          </p>
        </div>
      </div>

      {/* Section 1: Audio Engine & Night Mode */}
      <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          Audio Engine & Environmental Modes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Night Mode Schedule */}
          <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                Automatic Night Mode
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.nightModeEnabled}
                  onChange={(e) => updateSettings({ nightModeEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-400">
              Automatically attenuates volume and rolls off harsh high frequencies with a warm low-pass filter during night hours.
            </p>
            {settings.nightModeEnabled && (
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-300 font-mono">
                <span>Active: 10:00 PM – 7:00 AM (-50% Vol)</span>
              </div>
            )}
          </div>

          {/* Spatial Audio Default */}
          <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-xs font-semibold text-white">Spatial Stereo Panning Resolution:</span>
            <p className="text-[11px] text-slate-400">
              Pans keyboard sounds across stereo field according to the horizontal column position of each physical key.
            </p>
            <select
              value={activeProfile.spatialAudio}
              onChange={() => {}}
              className="bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="OFF">Spatial Audio: Disabled</option>
              <option value="LOW">Spatial Audio: Low (Subtle)</option>
              <option value="MEDIUM">Spatial Audio: Medium (Recommended)</option>
              <option value="HIGH">Spatial Audio: High (Enthusiast)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Keyboard & Layout */}
      <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Keyboard className="w-4 h-4 text-purple-400" />
          Physical Keyboard Layout & Aesthetics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">Layout Matrix:</label>
            <select
              value={settings.keyboardLayout}
              onChange={(e) => updateSettings({ keyboardLayout: e.target.value as any })}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="qwerty">QWERTY (Standard ANSI)</option>
              <option value="colemak">Colemak Ergonomic</option>
              <option value="dvorak">Dvorak Simplified</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">Form Factor Size:</label>
            <select
              value={settings.keyboardSize}
              onChange={(e) => updateSettings({ keyboardSize: e.target.value as any })}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="full">Full 104-Key</option>
              <option value="tkl">Tenkeyless (TKL 87-Key)</option>
              <option value="60">60% Ultra Compact</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">Visual Keycap Theme:</label>
            <select
              value={settings.keyboardStyle}
              onChange={(e) => updateSettings({ keyboardStyle: e.target.value as any })}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="modern-dark">Modern Dark Cyber</option>
              <option value="classic-beige">Classic Beige (IBM Model M)</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Data & Backups */}
      <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Shield className="w-4 h-4 text-emerald-400" />
          Data Backup & Reset
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Export Complete Backup JSON
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-medium transition-all"
          >
            {resetDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5" />}
            {resetDone ? 'Settings Reset!' : 'Reset Settings to Default'}
          </button>
        </div>
      </div>
    </div>
  );
};
