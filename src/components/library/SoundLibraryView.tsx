import React, { useState, useMemo } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { SoundCategory, SoundItem } from '../../types/keysonic';
import { CATEGORY_COLORS } from '../../audio/SoundLibraryData';
import {
  Search,
  Star,
  Play,
  Upload,
  Sparkles,
  Volume2,
  Tag,
  Check,
  Disc,
  Filter
} from 'lucide-react';

const CATEGORIES: Array<SoundCategory | 'All' | 'Favorites'> = [
  'All',
  'Favorites',
  'Mechanical',
  'Thock',
  'Click',
  'Classic',
  'Gaming',
  'Futuristic',
  'Ambient',
  'Custom',
];

export const SoundLibraryView: React.FC = () => {
  const {
    sounds,
    favorites,
    toggleFavorite,
    previewSound,
    activeProfile,
    updateActiveProfile,
    addCustomSound,
  } = useKeySonic();

  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | 'All' | 'Favorites'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload modal state
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<SoundCategory>('Custom');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const filteredSounds = useMemo(() => {
    return sounds.filter(sound => {
      // Category match
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(sound.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (sound.category !== selectedCategory) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = sound.name.toLowerCase().includes(query);
        const matchesDesc = sound.description.toLowerCase().includes(query);
        const matchesTags = sound.tags.some(t => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [sounds, selectedCategory, favorites, searchQuery]);

  const handlePreview = (soundId: string) => {
    setActivePreviewId(soundId);
    previewSound(soundId);
    setTimeout(() => {
      setActivePreviewId(null);
    }, 400);
  };

  const handleAssignToProfile = (soundId: string) => {
    updateActiveProfile(prev => ({
      ...prev,
      globalSoundId: soundId,
    }));
    handlePreview(soundId);
  };

  const handleAssignToKey = (soundId: string, keyCode: string) => {
    updateActiveProfile(prev => {
      const prevConfig = prev.keyMappings[keyCode] || {
        key: keyCode,
        label: keyCode,
        soundId,
        volume: 90,
        pitch: 0,
        attack: 0,
        decay: 140,
        pan: 0,
        randomizationEnabled: false,
        randomizedSounds: [],
        layeringEnabled: false,
        layers: [],
      };
      return {
        ...prev,
        keyMappings: {
          ...prev.keyMappings,
          [keyCode]: { ...prevConfig, soundId }
        }
      };
    });
    handlePreview(soundId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setUploadName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;
    try {
      const arrayBuffer = await uploadFile.arrayBuffer();
      const newSound: SoundItem = {
        id: `custom-${Date.now()}`,
        name: uploadName || uploadFile.name,
        category: uploadCategory,
        description: `Custom uploaded audio file (${uploadFile.type || 'audio'}).`,
        isCustom: true,
        tags: ['custom', 'user-upload'],
      };
      addCustomSound(newSound, arrayBuffer);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadName('');
    } catch (err) {
      console.error('Failed to upload custom audio', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
            <Disc className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Sound Library</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive catalog of procedural switches, vintage typewriters, futuristic blips & custom uploads
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <Upload className="w-4 h-4" />
          Upload Custom Sound (WAV/MP3)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#12141c] p-4 rounded-2xl border border-white/10">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sounds by switch name, characteristics, or tags (e.g. 'thock', 'creamy', 'tactile')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'bg-black/30 text-slate-400 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {cat === 'Favorites' && <Star className="w-3 h-3 inline mr-1 fill-amber-400 text-amber-400" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sounds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSounds.map(sound => {
          const isFav = favorites.includes(sound.id);
          const isAssignedGlobal = activeProfile.globalSoundId === sound.id;
          const isPreviewing = activePreviewId === sound.id;
          const catColor = CATEGORY_COLORS[sound.category] || '#38bdf8';

          return (
            <div
              key={sound.id}
              className={`rounded-2xl bg-[#12141c] border transition-all duration-200 p-5 flex flex-col justify-between gap-4 group hover:translate-y-[-2px] hover:shadow-xl ${
                isAssignedGlobal
                  ? 'border-cyan-500/50 shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              {/* Top metadata */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md w-fit mb-1"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      {sound.category}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sound.name}
                    </h3>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(sound.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 transition-colors"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {sound.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {sound.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(sound.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isPreviewing
                        ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 scale-95'
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Preview
                  </button>

                  <button
                    onClick={() => handleAssignToProfile(sound.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      isAssignedGlobal
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title="Assign as global sound for active profile"
                  >
                    {isAssignedGlobal ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-400" /> Active
                      </span>
                    ) : (
                      'Set Global'
                    )}
                  </button>
                </div>

                {/* Quick assign to special keys */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Quick Assign:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleAssignToKey(sound.id, 'Space')}
                      className="hover:text-cyan-300 transition-colors"
                      title="Assign to Spacebar"
                    >
                      [Space]
                    </button>
                    <button
                      onClick={() => handleAssignToKey(sound.id, 'Enter')}
                      className="hover:text-cyan-300 transition-colors"
                      title="Assign to Enter"
                    >
                      [Enter]
                    </button>
                    <button
                      onClick={() => handleAssignToKey(sound.id, 'Backspace')}
                      className="hover:text-cyan-300 transition-colors"
                      title="Assign to Backspace"
                    >
                      [Backspace]
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSounds.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-[#12141c] rounded-2xl border border-white/5">
          <p className="text-sm font-medium">No sounds matched your filter or search query</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs text-cyan-400 hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Upload Custom Sound Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141c] border border-cyan-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                Upload Custom Audio
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Upload any local WAV, MP3, or OGG audio file. It will be decoded into Web Audio memory and stored locally in your browser.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="audio/wav,audio/mp3,audio/ogg,audio/mpeg"
                onChange={handleFileChange}
                className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300">Sound Name:</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. My Lubed Gateron Yellow"
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300">Category:</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as SoundCategory)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Custom">Custom</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Thock">Thock</option>
                  <option value="Click">Click</option>
                  <option value="Classic">Classic</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!uploadFile}
                onClick={handleUploadSubmit}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                Save & Add to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
