import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import {
  Sparkles,
  Zap,
  Activity,
  Flame,
  Smile,
  Compass,
  Laptop,
  Check,
  Play,
  RotateCcw,
  Sliders,
  Shield,
  Layers
} from 'lucide-react';

const MOODS = [
  { id: 'focus', name: 'Deep Focus', soundId: 'thock-soft', desc: 'Muted, soothing acoustic pad for non-intrusive flow state.' },
  { id: 'calm', name: 'Calm & Zen', soundId: 'ambient-wooden', desc: 'Organic wooden marimba tones for peaceful contemplation.' },
  { id: 'energetic', name: 'Hyper Energetic', soundId: 'mech-blue', desc: 'Crisp high-speed clicks with lively metallic snap.' },
  { id: 'retro', name: 'Retro Nostalgia', soundId: 'classic-retro-keyboard', desc: 'Buckling spring ping reminiscent of early computing.' },
  { id: 'gaming', name: 'Esports Gaming', soundId: 'gaming-mech', desc: 'Snappy optical linear switches for competitive twitch reflexes.' },
  { id: 'creative', name: 'Creative Muse', soundId: 'classic-vintage-typewriter', desc: 'Vintage iron hammer strikes for storytelling & writing.' },
  { id: 'night', name: 'Silent Night', soundId: 'ambient-soft', desc: 'Gentle membrane dampening for late-night typing.' },
];

const PERSONALITIES = [
  { id: 'quiet', name: 'Quiet & Polite', soundId: 'ambient-soft', vol: 40, desc: 'Soft and subtle, respectful of quiet rooms.' },
  { id: 'mechanical', name: 'Tactile Enthusiast', soundId: 'mech-brown', vol: 85, desc: 'Crisp and tactile, balanced and satisfying.' },
  { id: 'retro', name: 'Old School Hacker', soundId: 'classic-retro-keyboard', vol: 90, desc: 'Heavy buckling spring with resounding clatter.' },
  { id: 'futuristic', name: 'Cyberpunk Pilot', soundId: 'future-cyber', vol: 80, desc: 'Holographic ionized chirps and digital pulses.' },
  { id: 'heavy', name: 'Heavy Brass Thocker', soundId: 'thock-heavy', vol: 95, desc: 'Sub-bass bottom-out with massive acoustic weight.' },
];

const APP_SIMULATIONS = [
  { name: 'Visual Studio Code', process: 'code.exe', profile: 'Deep Thock', icon: '💻', desc: 'Thock switches tuned for fluid coding velocity.' },
  { name: 'Google Chrome', process: 'chrome.exe', profile: 'Creamy Thock', icon: '🌐', desc: 'Gentle tactile feedback for casual browsing.' },
  { name: 'Microsoft Word / Docs', process: 'word.exe', profile: 'Typewriter', icon: '📝', desc: 'Vintage mechanical impact for authored prose.' },
  { name: 'Steam / Game Client', process: 'steam.exe', profile: 'Gaming Esports', icon: '🎮', desc: 'Low-latency snappy clicks for rapid APM.' },
  { name: 'Terminal / Bash', process: 'alacritty.exe', profile: 'Retro Model M', icon: '📟', desc: 'IBM buckling spring clacks for terminal commands.' },
];

