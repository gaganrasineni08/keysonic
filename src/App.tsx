import React, { useState, useEffect } from 'react';
import { KeySonicProvider, useKeySonic } from './state/KeySonicContext';
import { Navbar } from './components/header/Navbar';
import { KeyboardStudio } from './components/studio/KeyboardStudio';
import { SoundLibraryView } from './components/library/SoundLibraryView';
import { CustomizerView } from './components/customizer/CustomizerView';
import { Shield, Volume2, Power } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('studio');
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const {
    systemWideEnabled,
    toggleSystemWide,
    activeProfile,
    lastPressedKey,
    lastSoundPlayed,
    wpm,
    diagnostics
  } = useKeySonic();

  // First interaction gesture to unlock browser AudioContext autoplay policy
  useEffect(() => {
    const handleGesture = () => {
      setHasInteracted(true);
    };
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#f1f5f9] flex flex-col font-sans select-none">
      {/* Audio initialization gesture prompt if needed */}
      {!hasInteracted && (
        <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-black py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
          <Volume2 className="w-4 h-4" />
          <span>Click anywhere to activate real-time Web Audio synthesis</span>
        </div>
      )}

      {/* Sleek Global Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'studio' && <KeyboardStudio />}
        {currentTab === 'library' && <SoundLibraryView />}
        {currentTab === 'customize' && <CustomizerView />}
      </main>

      {/* Clean Desktop Software Footer */}
      <footer className="border-t border-white/5 bg-[#08090d] py-5 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>KeySonic Local Engine: 100% Private Client-Side Synthesis</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleSystemWide()}
              className="text-xs hover:underline flex items-center gap-1.5"
            >
              <span className={`w-2 h-2 rounded-full ${systemWideEnabled ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              {systemWideEnabled ? 'System-Wide Laptop Sound: ON' : 'System-Wide Laptop Sound: OFF'}
            </button>
            <span>Latency: <strong className="text-emerald-400">{diagnostics.lastLatencyMs}ms</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <KeySonicProvider>
      <MainAppContent />
    </KeySonicProvider>
  );
}
