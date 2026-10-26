import { SoundItem } from '../types/keysonic';

export const BUILT_IN_SOUNDS: SoundItem[] = [
  // Authentic Mechanical Switches
  {
    id: 'holy-panda',
    name: 'Holy Panda Tactile (Thock)',
    category: 'Mechanical',
    description: 'Authentic Holy Panda recording: the enthusiast gold standard for tactile thock with resonant brass plate bloom.',
    tags: ['authentic', 'tactile', 'thock', 'enthusiast', 'deep']
  },
  {
    id: 'mech-blue',
    name: 'Cherry MX Blue (Clicky)',
    category: 'Mechanical',
    description: 'Authentic Cherry MX Blue recording: crisp mechanical click leaf actuation with distinct loud tactile snap.',
    tags: ['authentic', 'clicky', 'tactile', 'loud', 'crisp']
  },
  {
    id: 'mech-creamy',
    name: 'NovelKeys Cream (POM Lubed)',
    category: 'Mechanical',
    description: 'Authentic NovelKeys Cream recording: silky self-lubricating POM housing with buttery dampened bottom-out.',
    tags: ['authentic', 'creamy', 'lubed', 'linear', 'satisfying']
  },
  {
    id: 'mech-brown',
    name: 'Cherry MX Brown (Tactile)',
    category: 'Mechanical',
    description: 'Authentic Cherry MX Brown recording: balanced office-friendly tactile bump with gentle mechanical bottom-out.',
    tags: ['authentic', 'tactile', 'balanced', 'workplace']
  },
  {
    id: 'mech-black',
    name: 'Cherry MX Black (Heavy Linear)',
    category: 'Mechanical',
    description: 'Authentic Cherry MX Black recording: weighted 60cN linear spring with solid high-mass plate clack.',
    tags: ['authentic', 'linear', 'heavy', 'firm']
  },
  {
    id: 'turquoise',
    name: 'Tealios V2 / Turquoise (Custom Linear)',
    category: 'Mechanical',
    description: 'Authentic custom lubed linear recording: ultra-smooth frictionless keystroke with clean snappy actuation.',
    tags: ['authentic', 'linear', 'smooth', 'custom', 'gaming']
  },
  {
    id: 'classic-typewriter',
    name: 'Cast-Iron Mechanical Typewriter',
    category: 'Classic',
    description: 'Authentic antique typewriter recording: cast-iron hammer strike on paper platen with carriage return bell on Enter.',
    tags: ['authentic', 'typewriter', 'vintage', 'metallic']
  },
  {
    id: 'future-cyber',
    name: 'Cyber RGB Gaming Switch',
    category: 'Gaming',
    description: 'Authentic low-latency gaming switch recording: snappy micro-switch actuation with futuristic tactile response.',
    tags: ['authentic', 'gaming', 'rgb', 'esports', 'fast']
  },

  // Thock
  {
    id: 'thock-deep',
    name: 'Deep Thock',
    category: 'Thock',
    description: 'Deep resonant cavity acoustic bloom with heavy brass plate bottom-out.',
    tags: ['thock', 'deep', 'bassy', 'satisfying']
  },
  {
    id: 'thock-soft',
    name: 'Soft Thock',
    category: 'Thock',
    description: 'Cushioned silicone silencer pad with gentle low-frequency warmth.',
    tags: ['thock', 'soft', 'muffled']
  },
  {
    id: 'thock-creamy',
    name: 'Creamy Thock',
    category: 'Thock',
    description: 'Rich buttery thock tuned with acoustic foam and POM plate resonance.',
    tags: ['creamy', 'thock', 'custom']
  },
  {
    id: 'thock-heavy',
    name: 'Heavy Thock',
    category: 'Thock',
    description: 'Sub-bass bottom-out with solid aluminum casing resonance.',
    tags: ['thock', 'heavy', 'weighty']
  },

  // Click
  {
    id: 'click-crisp',
    name: 'Crisp Click',
    category: 'Click',
    description: 'Snappy high-frequency impulse transient with clean decay.',
    tags: ['crisp', 'bright', 'clear']
  },
  {
    id: 'click-sharp',
    name: 'Sharp Click',
    category: 'Click',
    description: 'Piercing metallic snap mimicking micro-switch contact leaves.',
    tags: ['sharp', 'metallic', 'distinct']
  },
  {
    id: 'click-light',
    name: 'Light Click',
    category: 'Click',
    description: 'Delicate high-pitched tap with minimal reverberation.',
    tags: ['light', 'quiet', 'discrete']
  },
  {
    id: 'click-heavy',
    name: 'Heavy Click',
    category: 'Click',
    description: 'Robust clack with solid keycap return pop.',
    tags: ['heavy', 'punchy', 'clack']
  },

  // Classic
  {
    id: 'classic-typewriter',
    name: 'Typewriter',
    category: 'Classic',
    description: 'Cast-iron hammer striking platen with distinct mechanical link movement.',
    tags: ['vintage', 'metal', 'typewriter']
  },
  {
    id: 'classic-vintage-typewriter',
    name: 'Vintage Typewriter',
    category: 'Classic',
    description: 'Heavy 1930s manual typewriter with carriage clank and bell harmonics.',
    tags: ['antique', 'iron', 'heavy']
  },
  {
    id: 'classic-retro-keyboard',
    name: 'Retro Keyboard',
    category: 'Classic',
    description: '1980s IBM Model M buckling spring with characteristic musical spring resonance.',
    tags: ['ibm', 'buckling-spring', 'vintage', 'legendary']
  },

  // Gaming
  {
    id: 'gaming-mech',
    name: 'Gaming Mechanical',
    category: 'Gaming',
    description: 'Rapid 1.2mm actuation switch with crisp ultra-fast auditory response.',
    tags: ['gaming', 'speed', 'reactive']
  },
  {
    id: 'gaming-rapid-click',
    name: 'Rapid Click',
    category: 'Gaming',
    description: 'Ultra-short travel click tuned for high APM and intense key spam.',
    tags: ['apm', 'rapid', 'snappy']
  },
  {
    id: 'gaming-esports',
    name: 'Esports',
    category: 'Gaming',
    description: 'Tournament-grade optical mechanical switch with laser-sharp report.',
    tags: ['optical', 'esports', 'clean']
  },
  {
    id: 'gaming-rgb',
    name: 'RGB-style keyboard',
    category: 'Gaming',
    description: 'Hollow gamer chassis clack with lively acoustic reflections.',
    tags: ['rgb', 'gamer', 'clatter']
  },

  // Futuristic
  {
    id: 'future-scifi',
    name: 'Sci-Fi',
    category: 'Futuristic',
    description: 'Ionized plasma chirp with subtle spatial stereo dispersion.',
    tags: ['laser', 'plasma', 'scifi']
  },
  {
    id: 'future-cyber',
    name: 'Cyber',
    category: 'Futuristic',
    description: 'Cyberpunk holographic key tap with sub-harmonic electronic punch.',
    tags: ['cyber', 'neon', 'electronic']
  },
  {
    id: 'future-digital',
    name: 'Digital',
    category: 'Futuristic',
    description: 'Minimalist clean UI feedback beep with zero analog imperfections.',
    tags: ['digital', 'clean', 'futuristic']
  },
  {
    id: 'future-robotic',
    name: 'Robotic',
    category: 'Futuristic',
    description: 'Micro-servo relay click with precision machine timing.',
    tags: ['servo', 'robot', 'industrial']
  },
  {
    id: 'future-holographic',
    name: 'Holographic',
    category: 'Futuristic',
    description: 'Ethereal glass projection click with crystalline dissipation.',
    tags: ['hologram', 'shimmer', 'light']
  },

  // Ambient
  {
    id: 'ambient-soft',
    name: 'Soft',
    category: 'Ambient',
    description: 'Felt-dampened membrane keystroke for zero-distraction typing.',
    tags: ['quiet', 'office', 'subtle']
  },
  {
    id: 'ambient-rain',
    name: 'Rain-like',
    category: 'Ambient',
    description: 'Organic gentle pitter-patter sound evoking raindrops on skylight.',
    tags: ['rain', 'calming', 'organic']
  },
  {
    id: 'ambient-wooden',
    name: 'Wooden',
    category: 'Ambient',
    description: 'Rosewood marimba bar strike with organic acoustic decay.',
    tags: ['wood', 'organic', 'marimba']
  },
  {
    id: 'ambient-glassy',
    name: 'Glassy',
    category: 'Ambient',
    description: 'Crystal glass rim contact with crystalline overtone sparkle.',
    tags: ['glass', 'crystal', 'pure']
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  Mechanical: '#38bdf8', // sky
  Thock: '#a855f7',      // purple
  Click: '#10b981',      // emerald
  Classic: '#f59e0b',    // amber
  Gaming: '#ef4444',     // red
  Futuristic: '#06b6d4', // cyan
  Ambient: '#84cc16',    // lime
  Custom: '#ec4899',     // pink
};
