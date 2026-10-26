# KeySonic 🔊⌨️

> **A programmable, customizable acoustic layer for physical keyboards.**

KeySonic turns any standard laptop or desktop physical keyboard into an acoustic masterpiece. With authentic mechanical switch recordings, dynamic typing-speed acoustics, spatial stereo positioning, and a native system-wide daemon, KeySonic brings tactile and acoustic feedback to your typing experience in any application.

---

## ✨ Features

- **Authentic Mechanical Audio Engine**: High-fidelity recordings with natural variations (`GENERIC_R0` to `R4`), distinct spacebar resonant bloom, enter key clack, and backspace actuation.
  - **Holy Panda**: The enthusiast benchmark for deep tactile "thock"
  - **Cherry MX Blue**: Crisp, loud mechanical click-leaf actuation
  - **NovelKeys Cream**: Smooth self-lubricating POM buttery clack
  - **Cherry MX Brown**: Balanced office-friendly tactile bump
  - **Cherry MX Black**: 60cN heavy linear spring with solid bottom-out
  - **Tealios V2 / Turquoise**: Low-friction custom linear gaming switch
  - **Vintage Typewriter**: Cast-iron hammer impacts with authentic carriage bell return on Enter
  - **Cyber RGB**: Snappy futuristic gaming switch
- **System-Wide Laptop Mode**: Native macOS background daemon (`daemon/keysonic-daemon`) intercepts keystrokes across all applications (VS Code, Chrome, Terminal, Slack, etc.) with zero latency using Apple `CGEventTap` and polyphonic `NSSound` hardware acceleration.
- **Bi-Directional IPC**: Instant synchronization between Web UI and the native daemon via HTTP IPC (`http://127.0.0.1:6123`).
- **Flexible Mapping Modes**:
  - **Mode A (Global)**: Uniform sound across all keys.
  - **Mode B (Categorized)**: Distinct sounds for letters, numbers, and special keys.
  - **Mode C (Key Groups)**: Map sounds to modifiers, navigation, function keys, and arrows.
  - **Mode D (Individual Mapping)**: Customize every physical key individually.
- **Adaptive Clack**: Dynamic audio modulation reacting in real time to your WPM (typing speed).
- **Typing Energy**: Sound dynamically intensifies during rapid typing bursts.
- **Spatial Stereo Audio**: Stereo positioning matches physical key locations across the keyboard.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- macOS (for native system-wide daemon; the web studio runs on all platforms)

### 2. Install & Run Web Studio
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Compile & Run Native macOS Daemon (Optional for System-Wide Typing)
```bash
# Compile the native daemon
clang -O3 -framework Cocoa -framework ApplicationServices -framework AudioToolbox \
  -o daemon/keysonic-daemon daemon/keysonic-daemon.m

# Run the daemon
./daemon/keysonic-daemon
```
> **Note**: Grant Accessibility permissions when prompted in **System Settings > Privacy & Security > Accessibility** so the daemon can intercept global keystrokes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Web Audio**: Web Audio API (`AudioContext`, `BiquadFilterNode`, `StereoPannerNode`, `AudioBuffer`)
- **Native Daemon**: Objective-C, Cocoa, Apple CoreAudio / AudioToolbox, ApplicationServices (`CGEventTap`)

---

## 📄 License

MIT License. Designed & Built for KeySonic.
