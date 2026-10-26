import React, { useState } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { KeySonicProfile, SoundPack } from '../../types/keysonic';
import {
  FolderArchive,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Check,
  Disc,
  Package,
  Sparkles,
  Play,
  Volume2,
  Edit2
} from 'lucide-react';

export const ProfilesView: React.FC = () => {
  const {
    profiles,
    activeProfileId,
    activateProfile,
    createProfile,
    duplicateProfile,
    deleteProfile,
    exportProfile,
    importProfile,
    updateActiveProfile,
    sounds,
    previewSound,
    soundPacks,
    createSoundPack,
    exportSoundPack,
    importSoundPack
  } = useKeySonic();

  const [activeTab, setActiveTab] = useState<'profiles' | 'packs' | 'creator'>('profiles');
  const [newProfileName, setNewProfileName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Sound Pack Creator state
  const [packName, setPackName] = useState('My Custom Pack');
  const [packAuthor, setPackAuthor] = useState('KeySonic User');
  const [packDescription, setPackDescription] = useState('Custom crafted switch assortment.');
  const [selectedPackSounds, setSelectedPackSounds] = useState<string[]>(['thock-deep', 'mech-blue', 'click-crisp']);
  const [packSavedSuccess, setPackSavedSuccess] = useState(false);

  const handleCreateSubmit = () => {
    if (!newProfileName.trim()) return;
    createProfile(newProfileName.trim());
    setNewProfileName('');
    setShowCreateModal(false);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importProfile(importJsonText);
    if (success) {
      setImportJsonText('');
      setShowImportModal(false);
    } else {
      alert('Invalid profile JSON structure. Please check the file and try again.');
    }
  };

  const handleExportDownload = (profile: KeySonicProfile) => {
    const jsonStr = exportProfile(profile.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KeySonic-Profile-${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartRename = (profile: KeySonicProfile) => {
    setEditingProfileId(profile.id);
    setEditingName(profile.name);
  };

  const handleSaveRename = (profileId: string) => {
    if (editingName.trim()) {
      updateActiveProfile(prev => ({
        ...prev,
        name: editingName.trim(),
      }));
    }
    setEditingProfileId(null);
  };

  const handleSavePack = () => {
    const newPack: SoundPack = {
      id: `pack-${Date.now()}`,
      name: packName,
      author: packAuthor,
      description: packDescription,
      version: '1.0.0',
      previewSoundId: selectedPackSounds[0] || 'thock-deep',
      sounds: sounds.filter(s => selectedPackSounds.includes(s.id)),
      defaultProfile: {
        globalSoundId: selectedPackSounds[0] || 'thock-deep',
      }
    };
    createSoundPack(newPack);
    setPackSavedSuccess(true);
    setTimeout(() => {
      setPackSavedSuccess(false);
      setActiveTab('packs');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
            <FolderArchive className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Profiles & Sound Packs</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage custom sound profiles, switch mappings, and modular import/export sound packs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            Import JSON
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'profiles'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          Profiles ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('packs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'packs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          Sound Packs ({soundPacks.length})
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'creator'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Sound Pack Creator
        </button>
      </div>

      {/* Tab 1: Profiles Grid */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(profile => {
            const isActive = profile.id === activeProfileId;
            const globalSound = sounds.find(s => s.id === profile.globalSoundId);
            const isEditing = editingProfileId === profile.id;

            return (
              <div
                key={profile.id}
                className={`rounded-2xl bg-[#12141c] border p-5 flex flex-col justify-between gap-4 transition-all ${
                  isActive
                    ? 'border-amber-500/50 shadow-xl shadow-amber-950/30 ring-1 ring-amber-500/30'
                    : 'border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSaveRename(profile.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{profile.name}</h3>
                          <button
                            onClick={() => handleStartRename(profile)}
                            className="text-slate-500 hover:text-slate-300"
                            title="Rename Profile"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-cyan-400">
                        Mode {profile.mappingMode} • {globalSound?.name || profile.globalSoundId}
                      </span>
                    </div>

                    {isActive && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {profile.description || 'Custom profile containing specific switch acoustics.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-black/30 p-2.5 rounded-xl border border-white/5 mt-1">
                    <div>Vol: {profile.volume}%</div>
                    <div>Spatial: {profile.spatialAudio}</div>
                    <div>Adaptive: {profile.adaptiveClack.enabled ? 'ON' : 'OFF'}</div>
                    <div>Energy: {profile.typingEnergy.enabled ? 'ON' : 'OFF'}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => previewSound(profile.globalSoundId)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400"
                      title="Preview Global Sound"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateProfile(profile.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Duplicate Profile"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleExportDownload(profile)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Export Profile as JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => activateProfile(profile.id)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Sound Packs */}
      {activeTab === 'packs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {soundPacks.map(pack => (
            <div
              key={pack.id}
              className="rounded-2xl bg-[#12141c] border border-white/10 p-5 flex flex-col justify-between gap-4 shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">{pack.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    v{pack.version} • by {pack.author}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {pack.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {pack.sounds.map(s => (
                    <span
                      key={s.id}
                      className="text-[10px] font-mono text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 px-2 py-0.5 rounded"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  onClick={() => previewSound(pack.previewSoundId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-medium"
                >
                  <Play className="w-3 h-3" /> Preview Pack
                </button>

                <button
                  onClick={() => {
                    const json = exportSoundPack(pack.id);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${pack.name.replace(/\s+/g, '_')}.keysonic-pack.json`;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
                >
                  <Download className="w-3 h-3" /> Export Pack File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Sound Pack Creator */}
      {activeTab === 'creator' && (
        <div className="rounded-2xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-2xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Sound Pack Designer Studio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Curate a bundle of sounds and export them as a distributable `.keysonic-pack.json` package
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Pack Name:</label>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Author Name:</label>
              <input
                type="text"
                value={packAuthor}
                onChange={(e) => setPackAuthor(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Description:</label>
              <textarea
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white h-20 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">Select Included Sounds:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/5">
                {sounds.map(s => {
                  const isChecked = selectedPackSounds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs border transition-colors ${
                        isChecked
                          ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                          : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPackSounds(prev => [...prev, s.id]);
                          else setSelectedPackSounds(prev => prev.filter(id => id !== s.id));
                        }}
                        className="rounded accent-purple-500"
                      />
                      <span className="truncate">{s.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSavePack}
              className="mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-purple-500/20"
            >
              {packSavedSuccess ? '✓ Pack Created & Saved!' : 'Generate & Save Sound Pack'}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create Profile */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141c] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              Create New Sound Profile
            </h3>
            <p className="text-xs text-slate-400">
              Create a fresh profile template initialized from the currently active switch configuration.
            </p>

            <input
              type="text"
              placeholder="e.g. Tactile Workstation, Midnight Coding"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!newProfileName.trim()}
                onClick={handleCreateSubmit}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all disabled:opacity-40"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Profile */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141c] border border-cyan-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Import Profile JSON
            </h3>
            <p className="text-xs text-slate-400">
              Paste exported profile JSON data below or select a `.json` file from disk.
            </p>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste KeySonic profile JSON here..."
              className="w-full h-44 bg-black/50 border border-white/10 rounded-xl p-3 font-mono text-[11px] text-cyan-200 focus:outline-none focus:border-cyan-500 resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setImportJsonText(event.target?.result as string || '');
                    };
                    reader.readAsText(file);
                  }
                }}
                className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/10 file:text-white cursor-pointer"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  disabled={!importJsonText.trim()}
                  onClick={handleImportSubmit}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all disabled:opacity-40"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
