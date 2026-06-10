export type ThemeName = 'ancient' | 'medieval' | 'empire' | 'modern';

export const THEMES: Record<ThemeName, {
  label: string;
  era: string;
  bg: string;
  gradientFrom: string;
  gradientTo: string;
  orb1: string;
  orb2: string;
  accent: string;
  questionRange: string;
}> = {
  ancient: {
    label: 'Roman & Ancient Britain',
    era: 'c. 55 BC – 1066 AD',
    bg: '#110A02',
    gradientFrom: '#1F1005',
    gradientTo: '#0D0800',
    orb1: '#8B5E1A',
    orb2: '#5C3A0A',
    accent: '#D4963A',
    questionRange: 'Questions 1–6',
  },
  medieval: {
    label: 'Medieval & Tudor Era',
    era: 'c. 1066 – 1603',
    bg: '#0C0512',
    gradientFrom: '#190928',
    gradientTo: '#080312',
    orb1: '#7B1D45',
    orb2: '#3A1260',
    accent: '#C9912A',
    questionRange: 'Questions 7–12',
  },
  empire: {
    label: 'Empire & Industrial Age',
    era: 'c. 1603 – 1914',
    bg: '#030F18',
    gradientFrom: '#041A28',
    gradientTo: '#020B14',
    orb1: '#155A6A',
    orb2: '#6B3820',
    accent: '#2AAABB',
    questionRange: 'Questions 13–18',
  },
  modern: {
    label: 'Modern Britain',
    era: 'c. 1914 – Present',
    bg: '#030B1F',
    gradientFrom: '#061230',
    gradientTo: '#020810',
    orb1: '#1A3E8A',
    orb2: '#0B2A5C',
    accent: '#4B8EF0',
    questionRange: 'Questions 19–24',
  },
};

export function getTheme(idx: number, total: number): ThemeName {
  const q = Math.floor(total / 4);
  if (idx < q)         return 'ancient';
  if (idx < q * 2)     return 'medieval';
  if (idx < q * 3)     return 'empire';
  return 'modern';
}

// ── Ancient: Roman Mosaic ──────────────────────────────────────────────
function AncientPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="mosaic" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect x="2"  y="2"  width="26" height="26" fill="none" stroke="#8B5E1A" strokeWidth="0.6" opacity="0.4" />
          <rect x="32" y="2"  width="26" height="26" fill="none" stroke="#8B5E1A" strokeWidth="0.6" opacity="0.4" />
          <rect x="2"  y="32" width="26" height="26" fill="none" stroke="#8B5E1A" strokeWidth="0.6" opacity="0.4" />
          <rect x="32" y="32" width="26" height="26" fill="none" stroke="#8B5E1A" strokeWidth="0.6" opacity="0.4" />
          <line x1="15" y1="2" x2="15" y2="28"  stroke="#C9912A" strokeWidth="0.4" opacity="0.25" />
          <line x1="2"  y1="15" x2="28" y2="15" stroke="#C9912A" strokeWidth="0.4" opacity="0.25" />
          <circle cx="15" cy="15" r="3" fill="#D4963A" opacity="0.15" />
          <circle cx="45" cy="45" r="3" fill="#D4963A" opacity="0.15" />
        </pattern>
        <pattern id="bigGrid" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="238" height="238" fill="none" stroke="#C9912A" strokeWidth="0.5" opacity="0.12" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mosaic)" />
      <rect width="100%" height="100%" fill="url(#bigGrid)" />

      {/* Large rotating diamond */}
      <g className="svg-rotate-slow" style={{ transformOrigin: '50% 50%' }}>
        <polygon
          points="50%,5% 95%,50% 50%,95% 5%,50%"
          fill="none"
          stroke="#C9912A"
          strokeWidth="0.8"
          opacity="0.12"
        />
        <polygon
          points="50%,12% 88%,50% 50%,88% 12%,50%"
          fill="none"
          stroke="#C9912A"
          strokeWidth="0.5"
          opacity="0.08"
        />
      </g>

      {/* Floating Roman arch silhouette */}
      <g className="svg-float" opacity="0.07">
        <path
          d="M 200 700 Q 200 500 300 500 Q 400 500 400 700 Z"
          fill="none"
          stroke="#D4963A"
          strokeWidth="1.5"
        />
        <path
          d="M 700 600 Q 700 400 800 400 Q 900 400 900 600 Z"
          fill="none"
          stroke="#D4963A"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

