import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { MappingMode } from '../../types/keysonic';
import {
  Sparkles,
  Keyboard,
  ArrowRight,
  Check,
  Play,
  Volume2,
  Sliders,
  X
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const {
    sounds,
    activeProfile,
    updateActiveProfile,
    previewSound,
    triggerKeyAction,
    lastPressedKey,
    lastSoundPlayed,
    completeOnboarding
  } = useKeySonic();

  const [step, setStep] = useState(1);
  const [selectedSoundId, setSelectedSoundId] = useState(activeProfile.globalSoundId);
  const [selectedMode, setSelectedMode] = useState<MappingMode>('B');

  if (!isOpen) return null;

  const handleFinish = () => {
    updateActiveProfile(prev => ({
      ...prev,
      globalSoundId: selectedSoundId,
      mappingMode: selectedMode,
    }));
    completeOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#12141c] border border-cyan-500/30 p-8 shadow-2xl flex flex-col gap-6">
        {/* Close / Skip button */}
        <button
          onClick={handleFinish}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Skip Onboarding"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Welcome to KeySonic • Step {step} of 5
            </span>
          </div>
          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Skip to Studio
          </button>
        </div>

        {/* Step 1: Choose a default sound */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Step 1: Choose your default switch sound</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select the primary acoustic profile you'd like your keyboard to play.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {[
                { id: 'thock-deep', name: 'Deep Thock', cat: 'Thock', desc: 'Resonant cavity bass bloom with solid plate bottom-out.' },
                { id: 'mech-blue', name: 'Blue Switch', cat: 'Mechanical', desc: 'Crisp dual-stage click with spring rebound.' },
                { id: 'classic-typewriter', name: 'Typewriter', cat: 'Classic', desc: 'Authentic metal hammer strike on heavy platen.' },
                { id: 'future-cyber', name: 'Cyberpunk', cat: 'Futuristic', desc: 'Holographic ionized chirps with sub-bass pulses.' },
                { id: 'mech-creamy', name: 'Creamy Lubed', cat: 'Mechanical', desc: 'Silky smooth dampened acoustic tones.' },
                { id: 'gaming-mech', name: 'Gaming Esports', cat: 'Gaming', desc: 'Ultra-fast snappy linear click for high APM.' },
              ].map(s => {
                const isSelected = selectedSoundId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSoundId(s.id);
                      previewSound(s.id);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-black/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{s.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">{s.cat}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewSound(s.id);
                      }}
                      className="w-fit flex items-center gap-1 text-[10px] text-cyan-300 hover:underline pt-1"
                    >
                      <Play className="w-2.5 h-2.5" /> Audition
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Choose mapping style */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Step 2: Choose your mapping style</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose how sounds are distributed across your physical keys.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { mode: 'A' as MappingMode, title: 'Mode A: Uniform', desc: 'Same switch sound applies identically across every single key.' },
                { mode: 'B' as MappingMode, title: 'Mode B: Key Types', desc: 'Spacebar, Enter, Backspace, Letters and Numbers get dedicated sounds.' },
                { mode: 'C' as MappingMode, title: 'Mode C: Key Groups', desc: 'Assign cohesive sounds by functional zones (Letters, Nav, F-keys).' },
                { mode: 'D' as MappingMode, title: 'Mode D: Custom Individual', desc: 'Visual key-by-key customization with multi-sound layering.' },
              ].map(m => {
                const isSelected = selectedMode === m.mode;
                return (
                  <div
                    key={m.mode}
                    onClick={() => setSelectedMode(m.mode)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-black/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{m.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Test your keyboard */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Step 3: Test your physical keyboard</h2>
              <p className="text-xs text-slate-400 mt-1">
                Press any key on your physical keyboard right now to hear the sub-millisecond audio response!
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5 gap-3">
              <Keyboard className="w-12 h-12 text-cyan-400 animate-bounce" />
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">Last Key Detected:</span>
                <span className="text-xl font-mono font-bold text-white bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-xl">
                  {lastPressedKey || 'Press any key'}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                Playing: {lastSoundPlayed}
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Customize Adaptive Clack & Spatial Audio */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Step 4: Enable Next-Gen Acoustic Features</h2>
              <p className="text-xs text-slate-400 mt-1">
                KeySonic features speed-reactive audio and physical stereo panning.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-4 bg-black/30 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Adaptive Clack (Typing Speed System)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">The sound sharpens and raises pitch dynamically as your WPM ramps up.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                  ENABLED
                </span>
              </div>

              <div className="p-4 bg-black/30 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Spatial Stereo Keyboard Audio</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Left keys pan slightly left; right keys pan right for realistic width.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                  MEDIUM
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Save & Ready */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-white">You're All Set!</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your customized acoustic profile is primed. Dive into Keyboard Studio to inspect keys, craft multi-layer sound composites, or record your own microphone sounds.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
            >
              Launch KeySonic Studio <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
