import React, { useState, useEffect, useRef } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { Play, Pause, Sparkles, Volume2, Hand, RefreshCw } from 'lucide-react';

interface FingerPosition {
  x: number;
  y: number;
  pressing: boolean;
}

// Map key codes to which finger operates them:
// L1: Left Pinky, L2: Left Ring, L3: Left Middle, L4: Left Index, LT: Left Thumb
// RT: Right Thumb, R1: Right Index, R2: Right Middle, R3: Right Ring, R4: Right Pinky
const FINGER_MAP: Record<string, string> = {
  // Left Pinky
  Escape: 'L1', Tab: 'L1', CapsLock: 'L1', ShiftLeft: 'L1', ControlLeft: 'L1',
  Backquote: 'L1', Digit1: 'L1', KeyQ: 'L1', KeyA: 'L1', KeyZ: 'L1',
  // Left Ring
  Digit2: 'L2', KeyW: 'L2', KeyS: 'L2', KeyX: 'L2',
  // Left Middle
  Digit3: 'L3', KeyE: 'L3', KeyD: 'L3', KeyC: 'L3',
  // Left Index
  Digit4: 'L4', Digit5: 'L4', KeyR: 'L4', KeyT: 'L4', KeyF: 'L4', KeyG: 'L4', KeyV: 'L4', KeyB: 'L4',
  // Thumbs
  Space: 'LT', AltLeft: 'LT', AltRight: 'RT',
  // Right Index
  Digit6: 'R1', Digit7: 'R1', KeyY: 'R1', KeyU: 'R1', KeyH: 'R1', KeyJ: 'R1', KeyN: 'R1', KeyM: 'R1',
  // Right Middle
  Digit8: 'R2', KeyI: 'R2', KeyK: 'R2', Comma: 'R2',
  // Right Ring
  Digit9: 'R3', KeyO: 'R3', KeyL: 'R3', Period: 'R3',
  // Right Pinky
  Digit0: 'R4', Minus: 'R4', Equal: 'R4', Backspace: 'R4',
  KeyP: 'R4', BracketLeft: 'R4', BracketRight: 'R4', Backslash: 'R4',
  Semicolon: 'R4', Quote: 'R4', Enter: 'R4', ShiftRight: 'R4', ControlRight: 'R4',
};

const DEMO_SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "KeySonic brings mechanical tactile acoustics to any laptop keyboard.",
  "Deep thock switches produce resonant sub-bass acoustic cavities.",
  "Craft your own programmable sound layers and adaptive clack typing profiles."
];