// ── Medieval: Gothic & Heraldic ────────────────────────────────────────
function MedievalPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="gothicGrid" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
          {/* Gothic arch shape */}
          <path
            d="M 10 100 L 10 50 Q 10 20 40 20 Q 70 20 70 50 L 70 100"
            fill="none"
            stroke="#7B1D45"
            strokeWidth="0.7"
            opacity="0.5"
          />
          <line x1="40" y1="20" x2="40" y2="0"  stroke="#C9912A" strokeWidth="0.4" opacity="0.2" />
        </pattern>
        <pattern id="crossPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="20" y1="0"  x2="20" y2="40" stroke="#3A1260" strokeWidth="0.5" opacity="0.4" />
          <line x1="0"  y1="20" x2="40" y2="20" stroke="#3A1260" strokeWidth="0.5" opacity="0.4" />
          <circle cx="20" cy="20" r="1.5" fill="#C9912A" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossPattern)" />
      <rect width="100%" height="100%" fill="url(#gothicGrid)" />

      {/* Large heraldic diamond */}
      <g className="svg-rotate-slow" style={{ transformOrigin: '50% 40%' }}>
        <polygon
          points="50%,8% 92%,40% 50%,72% 8%,40%"
          fill="none"
          stroke="#7B1D45"
          strokeWidth="1"
          opacity="0.15"
        />
      </g>

      {/* Stained-glass-style circles */}
      <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#7B1D45" strokeWidth="0.6" opacity="0.1" className="svg-pulse-opacity" />
      <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#C9912A" strokeWidth="0.5" opacity="0.08" />

      {/* Gothic arches on sides */}
      <g opacity="0.1" className="svg-float">
        <path d="M 80 800 L 80 400 Q 80 200 180 200 Q 280 200 280 400 L 280 800" fill="none" stroke="#C9912A" strokeWidth="1.5" />
        <path d="M 820 800 L 820 400 Q 820 200 920 200 Q 1020 200 1020 400 L 1020 800" fill="none" stroke="#C9912A" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// ── Empire: Victorian Compass Rose ────────────────────────────────────
function EmpirePattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="industrialGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="50" height="50" fill="none" stroke="#155A6A" strokeWidth="0.5" opacity="0.35" />
          <line x1="25" y1="0"  x2="25" y2="50" stroke="#2AAABB" strokeWidth="0.25" opacity="0.2" />
          <line x1="0"  y1="25" x2="50" y2="25" stroke="#2AAABB" strokeWidth="0.25" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#industrialGrid)" />

      {/* Victorian compass rose */}
      <g className="svg-rotate-med" style={{ transformOrigin: '50% 50%' }}>
        {[0, 45, 90, 135].map((angle) => (
          <g key={angle} transform={`rotate(${angle}, 960, 540)`}>
            <line x1="960" y1="200" x2="960" y2="880" stroke="#2AAABB" strokeWidth="0.7" opacity="0.18" />
          </g>
        ))}
        <circle cx="50%" cy="50%" r="200" fill="none" stroke="#2AAABB" strokeWidth="0.6" opacity="0.12" />
        <circle cx="50%" cy="50%" r="300" fill="none" stroke="#155A6A" strokeWidth="0.5" opacity="0.1" />
        <circle cx="50%" cy="50%" r="100" fill="none" stroke="#6B3820" strokeWidth="0.8" opacity="0.15" />
      </g>

      {/* Gear-like outer ring */}
      <g className="svg-rotate-slow" style={{ transformOrigin: '50% 50%' }}>
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r1 = 380;
          const r2 = 420;
          const x1 = 50 + Math.cos(angle) * r1 * 0.1;
          const y1 = 50 + Math.sin(angle) * r1 * 0.1;
          const x2 = 50 + Math.cos(angle) * r2 * 0.1;
          const y2 = 50 + Math.sin(angle) * r2 * 0.1;
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#2AAABB"
              strokeWidth="1"
              opacity="0.18"
            />
          );
        })}
      </g>

      {/* Industrial arch (bridge-like) */}
      <g opacity="0.08" className="svg-float">
        <path d="M 0 700 Q 480 200 960 700" fill="none" stroke="#2AAABB" strokeWidth="2" />
        <path d="M 0 750 Q 480 250 960 750" fill="none" stroke="#6B3820" strokeWidth="1" />
      </g>
    </svg>
  );
}

