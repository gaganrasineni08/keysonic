import React from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { MappingMode, KeyGroupType } from '../../types/keysonic';

interface KeyDef {
  code: string;
  label: string;
  subLabel?: string;
  width?: string; // Tailwind width class
  group: KeyGroupType;
  xRatio: number; // 0 to 1 for spatial audio
}

// Full keyboard ANSI layout definitions
const ROW_F: KeyDef[] = [
  { code: 'Escape', label: 'ESC', group: 'special', xRatio: 0.05 },
  { code: 'F1', label: 'F1', group: 'function', xRatio: 0.15 },
  { code: 'F2', label: 'F2', group: 'function', xRatio: 0.2 },
  { code: 'F3', label: 'F3', group: 'function', xRatio: 0.25 },
  { code: 'F4', label: 'F4', group: 'function', xRatio: 0.3 },
  { code: 'F5', label: 'F5', group: 'function', xRatio: 0.4 },
  { code: 'F6', label: 'F6', group: 'function', xRatio: 0.45 },
  { code: 'F7', label: 'F7', group: 'function', xRatio: 0.5 },
  { code: 'F8', label: 'F8', group: 'function', xRatio: 0.55 },
  { code: 'F9', label: 'F9', group: 'function', xRatio: 0.65 },
  { code: 'F10', label: 'F10', group: 'function', xRatio: 0.7 },
  { code: 'F11', label: 'F11', group: 'function', xRatio: 0.75 },
  { code: 'F12', label: 'F12', group: 'function', xRatio: 0.8 },
];

const ROW_1: KeyDef[] = [
  { code: 'Backquote', label: '`', subLabel: '~', group: 'special', xRatio: 0.05 },
  { code: 'Digit1', label: '1', subLabel: '!', group: 'numbers', xRatio: 0.1 },
  { code: 'Digit2', label: '2', subLabel: '@', group: 'numbers', xRatio: 0.16 },
  { code: 'Digit3', label: '3', subLabel: '#', group: 'numbers', xRatio: 0.22 },
  { code: 'Digit4', label: '4', subLabel: '$', group: 'numbers', xRatio: 0.28 },
  { code: 'Digit5', label: '5', subLabel: '%', group: 'numbers', xRatio: 0.34 },
  { code: 'Digit6', label: '6', subLabel: '^', group: 'numbers', xRatio: 0.4 },
  { code: 'Digit7', label: '7', subLabel: '&', group: 'numbers', xRatio: 0.46 },
  { code: 'Digit8', label: '8', subLabel: '*', group: 'numbers', xRatio: 0.52 },
  { code: 'Digit9', label: '9', subLabel: '(', group: 'numbers', xRatio: 0.58 },
  { code: 'Digit0', label: '0', subLabel: ')', group: 'numbers', xRatio: 0.64 },
  { code: 'Minus', label: '-', subLabel: '_', group: 'special', xRatio: 0.7 },
  { code: 'Equal', label: '=', subLabel: '+', group: 'special', xRatio: 0.76 },
  { code: 'Backspace', label: 'BACKSPACE', width: 'w-20', group: 'backspace', xRatio: 0.85 },
];

const ROW_2: KeyDef[] = [
  { code: 'Tab', label: 'TAB', width: 'w-16', group: 'special', xRatio: 0.06 },
  { code: 'KeyQ', label: 'Q', group: 'letters', xRatio: 0.13 },
  { code: 'KeyW', label: 'W', group: 'letters', xRatio: 0.19 },
  { code: 'KeyE', label: 'E', group: 'letters', xRatio: 0.25 },
  { code: 'KeyR', label: 'R', group: 'letters', xRatio: 0.31 },
  { code: 'KeyT', label: 'T', group: 'letters', xRatio: 0.37 },
  { code: 'KeyY', label: 'Y', group: 'letters', xRatio: 0.43 },
  { code: 'KeyU', label: 'U', group: 'letters', xRatio: 0.49 },
  { code: 'KeyI', label: 'I', group: 'letters', xRatio: 0.55 },
  { code: 'KeyO', label: 'O', group: 'letters', xRatio: 0.61 },
  { code: 'KeyP', label: 'P', group: 'letters', xRatio: 0.67 },
  { code: 'BracketLeft', label: '[', subLabel: '{', group: 'special', xRatio: 0.73 },
  { code: 'BracketRight', label: ']', subLabel: '}', group: 'special', xRatio: 0.79 },
  { code: 'Backslash', label: '\\', subLabel: '|', width: 'w-14', group: 'special', xRatio: 0.86 },
];

