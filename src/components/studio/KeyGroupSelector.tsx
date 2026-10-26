import React from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { KeyGroupType } from '../../types/keysonic';
import { Layers, Play, Check } from 'lucide-react';

interface GroupInfo {
  id: KeyGroupType;
  title: string;
  description: string;
  keysIncluded: string;
}

const GROUPS: GroupInfo[] = [
  { id: 'letters', title: 'Letters (A–Z)', description: 'Primary alphabet keystrokes', keysIncluded: 'A to Z' },
  { id: 'numbers', title: 'Numbers (0–9)', description: 'Top numeric row & digits', keysIncluded: '0 to 9' },
  { id: 'spacebar', title: 'Spacebar', description: 'Deepest acoustic plate impact', keysIncluded: 'Space' },
  { id: 'enter', title: 'Enter Key', description: 'Heavy confirmation clack', keysIncluded: 'Return / Enter' },
  { id: 'backspace', title: 'Backspace Key', description: 'Sharp deletion click', keysIncluded: 'Backspace / Delete' },
  { id: 'modifiers', title: 'Modifiers (Shift, Ctrl, Alt)', description: 'Dampened tactile press', keysIncluded: 'Shift, Ctrl, Alt, Cmd' },
  { id: 'function', title: 'Function Keys (F1–F12)', description: 'Auxiliary function row', keysIncluded: 'F1 to F12' },
  { id: 'arrows', title: 'Arrow Navigation Keys', description: 'Directional controls', keysIncluded: '▲ ▼ ◀ ▶' },
  { id: 'navigation', title: 'Navigation (Home, End, Pg)', description: 'Page navigation cluster', keysIncluded: 'Ins, Del, Home, End, PgUp/Dn' },
  { id: 'special', title: 'Punctuation & Special', description: 'Brackets, symbols & punctuation', keysIncluded: '` - = [ ] \\ ; \' , . /' },
];

export const KeyGroupSelector: React.FC = () => {
  const { activeProfile, updateActiveProfile, sounds, previewSound } = useKeySonic();

  const handleGroupSoundChange = (group: KeyGroupType, soundId: string) => {
    updateActiveProfile(prev => ({
      ...prev,
      groupMappings: {
        ...prev.groupMappings,
        [group]: soundId,
      }
    }));
    previewSound(soundId);
  };

  return (
    <div className="rounded-2xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="text-sm font-semibold text-white">Mode C — Key Group Acoustic Sound Mapping</h4>
            <p className="text-xs text-slate-400">Assign a cohesive switch sound to each distinct functional zone of your keyboard</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GROUPS.map(g => {
          const assignedSoundId = activeProfile.groupMappings[g.id] || activeProfile.globalSoundId;
          const assignedSound = sounds.find(s => s.id === assignedSoundId);

          return (
            <div
              key={g.id}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">{g.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-2">({g.keysIncluded})</span>
                </div>
                <button
                  onClick={() => previewSound(assignedSoundId)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors"
                  title="Preview assigned sound"
                >
                  <Play className="w-3 h-3" />
                </button>
              </div>

              <select
                value={assignedSoundId}
                onChange={(e) => handleGroupSoundChange(g.id, e.target.value)}
                className="w-full bg-[#161824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {sounds.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.category}] {s.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};