export const ClassicHandsOverlay: React.FC = () => {
  const { pressedKeys, triggerKeyAction, activeProfile, lastSoundPlayed, settings, updateSettings } = useKeySonic();
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [handStyle, setHandStyle] = useState<'classic-warm' | 'cyber-hologram'>('classic-warm');
  const [activeFingers, setActiveFingers] = useState<Record<string, boolean>>({});

  // Detect which fingers should be depressing based on pressedKeys
  useEffect(() => {
    const nextFingers: Record<string, boolean> = {};
    for (const code of Object.keys(pressedKeys)) {
      if (pressedKeys[code]) {
        const finger = FINGER_MAP[code] || 'LT';
        nextFingers[finger] = true;
      }
    }
    setActiveFingers(nextFingers);
  }, [pressedKeys]);

  // Demo auto-typing engine
  useEffect(() => {
    if (!isDemoRunning) return;

    const currentText = DEMO_SENTENCES[demoIndex];
    const timer = setTimeout(() => {
      if (charIndex < currentText.length) {
        const char = currentText[charIndex];
        let code = 'Space';
        if (char === ' ') code = 'Space';
        else if (char === '.') code = 'Period';
        else if (char === ',') code = 'Comma';
        else {
          const upper = char.toUpperCase();
          code = `Key${upper}`;
        }

        triggerKeyAction(code, char);
        setCharIndex(prev => prev + 1);
      } else {
        // Next sentence after pause
        setTimeout(() => {
          setCharIndex(0);
          setDemoIndex(prev => (prev + 1) % DEMO_SENTENCES.length);
        }, 1200);
      }
    }, Math.floor(70 + Math.random() * 80)); // 60-90 WPM cadence

    return () => clearTimeout(timer);
  }, [isDemoRunning, charIndex, demoIndex, triggerKeyAction]);

  const toggleDemo = () => {
    setIsDemoRunning(prev => !prev);
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setCharIndex(0);
  };

  const isCyber = handStyle === 'cyber-hologram';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#12141c] via-[#0d0f15] to-[#08090d] border border-cyan-500/20 shadow-2xl p-6 select-none">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Hand className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
              Classic Workstation & Typing Hands Visualizer
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Physical Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive hands realistically articulate & strike keycaps matching your keystrokes in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Hands Style Switcher */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1 text-xs">
            <button
              onClick={() => setHandStyle('classic-warm')}
              className={`px-3 py-1 rounded transition-all ${
                handStyle === 'classic-warm'
                  ? 'bg-amber-600/30 text-amber-300 font-medium border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Classic Warm
            </button>
            <button
              onClick={() => setHandStyle('cyber-hologram')}
              className={`px-3 py-1 rounded transition-all ${
                handStyle === 'cyber-hologram'
                  ? 'bg-cyan-500/30 text-cyan-300 font-medium border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cyber Hologram
            </button>
          </div>

          {/* Auto Typist Demo Button */}
          <button
            onClick={toggleDemo}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md ${
              isDemoRunning
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-rose-500/20'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-500/20 hover:bg-cyan-500/30'
            }`}
          >
            {isDemoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isDemoRunning ? 'Pause Demo Typist' : 'Auto-Typing Demo'}
          </button>

          {isDemoRunning && (
            <button
              onClick={resetDemo}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              title="Reset Demo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Demo Text Prompter if active */}
      {isDemoRunning && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-black/60 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <span className="text-cyan-400 font-bold">LIVE TYPING:</span>
            <span className="text-white font-medium">
              {DEMO_SENTENCES[demoIndex].slice(0, charIndex)}
            </span>
            <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
            <span className="text-slate-600">
              {DEMO_SENTENCES[demoIndex].slice(charIndex)}
            </span>
          </div>
          <span className="text-[11px] text-cyan-400 font-sans px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
            ~75 WPM
          </span>
        </div>
      )}

      {/* Keyboard Stage with Hands */}
      <div className="relative w-full max-w-4xl mx-auto h-[320px] rounded-xl bg-gradient-to-b from-[#1a1b24] to-[#0e1017] border border-white/10 shadow-inner flex flex-col justify-end p-6 overflow-hidden">
        {/* Desk mat texture / lighting grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-black pointer-events-none" />

        {/* Vintage Wood / Aluminum Case Lip */}
        <div className="absolute top-4 left-6 right-6 h-4 bg-gradient-to-r from-[#2c2018] via-[#4a3525] to-[#2c2018] rounded-t-lg border-t border-amber-900/40 flex items-center justify-center opacity-80">
          <span className="text-[9px] font-mono tracking-widest text-amber-200/50 uppercase">
            KeySonic Acoustic Mechanical Chasis • 1984 Edition
          </span>
        </div>

        {/* Minimal Classic Keyboard Representation */}
        <div className="relative z-10 w-full bg-[#181922] p-4 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-2">
          {/* Key Rows */}
          {/* Row 1: Numbers */}
          <div className="grid grid-cols-13 gap-1.5 h-7">
            {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((k, i) => {
              const code = i === 0 ? 'Backquote' : `Digit${k}`;
              const isPressed = pressedKeys[code];
              return (
                <div
                  key={k}
                  onClick={() => triggerKeyAction(code, k)}
                  className={`cursor-pointer rounded flex items-center justify-center text-[10px] font-mono font-medium transition-all shadow ${
                    isPressed
                      ? 'bg-cyan-500 text-black translate-y-1 shadow-none ring-2 ring-cyan-300'
                      : 'bg-[#222533] text-slate-300 hover:bg-[#2b2f42] border-t border-white/10'
                  }`}
                >
                  {k}
                </div>
              );
            })}
          </div>

          {/* Row 2: QWERTY */}
          <div className="grid grid-cols-12 gap-1.5 h-7">
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'].map((k) => {
              const code = `Key${k}`;
              const isPressed = pressedKeys[code];
              return (
                <div
                  key={k}
                  onClick={() => triggerKeyAction(code, k)}
                  className={`cursor-pointer rounded flex items-center justify-center text-[10px] font-mono font-semibold transition-all shadow ${
                    isPressed
                      ? 'bg-cyan-400 text-black translate-y-1 shadow-none ring-2 ring-cyan-200'
                      : 'bg-[#282b3d] text-slate-200 hover:bg-[#32364c] border-t border-white/10'
                  }`}
                >
                  {k}
                </div>
              );
            })}
          </div>

          {/* Row 3: ASDF Home Row */}
          <div className="grid grid-cols-11 gap-1.5 h-7">
            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"].map((k) => {
              const code = `Key${k}`;
              const isPressed = pressedKeys[code];
              const isHomeNib = k === 'F' || k === 'J';
              return (
                <div
                  key={k}
                  onClick={() => triggerKeyAction(code, k)}
                  className={`relative cursor-pointer rounded flex items-center justify-center text-[10px] font-mono font-semibold transition-all shadow ${
                    isPressed
                      ? 'bg-cyan-400 text-black translate-y-1 shadow-none ring-2 ring-cyan-200'
                      : 'bg-[#282b3d] text-slate-200 hover:bg-[#32364c] border-t border-white/10'
                  }`}
                >
                  {k}
                  {isHomeNib && (
                    <span className="absolute bottom-1 w-2 h-0.5 bg-slate-400/80 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Row 4: ZXCVB */}
          <div className="grid grid-cols-10 gap-1.5 h-7">
            {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map((k) => {
              const code = `Key${k}`;
              const isPressed = pressedKeys[code];
              return (
                <div
                  key={k}
                  onClick={() => triggerKeyAction(code, k)}
                  className={`cursor-pointer rounded flex items-center justify-center text-[10px] font-mono font-semibold transition-all shadow ${
                    isPressed
                      ? 'bg-cyan-400 text-black translate-y-1 shadow-none ring-2 ring-cyan-200'
                      : 'bg-[#282b3d] text-slate-200 hover:bg-[#32364c] border-t border-white/10'
                  }`}
                >
                  {k}
                </div>
              );
            })}
          </div>

          {/* Row 5: Spacebar & Modifiers */}
          <div className="flex gap-2 h-8">
            <div className="w-14 bg-[#1f2230] rounded flex items-center justify-center text-[9px] font-mono text-slate-400">
              CTRL
            </div>
            <div className="w-14 bg-[#1f2230] rounded flex items-center justify-center text-[9px] font-mono text-slate-400">
              ALT
            </div>
            <div
              onClick={() => triggerKeyAction('Space', 'Space')}
              className={`flex-1 cursor-pointer rounded flex items-center justify-center text-[10px] font-mono font-bold tracking-widest transition-all shadow ${
                pressedKeys['Space']
                  ? 'bg-cyan-400 text-black translate-y-1 shadow-none ring-2 ring-cyan-200'
                  : 'bg-[#31354a] text-slate-200 hover:bg-[#3c415b] border-t border-white/15'
              }`}
            >
              SPACEBAR
            </div>
            <div className="w-14 bg-[#1f2230] rounded flex items-center justify-center text-[9px] font-mono text-slate-400">
              ALT
            </div>
            <div
              onClick={() => triggerKeyAction('Enter', 'Enter')}
              className={`w-16 cursor-pointer rounded flex items-center justify-center text-[9px] font-mono font-bold transition-all shadow ${
                pressedKeys['Enter']
                  ? 'bg-emerald-400 text-black translate-y-1 ring-2 ring-emerald-300'
                  : 'bg-[#1f2230] text-emerald-400 hover:bg-[#2a2e42] border-t border-emerald-500/30'
              }`}
            >
              ENTER
            </div>
          </div>
        </div>

        {/* ── REALISTIC FLOATING HANDS LAYER ── */}
        <div className="absolute inset-0 pointer-events-none z-20 flex justify-between px-16 items-end pb-8">
          {/* LEFT HAND */}
          <div className="relative w-52 h-44 transition-all duration-75 flex flex-col items-center">
            {/* Wrist / Forearm */}
            <div
              className={`w-28 h-20 rounded-t-3xl border-t border-x transition-colors duration-200 shadow-2xl ${
                isCyber
                  ? 'bg-cyan-900/30 border-cyan-400/40 backdrop-blur-sm shadow-cyan-500/20'
                  : 'bg-gradient-to-b from-[#e7b897]/75 to-[#c99470]/60 border-[#f5cbab]/50 shadow-black/40'
              }`}
            />
            {/* Palm */}
            <div
              className={`w-36 h-20 -mt-2 rounded-2xl border transition-colors duration-200 relative flex justify-around items-end pb-1 shadow-lg ${
                isCyber
                  ? 'bg-cyan-800/40 border-cyan-400/50 backdrop-blur-md'
                  : 'bg-gradient-to-b from-[#f2c7a7]/80 to-[#db9f7b]/75 border-[#f5cbab]/60'
              }`}
            >
              {/* Left Thumb */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['LT'] ? 'translate-y-3.5 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['LT'] ? 'h-10 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-8 bg-cyan-600/70'
                    : activeFingers['LT'] ? 'h-10 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-8 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Left Index */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['L4'] ? 'translate-y-4 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['L4'] ? 'h-14 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-11 bg-cyan-600/70'
                    : activeFingers['L4'] ? 'h-14 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-11 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Left Middle */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['L3'] ? 'translate-y-4 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['L3'] ? 'h-16 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-12 bg-cyan-600/70'
                    : activeFingers['L3'] ? 'h-16 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-12 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Left Ring */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['L2'] ? 'translate-y-4 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['L2'] ? 'h-13 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-10 bg-cyan-600/70'
                    : activeFingers['L2'] ? 'h-13 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-10 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Left Pinky */}
              <div
                className={`w-4.5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['L1'] ? 'translate-y-3.5 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['L1'] ? 'h-11 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-8 bg-cyan-600/70'
                    : activeFingers['L1'] ? 'h-11 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-8 bg-[#e5b593]'
                }`}
              >
                <div className="w-2.5 h-1.5 rounded-full bg-white/40 mb-1" />
              </div>
            </div>
          </div>

          {/* RIGHT HAND */}
          <div className="relative w-52 h-44 transition-all duration-75 flex flex-col items-center">
            {/* Wrist / Forearm */}
            <div
              className={`w-28 h-20 rounded-t-3xl border-t border-x transition-colors duration-200 shadow-2xl ${
                isCyber
                  ? 'bg-cyan-900/30 border-cyan-400/40 backdrop-blur-sm shadow-cyan-500/20'
                  : 'bg-gradient-to-b from-[#e7b897]/75 to-[#c99470]/60 border-[#f5cbab]/50 shadow-black/40'
              }`}
            />
            {/* Palm */}
            <div
              className={`w-36 h-20 -mt-2 rounded-2xl border transition-colors duration-200 relative flex justify-around items-end pb-1 shadow-lg ${
                isCyber
                  ? 'bg-cyan-800/40 border-cyan-400/50 backdrop-blur-md'
                  : 'bg-gradient-to-b from-[#f2c7a7]/80 to-[#db9f7b]/75 border-[#f5cbab]/60'
              }`}
            >
              {/* Right Pinky */}
              <div
                className={`w-4.5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['R4'] ? 'translate-y-3.5 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['R4'] ? 'h-11 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-8 bg-cyan-600/70'
                    : activeFingers['R4'] ? 'h-11 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-8 bg-[#e5b593]'
                }`}
              >
                <div className="w-2.5 h-1.5 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Right Ring */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['R3'] ? 'translate-y-4 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['R3'] ? 'h-13 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-10 bg-cyan-600/70'
                    : activeFingers['R3'] ? 'h-13 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-10 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Right Middle */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['R2'] ? 'translate-y-4 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['R2'] ? 'h-16 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-12 bg-cyan-600/70'
                    : activeFingers['R2'] ? 'h-16 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-12 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Right Index */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['R1'] ? 'translate-y-4 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['R1'] ? 'h-14 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-11 bg-cyan-600/70'
                    : activeFingers['R1'] ? 'h-14 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-11 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>

              {/* Right Thumb */}
              <div
                className={`w-5 rounded-full transition-transform duration-100 flex flex-col items-center justify-end ${
                  activeFingers['RT'] ? 'translate-y-3.5 scale-95' : 'translate-y-0'
                } ${
                  isCyber
                    ? activeFingers['RT'] ? 'h-10 bg-cyan-300 shadow-lg shadow-cyan-400' : 'h-8 bg-cyan-600/70'
                    : activeFingers['RT'] ? 'h-10 bg-[#f7d8c0] shadow-md ring-2 ring-amber-400/50' : 'h-8 bg-[#e5b593]'
                }`}
              >
                <div className="w-3 h-2 rounded-full bg-white/40 mb-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Active Profile:</span>
          <span className="text-white font-semibold">{activeProfile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Last Sound:</span>
          <span className="text-cyan-300 font-semibold">{lastSoundPlayed}</span>
        </div>
      </div>
    </div>
  );
};