const ROW_3: KeyDef[] = [
  { code: 'CapsLock', label: 'CAPS', width: 'w-18', group: 'modifiers', xRatio: 0.07 },
  { code: 'KeyA', label: 'A', group: 'letters', xRatio: 0.15 },
  { code: 'KeyS', label: 'S', group: 'letters', xRatio: 0.21 },
  { code: 'KeyD', label: 'D', group: 'letters', xRatio: 0.27 },
  { code: 'KeyF', label: 'F', group: 'letters', xRatio: 0.33 },
  { code: 'KeyG', label: 'G', group: 'letters', xRatio: 0.39 },
  { code: 'KeyH', label: 'H', group: 'letters', xRatio: 0.45 },
  { code: 'KeyJ', label: 'J', group: 'letters', xRatio: 0.51 },
  { code: 'KeyK', label: 'K', group: 'letters', xRatio: 0.57 },
  { code: 'KeyL', label: 'L', group: 'letters', xRatio: 0.63 },
  { code: 'Semicolon', label: ';', subLabel: ':', group: 'special', xRatio: 0.69 },
  { code: 'Quote', label: "'", subLabel: '"', group: 'special', xRatio: 0.75 },
  { code: 'Enter', label: 'ENTER', width: 'w-22', group: 'enter', xRatio: 0.86 },
];

const ROW_4: KeyDef[] = [
  { code: 'ShiftLeft', label: 'SHIFT', width: 'w-24', group: 'modifiers', xRatio: 0.08 },
  { code: 'KeyZ', label: 'Z', group: 'letters', xRatio: 0.18 },
  { code: 'KeyX', label: 'X', group: 'letters', xRatio: 0.24 },
  { code: 'KeyC', label: 'C', group: 'letters', xRatio: 0.3 },
  { code: 'KeyV', label: 'V', group: 'letters', xRatio: 0.36 },
  { code: 'KeyB', label: 'B', group: 'letters', xRatio: 0.42 },
  { code: 'KeyN', label: 'N', group: 'letters', xRatio: 0.48 },
  { code: 'KeyM', label: 'M', group: 'letters', xRatio: 0.54 },
  { code: 'Comma', label: ',', subLabel: '<', group: 'special', xRatio: 0.6 },
  { code: 'Period', label: '.', subLabel: '>', group: 'special', xRatio: 0.66 },
  { code: 'Slash', label: '/', subLabel: '?', group: 'special', xRatio: 0.72 },
  { code: 'ShiftRight', label: 'SHIFT', width: 'w-24', group: 'modifiers', xRatio: 0.85 },
];

const ROW_5: KeyDef[] = [
  { code: 'ControlLeft', label: 'CTRL', width: 'w-14', group: 'modifiers', xRatio: 0.06 },
  { code: 'MetaLeft', label: 'CMD', width: 'w-12', group: 'modifiers', xRatio: 0.12 },
  { code: 'AltLeft', label: 'ALT', width: 'w-12', group: 'modifiers', xRatio: 0.18 },
  { code: 'Space', label: 'SPACEBAR', width: 'flex-1', group: 'spacebar', xRatio: 0.5 },
  { code: 'AltRight', label: 'ALT', width: 'w-12', group: 'modifiers', xRatio: 0.75 },
  { code: 'MetaRight', label: 'CMD', width: 'w-12', group: 'modifiers', xRatio: 0.81 },
  { code: 'ControlRight', label: 'CTRL', width: 'w-14', group: 'modifiers', xRatio: 0.88 },
];

