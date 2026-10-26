import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import {
  Power,
  Zap,
  Sliders,
  Upload,
  Mic,
  Shield,
  Volume2,
  Moon,
  Radio,
  Check,
  RefreshCw,
  Terminal,
  Activity
} from 'lucide-react';

export const CustomizerView: React.FC = () => {
  const {
    activeProfile,
    updateActiveProfile,
    settings,
    updateSettings,
    systemWideEnabled,
    systemWideConnected,
    toggleSystemWide,
    addCustomSound,
    wpm,
    energy
  } = useKeySonic();

  const [activeSubTab, setActiveSubTab] = useState<'system' | 'adaptive' | 'upload' | 'preferences'>('system');
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;
    try {
      const arrayBuffer = await uploadFile.arrayBuffer();
      const soundItem = {
        id: `custom-${Date.now()}`,
        name: uploadName || uploadFile.name,
        category: 'Custom' as const,
        description: 'Custom imported audio file.',
        tags: ['custom', 'user-upload'],
        isCustom: true,
      };
      addCustomSound(soundItem, arrayBuffer);
      setUploadSuccess(true);
      setUploadFile(null);
      setUploadName('');
      setTimeout(() => setUploadSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-4xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Customizer & System Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage system-wide laptop audio, speed-reactive dynamics, and audio preferences
          </p>
        </div>

        {/* Master System-Wide Button */}
        <button
          onClick={() => toggleSystemWide()}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
            systemWideEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {systemWideEnabled ? 'System-Wide: ACTIVE' : 'System-Wide: STOPPED'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'system', label: 'System-Wide Laptop Mode', icon: Power },
          { id: 'adaptive', label: 'Adaptive Speed & Energy', icon: Zap },
          { id: 'upload', label: 'Upload Custom Sounds', icon: Upload },
          { id: 'preferences', label: 'Audio Preferences', icon: Sliders },
        ].map(t => {
          const Icon = t.icon;
          const isSelected = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── SUB-TAB 1: SYSTEM-WIDE LAPTOP MODE ── */}
      {activeSubTab === 'system' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Power className="w-4 h-4 text-emerald-400" />
                Global Laptop Keystroke Audio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enables keyboard sounds across every single application on your laptop (VS Code, Chrome, Slack, Notes, Terminal, etc.)
              </p>
            </div>

            <button
              onClick={() => toggleSystemWide()}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                systemWideEnabled
                  ? 'bg-rose-500 hover:bg-rose-400 text-black shadow-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
              }`}
            >
              {systemWideEnabled ? 'Stop System-Wide Audio' : 'Start System-Wide Audio'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[11px] text-slate-500 font-mono">STATUS</span>
              <span className={`text-sm font-bold ${systemWideEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                {systemWideEnabled ? '● Active in All Apps' : '○ Paused'}
              </span>
              <span className="text-[10px] text-slate-400">Plays switch on every keystroke</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[11px] text-slate-500 font-mono">DAEMON CONNECTION</span>
              <span className="text-sm font-bold text-cyan-400">
                ● Connected (127.0.0.1:6123)
              </span>
              <span className="text-[10px] text-slate-400">Low-latency native bridge</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[11px] text-slate-500 font-mono">PRIVACY</span>
              <span className="text-sm font-bold text-emerald-400">
                100% Local Processing
              </span>
              <span className="text-[10px] text-slate-400">Zero text logging / telemetry</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
            <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">How System-Wide Audio Operates:</span>
              <p className="text-slate-400">
                KeySonic runs a lightweight compiled native macOS companion binary (<code className="text-cyan-300">keysonic-daemon</code>). It intercepts hardware key events using Apple's <code className="text-cyan-300">CGEventTap</code> and synthesizes acoustic audio instantly using CoreAudio without touching normal keyboard typing. You can stop or start it at any time directly from the button above.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: ADAPTIVE SPEED & ENERGY ── */}
      {activeSubTab === 'adaptive' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Adaptive Clack (Typing Speed System)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically sharpens frequency and elevates pitch as your typing speed accelerates
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeProfile.adaptiveClack.enabled}
                onChange={(e) => updateActiveProfile(prev => ({
                  ...prev,
                  adaptiveClack: { ...prev.adaptiveClack, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${wpm < 25 ? 'bg-amber-500/15 border-amber-500/50' : 'bg-black/40 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">0–25 WPM</span>
              <span className="text-xs font-bold text-white">Soft Mellow</span>
            </div>
            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${wpm >= 25 && wpm < 55 ? 'bg-amber-500/15 border-amber-500/50' : 'bg-black/40 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">25–55 WPM</span>
              <span className="text-xs font-bold text-white">Normal Clack</span>
            </div>
            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${wpm >= 55 && wpm < 85 ? 'bg-amber-500/15 border-amber-500/50' : 'bg-black/40 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">55–85 WPM</span>
              <span className="text-xs font-bold text-white">Crisp (+1 st)</span>
            </div>
            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${wpm >= 85 ? 'bg-amber-500/15 border-amber-500/50' : 'bg-black/40 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">85+ WPM</span>
              <span className="text-xs font-bold text-white">Fast (+2 st)</span>
            </div>
          </div>

          {/* Typing Energy */}
          <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Typing Energy Burst Multiplier</h4>
                <p className="text-[11px] text-slate-400">Boosts volume and body during intense typing bursts</p>
              </div>
              <span className="font-mono text-xs font-bold text-rose-400">{activeProfile.typingEnergy.intensity}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={activeProfile.typingEnergy.intensity}
              onChange={(e) => updateActiveProfile(prev => ({
                ...prev,
                typingEnergy: { ...prev.typingEnergy, intensity: Number(e.target.value) }
              }))}
              className="accent-rose-400 h-1.5 bg-slate-800"
            />
          </div>
        </div>
      )}

      {/* ── SUB-TAB 3: UPLOAD CUSTOM SOUNDS ── */}
      {activeSubTab === 'upload' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Upload Local Audio Files (WAV / MP3 / OGG)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add your own mechanical switch sound recordings to your library.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept="audio/wav,audio/mp3,audio/ogg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadFile(e.target.files[0]);
                  setUploadName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }}
              className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
            />

            {uploadFile && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-300 font-medium">Sound Name:</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            )}

            <button
              disabled={!uploadFile}
              onClick={handleUploadSubmit}
              className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold text-xs uppercase tracking-wider transition-all"
            >
              {uploadSuccess ? '✓ Saved to Sound Library!' : 'Upload & Register Sound'}
            </button>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 4: PREFERENCES & NIGHT MODE ── */}
      {activeSubTab === 'preferences' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              General Preferences
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Environment options and volume schedules
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Night mode */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-400" />
                  Scheduled Night Mode
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.nightModeEnabled}
                    onChange={(e) => updateSettings({ nightModeEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-400">
                Reduces volume by 50% and softens highs between 10:00 PM and 7:00 AM automatically.
              </p>
            </div>

            {/* Spatial audio */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-pink-400" />
                Spatial Stereo Panning
              </span>
              <p className="text-[11px] text-slate-400">
                Pans keys across left and right stereo channels based on physical column position.
              </p>
              <select
                value={activeProfile.spatialAudio}
                onChange={() => {}}
                className="bg-[#181a26] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="OFF">Disabled</option>
                <option value="LOW">Low (Subtle)</option>
                <option value="MEDIUM">Medium (Recommended)</option>
                <option value="HIGH">High (Enthusiast)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