// ── Modern: Parliament & Contemporary ────────────────────────────────
function ModernPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="modernGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="32" height="32" fill="none" stroke="#1A3E8A" strokeWidth="0.4" opacity="0.3" />
        </pattern>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="#4B8EF0" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modernGrid)" />
      <rect width="100%" height="100%" fill="url(#dots)" />

      {/* Parliament silhouette (simplified) */}
      <g opacity="0.1" style={{ transform: 'translateY(10%)' }}>
        {/* Main building */}
        <rect x="15%" y="60%" width="70%" height="30%" fill="none" stroke="#4B8EF0" strokeWidth="1" />
        {/* Towers */}
        <rect x="15%" y="40%" width="8%" height="22%" fill="none" stroke="#4B8EF0" strokeWidth="0.8" />
        <rect x="77%" y="42%" width="8%" height="20%" fill="none" stroke="#4B8EF0" strokeWidth="0.8" />
        {/* Big Ben */}
        <rect x="13%" y="20%" width="12%" height="22%" fill="none" stroke="#4B8EF0" strokeWidth="1" />
        <polygon points="13%,20% 19%,12% 25%,20%" fill="none" stroke="#4B8EF0" strokeWidth="0.8" />
        {/* Windows row */}
        {[20, 28, 36, 44, 52, 60, 68, 76].map((x, i) => (
          <rect key={i} x={`${x}%`} y="65%" width="4%" height="6%" fill="none" stroke="#4B8EF0" strokeWidth="0.5" />
        ))}
      </g>

      {/* Animated horizontal scan lines */}
      <g className="svg-pulse-opacity">
        {[20, 35, 50, 65, 80].map((y, i) => (
          <line key={i} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#4B8EF0" strokeWidth="0.3" opacity="0.2" />
        ))}
      </g>

      {/* Central radial */}
      <g className="svg-rotate-slow" style={{ transformOrigin: '50% 50%' }}>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r = 0.42;
          const x2 = 50 + Math.cos(angle) * r * 100;
          const y2 = 50 + Math.sin(angle) * r * 100;
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#1A3E8A"
              strokeWidth="0.4"
              opacity="0.15"
            />
          );
        })}
        <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#1A3E8A" strokeWidth="0.5" opacity="0.12" />
      </g>
    </svg>
  );
}

// ── Main export ────────────────────────────────────────────────────────
interface ThemeBackgroundProps {
  theme: ThemeName;
  transitioning?: boolean;
}

export default function ThemeBackground({ theme, transitioning }: ThemeBackgroundProps) {
  const t = THEMES[theme];

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden theme-bg"
      style={{ background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientTo} 100%)` }}
    >
      {/* Glow orbs */}
      <div
        className="glow-orb absolute"
        style={{
          width: '55vw',
          height: '55vw',
          background: t.orb1,
          top: '-20%',
          left: '-15%',
        }}
      />
      <div
        className="glow-orb absolute"
        style={{
          width: '45vw',
          height: '45vw',
          background: t.orb2,
          bottom: '-15%',
          right: '-10%',
          animationDelay: '-3s',
        }}
      />

      {/* Theme-specific SVG patterns */}
      <div
        className={`absolute inset-0 theme-layer ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {theme === 'ancient'  && <AncientPattern />}
        {theme === 'medieval' && <MedievalPattern />}
        {theme === 'empire'   && <EmpirePattern />}
        {theme === 'modern'   && <ModernPattern />}
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Bottom fog */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${t.bg}, transparent)`,
        }}
      />
    </div>
  );
}