// Navigation cluster
const NAV_KEYS: KeyDef[][] = [
  [
    { code: 'PrintScreen', label: 'PRT', group: 'navigation', xRatio: 0.85 },
    { code: 'ScrollLock', label: 'SCR', group: 'navigation', xRatio: 0.9 },
    { code: 'Pause', label: 'PAU', group: 'navigation', xRatio: 0.95 },
  ],
  [
    { code: 'Insert', label: 'INS', group: 'navigation', xRatio: 0.85 },
    { code: 'Home', label: 'HOM', group: 'navigation', xRatio: 0.9 },
    { code: 'PageUp', label: 'PGU', group: 'navigation', xRatio: 0.95 },
  ],
  [
    { code: 'Delete', label: 'DEL', group: 'navigation', xRatio: 0.85 },
    { code: 'End', label: 'END', group: 'navigation', xRatio: 0.9 },
    { code: 'PageDown', label: 'PGD', group: 'navigation', xRatio: 0.95 },
  ],
];

// Arrow Keys
const ARROWS: KeyDef[] = [
  { code: 'ArrowUp', label: '▲', group: 'arrows', xRatio: 0.9 },
  { code: 'ArrowLeft', label: '◀', group: 'arrows', xRatio: 0.85 },
  { code: 'ArrowDown', label: '▼', group: 'arrows', xRatio: 0.9 },
  { code: 'ArrowRight', label: '▶', group: 'arrows', xRatio: 0.95 },
];