export const NovelFeaturesView: React.FC = () => {
  const {
    activeProfile,
    updateActiveProfile,
    sounds,
    createProfile,
    previewSound,
    triggerKeyAction,
    wpm,
    energy,
    sessionKeystrokes
  } = useKeySonic();

  const [activeSubTab, setActiveSubTab] = useState<'signature' | 'adaptive' | 'energy' | 'moods' | 'personality' | 'apps'>('signature');

  // Signature builder state
  const [sigBaseSound, setSigBaseSound] = useState(activeProfile.globalSoundId);
  const [sigSpaceSound, setSigSpaceSound] = useState(activeProfile.specialKeySounds.space || 'thock-heavy');
  const [sigEnterSound, setSigEnterSound] = useState(activeProfile.specialKeySounds.enter || 'click-heavy');
  const [sigAdaptive, setSigAdaptive] = useState(true);
  const [sigSpatial, setSigSpatial] = useState(true);
  const [sigCreatedSuccess, setSigCreatedSuccess] = useState(false);

  // Live test typing buffer for Adaptive Clack
  const [testText, setTestText] = useState('');

  const handleCreateSignature = () => {
    createProfile('My KeySonic Signature');
    updateActiveProfile(prev => ({
      ...prev,
      name: 'My KeySonic Signature',
      globalSoundId: sigBaseSound,
      specialKeySounds: {
        ...prev.specialKeySounds,
        space: sigSpaceSound,
        enter: sigEnterSound,
      },
      spatialAudio: sigSpatial ? 'HIGH' : 'OFF',
      adaptiveClack: {
        ...prev.adaptiveClack,
        enabled: sigAdaptive,
      },
    }));

    setSigCreatedSuccess(true);
    setTimeout(() => setSigCreatedSuccess(false), 2500);
  };

  const handleApplyMood = (soundId: string, name: string) => {
    updateActiveProfile(prev => ({
      ...prev,
      name: `Mood: ${name}`,
      globalSoundId: soundId,
    }));
    previewSound(soundId);
  };

  const handleApplyPersonality = (p: typeof PERSONALITIES[0]) => {
    updateActiveProfile(prev => ({
      ...prev,
      name: `Personality: ${p.name}`,
      globalSoundId: p.soundId,
      volume: p.vol,
    }));
    previewSound(p.soundId);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">KeySonic Innovations</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adaptive Clack, Typing Energy, Sound Evolution, Bespoke Signatures & Context-Aware Engine
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'signature', label: 'My Signature', icon: Sparkles },
          { id: 'adaptive', label: 'Adaptive Clack (WPM)', icon: Zap },
          { id: 'energy', label: 'Typing Energy', icon: Flame },
          { id: 'moods', label: 'Mood Profiles', icon: Smile },
          { id: 'personality', label: 'Keyboard Personality', icon: Compass },
          { id: 'apps', label: 'Application Profiles', icon: Laptop },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feature 1: My Signature */}
      {activeSubTab === 'signature' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Craft "My Signature" Acoustic Identity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compose your personal acoustic trademark combining your favorite primary switch, heavy spacebar bottom-out, enter clack, and adaptive speed dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Base Primary Switch:</label>
              <select
                value={sigBaseSound}
                onChange={(e) => setSigBaseSound(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                {sounds.map(s => (
                  <option key={s.id} value={s.id}>[{s.category}] {s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Spacebar Thock Switch:</label>
              <select
                value={sigSpaceSound}
                onChange={(e) => setSigSpaceSound(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                {sounds.map(s => (
                  <option key={s.id} value={s.id}>[{s.category}] {s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Enter Key Accent Clack:</label>
              <select
                value={sigEnterSound}
                onChange={(e) => setSigEnterSound(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                {sounds.map(s => (
                  <option key={s.id} value={s.id}>[{s.category}] {s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sigAdaptive}
                  onChange={(e) => setSigAdaptive(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                Include Adaptive Clack Speed Shifting
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sigSpatial}
                  onChange={(e) => setSigSpatial(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                Include High-Resolution Spatial Stereo Panning
              </label>
            </div>
          </div>

          <button
            onClick={handleCreateSignature}
            className="mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/20 active:scale-95"
          >
            {sigCreatedSuccess ? '✓ Signature Saved & Activated!' : 'Save & Activate "My Signature"'}
          </button>
        </div>
      )}

      {/* Feature 2: Adaptive Clack */}
      {activeSubTab === 'adaptive' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Adaptive Clack (Typing Speed System)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The acoustic switch dynamically sharpens, raises pitch, and adds brightness as your typing velocity increases!
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

          {/* Speed Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-xl border flex flex-col gap-1 ${wpm < 25 ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400' : 'bg-black/30 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">Tier 1: 0–25 WPM</span>
              <span className="text-sm font-bold text-white">Soft Mellow Clack</span>
              <span className="text-[11px] text-slate-400">Gentle casual typing tone</span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col gap-1 ${wpm >= 25 && wpm < 55 ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400' : 'bg-black/30 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">Tier 2: 25–55 WPM</span>
              <span className="text-sm font-bold text-white">Balanced Normal</span>
              <span className="text-[11px] text-slate-400">Crisp daily typing cadence</span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col gap-1 ${wpm >= 55 && wpm < 85 ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400' : 'bg-black/30 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">Tier 3: 55–85 WPM</span>
              <span className="text-sm font-bold text-white">Crisp Snappy Clack</span>
              <span className="text-[11px] text-slate-400">+1.0 st pitch boost</span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col gap-1 ${wpm >= 85 ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400' : 'bg-black/30 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] font-mono uppercase text-slate-400">Tier 4: 85+ WPM</span>
              <span className="text-sm font-bold text-white">Fast Hyper Clack</span>
              <span className="text-[11px] text-slate-400">+2.0 st & 40% brightness</span>
            </div>
          </div>

          {/* Live Typing Test Area */}
          <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Live Test Typing Playground:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Velocity:</span>
                <span className="font-mono text-base font-bold text-amber-400">{wpm} WPM</span>
              </div>
            </div>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Type quickly here to hear Adaptive Clack morph the sound in real time..."
              className="w-full h-24 bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none font-mono"
            />
          </div>
        </div>
      )}

      {/* Feature 3: Typing Energy & Evolution */}
      {activeSubTab === 'energy' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl">
          {/* Typing Energy */}
          <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  Typing Energy Engine
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyzes keystroke frequency in rapid bursts and pumps punch & harmonic body
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeProfile.typingEnergy.enabled}
                  onChange={(e) => updateActiveProfile(prev => ({
                    ...prev,
                    typingEnergy: { ...prev.typingEnergy, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Energy Intensity Multiplier:</span>
                <span className="font-mono text-rose-400 font-bold">{activeProfile.typingEnergy.intensity}%</span>
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

            {/* Live Meter */}
            <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400 whitespace-nowrap">Current Keystroke Energy:</span>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-100"
                  style={{ width: `${Math.round(energy * 100)}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-rose-400">{Math.round(energy * 100)}%</span>
            </div>
          </div>

          {/* Sound Evolution */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Sound Evolution (Session Warming)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulates acoustic switch break-in and thermal plate settling over long typing sessions
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeProfile.soundEvolution.enabled}
                  onChange={(e) => updateActiveProfile(prev => ({
                    ...prev,
                    soundEvolution: { ...prev.soundEvolution, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between text-xs bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-slate-400">Session Keystrokes Logged:</span>
              <span className="font-mono text-emerald-400 font-bold">{sessionKeystrokes} Keystrokes</span>
            </div>
          </div>
        </div>
      )}

      {/* Feature 4: Mood Profiles */}
      {activeSubTab === 'moods' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smile className="w-5 h-5 text-cyan-400" />
              Mood Acoustic Presets
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Align your keyboard soundscape with your current mental headspace and task.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOODS.map(mood => (
              <div
                key={mood.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{mood.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mood.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => previewSound(mood.soundId)}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    <Play className="w-3 h-3" /> Preview
                  </button>

                  <button
                    onClick={() => handleApplyMood(mood.soundId, mood.name)}
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition-all"
                  >
                    Set Mood
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 5: Keyboard Personality */}
      {activeSubTab === 'personality' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              Keyboard Personalities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              High-level UX abstractions transforming your physical typing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERSONALITIES.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{p.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => previewSound(p.soundId)}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    <Play className="w-3 h-3" /> Preview
                  </button>

                  <button
                    onClick={() => handleApplyPersonality(p)}
                    className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-500/30 transition-all"
                  >
                    Adopt Personality
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 6: Application-Specific Profiles */}
      {activeSubTab === 'apps' && (
        <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-cyan-400" />
              Application-Specific Profile Mappings
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically switch sound profiles when focusing specific applications.
            </p>
          </div>

          {/* Browser limitation transparent notice */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 flex items-start gap-3 text-xs leading-relaxed">
            <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Operating System Architectural Notice:</span>
              <p className="text-slate-300 mt-1">
                In standard web browsers, security isolation prevents JavaScript from reading active OS window focus across other desktop windows (e.g. VS Code, Chrome).
                In the upcoming **KeySonic Desktop App (Tauri / macOS / Windows)**, our native system hook daemon listens to active window events to switch profiles automatically. Below you can configure and simulate application association rules.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {APP_SIMULATIONS.map((app, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{app.process}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
                    Mapped: {app.profile}
                  </span>
                  <button
                    onClick={() => alert(`Simulated switching profile to: ${app.profile}`)}
                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/5"
                  >
                    Simulate Focus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
