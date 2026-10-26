import React from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import {
  Keyboard,
  Disc,
  Sliders,
  Volume2,
  VolumeX,
  Zap,
  Power,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const {
    activeProfile,
    profiles,
    activateProfile,
    settings,
    updateSettings,
    systemWideEnabled,
    systemWideConnected,
    toggleSystemWide,
    diagnostics
  } = useKeySonic();

  const navItems = [
    { id: 'studio', label: 'Keyboard Studio', icon: Keyboard },
    { id: 'library', label: 'Sound Library', icon: Disc },
    { id: 'customize', label: 'Customizer & Settings', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0b0e]/90 backdrop-blur-xl border-b border-white/10 select-none transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('studio')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#0d0f17] rounded-2xl flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-cyan-400 group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              KeySonic
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Keyboard Acoustic Layer
            </span>
          </div>
        </div>

        {/* Streamlined Nav Tabs */}
        <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Global Controls: System-Wide Laptop Mode + Profile + Volume */}
        <div className="flex items-center gap-3">
          {/* SYSTEM-WIDE LAPTOP TOGGLE BUTTON */}
          <button
            onClick={() => toggleSystemWide()}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              systemWideEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-emerald-950/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-rose-950/40'
            }`}
            title={systemWideEnabled ? 'System-Wide Laptop Mode is ACTIVE in all apps. Click to STOP.' : 'System-Wide Laptop Mode is STOPPED. Click to RESUME in all apps.'}
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {systemWideEnabled ? 'System-Wide: ACTIVE' : 'System-Wide: STOPPED'}
            </span>
            <span className={`w-2 h-2 rounded-full ${systemWideEnabled ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
          </button>

          {/* Quick Profile Switcher */}
          <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <select
              value={activeProfile.id}
              onChange={(e) => activateProfile(e.target.value)}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id} className="bg-[#12141c] text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1">
            <button
              onClick={() => updateSettings({ muted: !settings.muted })}
              className="text-slate-400 hover:text-white transition-colors"
              title={settings.muted ? 'Unmute' : 'Mute'}
            >
              {settings.muted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.masterVolume}
              onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
              className="w-16 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
            <span className="font-mono text-[10px] text-cyan-300 w-6">
              {settings.masterVolume}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