export const KeyboardVisualizer: React.FC = () => {
  const {
    pressedKeys,
    selectedKeyId,
    setSelectedKeyId,
    triggerKeyAction,
    activeProfile,
    sounds,
    settings,
  } = useKeySonic();

  const handleKeyClick = (keyDef: KeyDef) => {
    setSelectedKeyId(keyDef.code);
    triggerKeyAction(keyDef.code, keyDef.label, keyDef.xRatio);
  };

  const isVintage = settings.keyboardStyle === 'classic-beige';
  const isCyber = settings.keyboardStyle === 'cyberpunk';

  // Helper to determine sound label for key
  const getKeySoundName = (code: string, group: KeyGroupType): string => {
    const custom = activeProfile.keyMappings[code];
    let soundId = activeProfile.globalSoundId;

    if (custom) {
      soundId = custom.soundId;
    } else if (activeProfile.mappingMode === 'B') {
      if (code === 'Space') soundId = activeProfile.specialKeySounds.space;
      else if (code === 'Enter') soundId = activeProfile.specialKeySounds.enter;
      else if (code === 'Backspace') soundId = activeProfile.specialKeySounds.backspace;
      else if (code.startsWith('Digit')) soundId = activeProfile.groupMappings.numbers;
      else if (code.startsWith('Key')) soundId = activeProfile.groupMappings.letters;
    } else if (activeProfile.mappingMode === 'C') {
      soundId = activeProfile.groupMappings[group] || activeProfile.globalSoundId;
    }

    return sounds.find(s => s.id === soundId)?.name || soundId;
  };

  const renderKey = (key: KeyDef) => {
    const isPressed = !!pressedKeys[key.code];
    const isSelected = selectedKeyId === key.code;
    const soundName = getKeySoundName(key.code, key.group);

    // Dynamic styling based on keyboard style and state
    let baseStyle = 'bg-[#1e202c] text-slate-200 border-t border-white/10 shadow-md shadow-black/40';
    if (isVintage) {
      baseStyle = key.group === 'modifiers' || key.group === 'special'
        ? 'bg-[#c8beb3] text-[#2b2621] border-t border-[#dfd6cd] shadow-[#8f8275]'
        : 'bg-[#ded6cc] text-[#241f1a] border-t border-[#eee7df] shadow-[#a3978a]';
    } else if (isCyber) {
      baseStyle = 'bg-[#0f1523] text-cyan-200 border-t border-cyan-500/30 shadow-cyan-950/40';
    }

    let activeStyle = '';
    if (isPressed) {
      activeStyle = isCyber
        ? 'translate-y-1 bg-cyan-400 text-black shadow-none ring-2 ring-cyan-200 shadow-lg shadow-cyan-400/50'
        : isVintage
        ? 'translate-y-1 bg-amber-400 text-black shadow-none ring-2 ring-amber-300'
        : 'translate-y-1 bg-cyan-400 text-black shadow-none ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/50';
    } else if (isSelected) {
      activeStyle = 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0b0e]';
    }

    return (
      <button
        key={key.code}
        onClick={() => handleKeyClick(key)}
        title={`${key.label} (${key.code}) → ${soundName}`}
        className={`relative ${key.width || 'flex-1 min-w-[36px]'} h-11 rounded-lg flex flex-col items-center justify-center p-1 font-mono transition-all duration-75 select-none ${baseStyle} ${activeStyle} hover:brightness-110 active:translate-y-1`}
      >
        {key.subLabel && (
          <span className="text-[9px] opacity-60 leading-none">{key.subLabel}</span>
        )}
        <span className="text-xs font-bold leading-tight">{key.label}</span>

        {/* Small nib indicator on F and J home row */}
        {(key.code === 'KeyF' || key.code === 'KeyJ') && (
          <span className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-slate-400/80" />
        )}

        {/* Custom assigned sound indicator dot */}
        {activeProfile.keyMappings[key.code] && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-1 ring-black" />
        )}
      </button>
    );
  };

  return (
    <div className={`w-full rounded-3xl p-6 transition-all duration-300 shadow-2xl border ${
      isVintage
        ? 'bg-[#b8ab9e] border-[#9f9184] shadow-black/60'
        : isCyber
        ? 'bg-gradient-to-b from-[#0a0f1d] to-[#05070c] border-cyan-500/30 shadow-cyan-950/30'
        : 'bg-gradient-to-b from-[#14161f] to-[#0a0b10] border-white/10 shadow-black/80'
    }`}>
      {/* Keyboard Case Header Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-semibold tracking-wider text-white">
            {isVintage ? 'IBM MODEL M MECHANICAL WORKSTATION' : 'KEYSONIC REALTIME ACOUSTIC MATRIX'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>LAYOUT: {settings.keyboardLayout.toUpperCase()}</span>
          <span className="text-cyan-400">MODE: {activeProfile.mappingMode}</span>
        </div>
      </div>

      {/* Main Alphanumeric Block + Nav Block */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {/* Main Keyboard Alpha Block */}
        <div className="flex-1 flex flex-col gap-2 min-w-[700px]">
          {/* Function Row (F1 - F12) */}
          {settings.keyboardSize !== '60' && (
            <div className="flex gap-1.5 mb-1">
              {ROW_F.map(renderKey)}
            </div>
          )}

          {/* Number Row */}
          <div className="flex gap-1.5">{ROW_1.map(renderKey)}</div>

          {/* QWERTY Row */}
          <div className="flex gap-1.5">{ROW_2.map(renderKey)}</div>

          {/* ASDF Home Row */}
          <div className="flex gap-1.5">{ROW_3.map(renderKey)}</div>

          {/* ZXCVB Row */}
          <div className="flex gap-1.5">{ROW_4.map(renderKey)}</div>

          {/* Bottom Spacebar Row */}
          <div className="flex gap-1.5">{ROW_5.map(renderKey)}</div>
        </div>

        {/* Navigation & Arrows (Visible for TKL and Full Size) */}
        {(settings.keyboardSize === 'full' || settings.keyboardSize === 'tkl') && (
          <div className="w-32 flex flex-col justify-between pl-2 border-l border-white/5">
            {/* Nav 3x3 Block */}
            <div className="flex flex-col gap-2">
              {NAV_KEYS.map((row, i) => (
                <div key={i} className="flex gap-1.5">
                  {row.map(renderKey)}
                </div>
              ))}
            </div>

            {/* Inverted T Arrow Keys */}
            <div className="flex flex-col items-center gap-1.5 mt-4">
              <div>{renderKey(ARROWS[0])}</div>
              <div className="flex gap-1.5">
                {renderKey(ARROWS[1])}
                {renderKey(ARROWS[2])}
                {renderKey(ARROWS[3])}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Legend */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Key Has Custom Override
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Active Physical Keystroke
          </span>
        </div>
        <div>
          Click any keycap to inspect its acoustic layering & randomization
        </div>
      </div>
    </div>
  );
};
