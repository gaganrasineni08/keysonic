import React, { useState, useRef, useEffect } from 'react';
import { useKeySonic } from '../../state/KeySonicContext';
import { AudioRecorder } from '../../audio/AudioRecorder';
import {
  Mic,
  MicOff,
  Square,
  Play,
  Scissors,
  Volume2,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const SoundRecorderView: React.FC = () => {
  const { addCustomSound, updateActiveProfile } = useKeySonic();
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(null);

  // Trim handles: start (0.0 to 1.0) and end (0.0 to 1.0)
  const [trimStart, setTrimStart] = useState<number>(0.0);
  const [trimEnd, setTrimEnd] = useState<number>(1.0);

  // Normalization status
  const [isNormalized, setIsNormalized] = useState(false);

  // Metadata
  const [soundName, setSoundName] = useState('My Mic Switch Recording');
  const [assignDirectlyToKey, setAssignDirectlyToKey] = useState<string>('Space');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Start recording
  const handleStartRecord = async () => {
    try {
      setMicPermissionDenied(false);
      await recorderRef.current.startRecording();
      setRecordingState('recording');
    } catch (err) {
      console.warn('Microphone access blocked:', err);
      setMicPermissionDenied(true);
      setRecordingState('idle');
    }
  };

  // Stop recording
  const handleStopRecord = async () => {
    try {
      const buffer = await recorderRef.current.stopRecording();
      setRecordedBuffer(buffer);
      setRecordingState('recorded');
      setTrimStart(0.0);
      setTrimEnd(1.0);
      setIsNormalized(false);
    } catch (err) {
      console.error('Stop recording failed:', err);
      setRecordingState('idle');
    }
  };

  // Draw waveform onto canvas
  useEffect(() => {
    if (!canvasRef.current || !recordedBuffer) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#080a10';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform data
    const data = recordedBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();

    // Highlight trimmed active section
    const startX = trimStart * width;
    const endX = trimEnd * width;

    // Darken trimmed outside areas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, startX, height);
    ctx.fillRect(endX, 0, width - endX, height);

    // Trim markers
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, height);
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX, height);
    ctx.stroke();
  }, [recordedBuffer, trimStart, trimEnd]);

  // Trim apply
  const handleApplyTrim = () => {
    const trimmed = recorderRef.current.trimBuffer(trimStart, trimEnd);
    if (trimmed) {
      setRecordedBuffer(trimmed);
      setTrimStart(0.0);
      setTrimEnd(1.0);
    }
  };

  // Peak Normalize
  const handleNormalize = () => {
    const normalized = recorderRef.current.normalizeBuffer();
    if (normalized) {
      setRecordedBuffer(normalized);
      setIsNormalized(true);
    }
  };

  // Preview recorded buffer
  const handlePreviewBuffer = () => {
    if (!recordedBuffer) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const source = ctx.createBufferSource();
    source.buffer = recordedBuffer;
    source.connect(ctx.destination);
    source.start();
  };

  // Save sound & assign to profile
  const handleSaveAndAssign = () => {
    if (!recordedBuffer) return;
    const wavBytes = recorderRef.current.bufferToWav(recordedBuffer);
    const soundId = `rec-${Date.now()}`;

    const newSoundItem = {
      id: soundId,
      name: soundName || 'Mic Recording',
      category: 'Custom' as const,
      description: 'Recorded from physical switch via microphone in KeySonic Sound Studio.',
      tags: ['microphone', 'custom-recorded'],
      isCustom: true,
    };

    addCustomSound(newSoundItem, wavBytes);

    if (assignDirectlyToKey) {
      updateActiveProfile(prev => {
        const prevConfig = prev.keyMappings[assignDirectlyToKey] || {
          key: assignDirectlyToKey,
          label: assignDirectlyToKey,
          soundId,
          volume: 95,
          pitch: 0,
          attack: 0,
          decay: 180,
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
            [assignDirectlyToKey]: { ...prevConfig, soundId }
          }
        };
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setRecordingState('idle');
      setRecordedBuffer(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Sound Recorder Studio</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Record real mechanical switches from your physical desk setup, trim transients, normalize, and assign to keys
            </p>
          </div>
        </div>
      </div>

      {/* Permission Warning if Denied */}
      {micPermissionDenied && (
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold">Microphone Permission Denied or Unavailable</span>
            <p className="text-rose-300/80">
              Please click the lock/settings icon in your browser address bar to allow microphone access, then try again.
              KeySonic does not require microphone access for built-in switch playback or normal keyboard operation.
            </p>
          </div>
        </div>
      )}

      {/* Studio Workbench */}
      <div className="rounded-3xl bg-[#12141c] border border-white/10 p-6 flex flex-col gap-6 shadow-xl max-w-3xl mx-auto w-full">
        {/* Step 1: Record Stage */}
        <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5 gap-4">
          {recordingState === 'idle' && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleStartRecord}
                className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center shadow-xl shadow-rose-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <Mic className="w-8 h-8" />
              </button>
              <span className="text-xs font-semibold text-white">Click to Start Recording</span>
              <span className="text-[11px] text-slate-400">Position your microphone near your keyboard switch</span>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
                <button
                  onClick={handleStopRecord}
                  className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 relative z-10 transition-all"
                >
                  <Square className="w-7 h-7 fill-current" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                RECORDING AUDIO... CLICK SQUARE TO FINISH
              </div>
            </div>
          )}

          {recordingState === 'recorded' && recordedBuffer && (
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  Recorded Audio Waveform ({Math.round(recordedBuffer.duration * 1000)} ms)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviewBuffer}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all hover:bg-cyan-500/30"
                  >
                    <Play className="w-3.5 h-3.5" /> Audition
                  </button>
                  <button
                    onClick={() => { setRecordingState('idle'); setRecordedBuffer(null); }}
                    className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                    title="Discard & re-record"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Waveform Canvas */}
              <canvas
                ref={canvasRef}
                width={700}
                height={140}
                className="w-full h-36 rounded-xl border border-white/10"
              />

              {/* Trimming Handles */}
              <div className="flex flex-col gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-pink-400" />
                    Trim Region Handles
                  </span>
                  <button
                    onClick={handleApplyTrim}
                    className="px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold text-xs hover:bg-pink-500/30 transition-all"
                  >
                    Apply Trim Crop
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400">Start Trim ({Math.round(trimStart * 100)}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="0.9"
                      step="0.01"
                      value={trimStart}
                      onChange={(e) => setTrimStart(Math.min(Number(e.target.value), trimEnd - 0.05))}
                      className="accent-pink-400 h-1.5 bg-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400">End Trim ({Math.round(trimEnd * 100)}%)</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.01"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Math.max(Number(e.target.value), trimStart + 0.05))}
                      className="accent-pink-400 h-1.5 bg-slate-800"
                    />
                  </div>
                </div>

                {/* Normalization button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Peak Gain Normalization (-0.2 dBFS):</span>
                  <button
                    onClick={handleNormalize}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isNormalized
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                    }`}
                  >
                    {isNormalized ? <Check className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {isNormalized ? 'Normalized' : 'Normalize Peak'}
                  </button>
                </div>
              </div>

              {/* Save & Assign Form */}
              <div className="flex flex-col gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300">Sound Name:</label>
                  <input
                    type="text"
                    value={soundName}
                    onChange={(e) => setSoundName(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300">Quick Assign to Physical Key:</label>
                  <select
                    value={assignDirectlyToKey}
                    onChange={(e) => setAssignDirectlyToKey(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Space">Spacebar</option>
                    <option value="Enter">Enter Key</option>
                    <option value="Backspace">Backspace</option>
                    <option value="KeyA">Key A</option>
                    <option value="Escape">Escape</option>
                    <option value="">Don't assign yet (Library only)</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveAndAssign}
                  className="mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {saveSuccess ? '✓ Saved to Sound Library & Assigned!' : 'Save Sound & Assign to Keyboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
