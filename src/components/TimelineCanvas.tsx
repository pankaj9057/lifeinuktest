import { useMemo } from 'react';
import { EraName, getEraOpacity } from '../hooks/useCamera';

// ── Parallax speeds ───────────────────────────────────────────────────
const SPEED_DEEP = 0.12;
const SPEED_MID  = 0.30;
const SPEED_FORE = 0.56;

function translate(x: number, speed: number) {
  return `translate3d(${(-x * speed).toFixed(2)}px, 0, 0)`;
}

// ── Ancient / Roman era art ───────────────────────────────────────────
function AncientDeep() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="mosaic-d" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect x="2"  y="2"  width="28" height="28" fill="none" stroke="#8B5E1A" strokeWidth="0.7" opacity="0.5"/>
          <rect x="34" y="2"  width="28" height="28" fill="none" stroke="#8B5E1A" strokeWidth="0.7" opacity="0.5"/>
          <rect x="2"  y="34" width="28" height="28" fill="none" stroke="#8B5E1A" strokeWidth="0.7" opacity="0.5"/>
          <rect x="34" y="34" width="28" height="28" fill="none" stroke="#8B5E1A" strokeWidth="0.7" opacity="0.5"/>
          <circle cx="18" cy="18" r="4" fill="#C9912A" opacity="0.12"/>
          <circle cx="50" cy="50" r="4" fill="#C9912A" opacity="0.12"/>
        </pattern>
        <pattern id="big-grid" width="256" height="256" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="256" height="256" fill="none" stroke="#C9912A" strokeWidth="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mosaic-d)"/>
      <rect width="100%" height="100%" fill="url(#big-grid)"/>
      {/* Rotating diamond frame */}
      <g className="svg-spin-slow" style={{transformOrigin:'960px 540px'}}>
        <polygon points="960,80 1840,540 960,1000 80,540" fill="none" stroke="#C9912A" strokeWidth="1" opacity="0.1"/>
        <polygon points="960,160 1760,540 960,920 160,540" fill="none" stroke="#C9912A" strokeWidth="0.6" opacity="0.07"/>
      </g>
    </svg>
  );
}

function AncientMid() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Roman arched aqueduct silhouette */}
      <g opacity="0.18" className="svg-drift">
        {[180,380,580,780,980,1180,1380,1580,1780].map((x,i)=>(
          <g key={i}>
            <path d={`M ${x} 960 L ${x} 600 Q ${x} 520 ${x+60} 520 Q ${x+120} 520 ${x+120} 600 L ${x+120} 960`}
              fill="none" stroke="#D4963A" strokeWidth="2.5"/>
            <rect x={x-10} y={600} width={140} height={12} fill="#D4963A" opacity="0.4"/>
          </g>
        ))}
        <line x1="0" y1="600" x2="1920" y2="600" stroke="#D4963A" strokeWidth="3" opacity="0.3"/>
      </g>
      {/* Roman columns */}
      <g opacity="0.22" className="svg-rise">
        {[240,640,1040,1440,1840].map((x,i)=>(
          <g key={i}>
            <rect x={x} y={180} width={28} height={680} fill="none" stroke="#D4963A" strokeWidth="1.5"/>
            <rect x={x-12} y={170} width={52} height={18} fill="none" stroke="#D4963A" strokeWidth="1.5"/>
            <rect x={x-16} y={840} width={60} height={22} fill="none" stroke="#D4963A" strokeWidth="1.5"/>
            {/* Column fluting */}
            {[0,6,12,18,24].map(dx=>(
              <line key={dx} x1={x+dx+1} y1={192} x2={x+dx+1} y2={838} stroke="#D4963A" strokeWidth="0.5" opacity="0.5"/>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

function AncientFore() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Large eagle emblem */}
      <g opacity="0.12" style={{transform:'translate(860px,220px) scale(1.8)'}}>
        <ellipse cx="60" cy="60" rx="55" ry="55" fill="none" stroke="#D4963A" strokeWidth="1.5"/>
        <path d="M 60 20 L 75 40 L 95 35 L 80 55 L 90 75 L 70 65 L 60 85 L 50 65 L 30 75 L 40 55 L 25 35 L 45 40 Z"
          fill="none" stroke="#D4963A" strokeWidth="1.5"/>
      </g>
      {/* Laurel wreath arc */}
      <g opacity="0.15" className="svg-pulse-o">
        <path d="M 760 900 Q 960 700 1160 900" fill="none" stroke="#D4963A" strokeWidth="2"/>
        <path d="M 740 920 Q 960 680 1180 920" fill="none" stroke="#D4963A" strokeWidth="1"/>
      </g>
    </svg>
  );
}

// ── Medieval / Tudor era art ──────────────────────────────────────────
function MedievalDeep() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="cross-p" width="48" height="48" patternUnits="userSpaceOnUse">
          <line x1="24" y1="0" x2="24" y2="48" stroke="#4A1060" strokeWidth="0.5" opacity="0.5"/>
          <line x1="0" y1="24" x2="48" y2="24" stroke="#4A1060" strokeWidth="0.5" opacity="0.5"/>
          <circle cx="24" cy="24" r="2" fill="#B87E3A" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cross-p)"/>
      {/* Stained glass circles */}
      <g className="svg-pulse-o" opacity="0.6">
        <circle cx="960" cy="540" r="380" fill="none" stroke="#6B1030" strokeWidth="1" opacity="0.18"/>
        <circle cx="960" cy="540" r="260" fill="none" stroke="#B87E3A" strokeWidth="0.8" opacity="0.12"/>
        <circle cx="960" cy="540" r="140" fill="none" stroke="#6B1030" strokeWidth="0.6" opacity="0.1"/>
      </g>
    </svg>
  );
}

function MedievalMid() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Gothic cathedral silhouette */}
      <g opacity="0.2" className="svg-rise">
        {/* Main nave */}
        <rect x="760" y="250" width="400" height="720" fill="none" stroke="#B87E3A" strokeWidth="2"/>
        {/* Central spire */}
        <polygon points="960,40 1010,250 910,250" fill="none" stroke="#B87E3A" strokeWidth="2"/>
        {/* Flanking towers */}
        <rect x="660" y="350" width="120" height="620" fill="none" stroke="#B87E3A" strokeWidth="1.5"/>
        <polygon points="720,280 750,350 690,350" fill="none" stroke="#B87E3A" strokeWidth="1.5"/>
        <rect x="1140" y="350" width="120" height="620" fill="none" stroke="#B87E3A" strokeWidth="1.5"/>
        <polygon points="1200,280 1230,350 1170,350" fill="none" stroke="#B87E3A" strokeWidth="1.5"/>
        {/* Rose window */}
        <circle cx="960" cy="380" r="55" fill="none" stroke="#B87E3A" strokeWidth="1.5"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
          const r=a*Math.PI/180;
          return <line key={i} x1="960" y1="380" x2={960+Math.cos(r)*55} y2={380+Math.sin(r)*55} stroke="#B87E3A" strokeWidth="0.8"/>;
        })}
        {/* Gothic arched windows */}
        {[800,880,960,1040,1120].map((x,i)=>(
          <path key={i} d={`M ${x} 700 L ${x} 540 Q ${x} 480 ${x+30} 480 Q ${x+60} 480 ${x+60} 540 L ${x+60} 700`}
            fill="none" stroke="#B87E3A" strokeWidth="1"/>
        ))}
      </g>
      {/* Castle battlements on horizon */}
      <g opacity="0.15">
        <line x1="0" y1="850" x2="1920" y2="850" stroke="#6B1030" strokeWidth="2"/>
        {Array.from({length:40},(_,i)=>(
          <rect key={i} x={i*50} y={830} width={26} height={22} fill="none" stroke="#6B1030" strokeWidth="1.5"/>
        ))}
      </g>
    </svg>
  );
}

function MedievalFore() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Tudor rose – large decorative */}
      <g opacity="0.14" style={{transform:'translate(820px,300px)'}}>
        {[0,45,90,135,180,225,270,315].map((a,i)=>{
          const r=a*Math.PI/180;
          return <ellipse key={i} cx={140+Math.cos(r)*50} cy={140+Math.sin(r)*50}
            rx="28" ry="16"
            transform={`rotate(${a},${140+Math.cos(r)*50},${140+Math.sin(r)*50})`}
            fill="none" stroke="#B87E3A" strokeWidth="1.5"/>;
        })}
        <circle cx="140" cy="140" r="28" fill="none" stroke="#B87E3A" strokeWidth="2"/>
      </g>
      {/* Heraldic shield outline */}
      <g opacity="0.12" style={{transform:'translate(1300px,280px) scale(1.3)'}}>
        <path d="M 0 0 L 160 0 L 160 100 Q 160 200 80 240 Q 0 200 0 100 Z"
          fill="none" stroke="#B87E3A" strokeWidth="2"/>
        <line x1="0" y1="0" x2="160" y2="120" stroke="#B87E3A" strokeWidth="1" opacity="0.5"/>
        <line x1="160" y1="0" x2="0" y2="120" stroke="#B87E3A" strokeWidth="1" opacity="0.5"/>
      </g>
    </svg>
  );
}

// ── Empire / Victorian era art ────────────────────────────────────────
function EmpireDeep() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="ind-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="50" height="50" fill="none" stroke="#155A6A" strokeWidth="0.6" opacity="0.4"/>
          <line x1="25" y1="0" x2="25" y2="50" stroke="#2AA8BB" strokeWidth="0.25" opacity="0.2"/>
          <line x1="0" y1="25" x2="50" y2="25" stroke="#2AA8BB" strokeWidth="0.25" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ind-grid)"/>
      {/* Large compass rose */}
      <g className="svg-spin-rev" style={{transformOrigin:'960px 540px'}} opacity="0.12">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
          const r=a*Math.PI/180; const R=420;
          return <line key={i} x1="960" y1="540" x2={960+Math.cos(r)*R} y2={540+Math.sin(r)*R} stroke="#2AA8BB" strokeWidth="0.8"/>;
        })}
        <circle cx="960" cy="540" r="420" fill="none" stroke="#2AA8BB" strokeWidth="0.8"/>
        <circle cx="960" cy="540" r="280" fill="none" stroke="#155A6A" strokeWidth="0.6"/>
        <circle cx="960" cy="540" r="140" fill="none" stroke="#2AA8BB" strokeWidth="0.5"/>
      </g>
    </svg>
  );
}

function EmpireMid() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Victorian skyline */}
      <g opacity="0.22" className="svg-drift">
        {/* Big Ben / Clock tower */}
        <rect x="200" y="280" width="100" height="720" fill="none" stroke="#2AA8BB" strokeWidth="2"/>
        <rect x="180" y="260" width="140" height="28" fill="none" stroke="#2AA8BB" strokeWidth="1.5"/>
        <polygon points="250,180 300,260 200,260" fill="none" stroke="#2AA8BB" strokeWidth="2"/>
        {/* Parliament building */}
        <rect x="320" y="450" width="680" height="550" fill="none" stroke="#2AA8BB" strokeWidth="1.5"/>
        <rect x="320" y="430" width="680" height="24" fill="none" stroke="#2AA8BB" strokeWidth="1.5"/>
        {/* Parliament windows */}
        {[340,400,460,520,580,640,700,760,820,880].map((x,i)=>(
          <rect key={i} x={x} y={480} width={36} height={52} fill="none" stroke="#2AA8BB" strokeWidth="0.8"/>
        ))}
        {/* Factory chimneys */}
        {[1100,1200,1320,1450,1600,1720].map((x,i)=>(
          <g key={i}>
            <rect x={x} y={300+i*20} width={40} height={700-i*20} fill="none" stroke="#2AA8BB" strokeWidth="1.2"/>
            <ellipse cx={x+20} cy={300+i*20} rx={22} ry={8} fill="none" stroke="#2AA8BB" strokeWidth="1"/>
          </g>
        ))}
        {/* Horizon line */}
        <line x1="0" y1="1000" x2="1920" y2="1000" stroke="#2AA8BB" strokeWidth="2"/>
      </g>
    </svg>
  );
}

function EmpireFore() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Gear/cog */}
      <g opacity="0.13" className="svg-spin-slow" style={{transformOrigin:'300px 280px'}}>
        <circle cx="300" cy="280" r="90" fill="none" stroke="#2AA8BB" strokeWidth="2"/>
        <circle cx="300" cy="280" r="48" fill="none" stroke="#2AA8BB" strokeWidth="1.5"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
          const r=a*Math.PI/180;
          return <rect key={i}
            x={300+Math.cos(r)*80-6} y={280+Math.sin(r)*80-8}
            width={12} height={18}
            transform={`rotate(${a},${300+Math.cos(r)*80},${280+Math.sin(r)*80})`}
            fill="none" stroke="#2AA8BB" strokeWidth="1"/>;
        })}
      </g>
      {/* Union Jack geometric abstraction */}
      <g opacity="0.1" style={{transform:'translate(1300px,280px)'}}>
        <rect x="0" y="110" width="320" height="80" fill="none" stroke="#2AA8BB" strokeWidth="2"/>
        <rect x="120" y="0" width="80" height="300" fill="none" stroke="#2AA8BB" strokeWidth="2"/>
        <line x1="0" y1="0" x2="320" y2="300" stroke="#2AA8BB" strokeWidth="1.5" opacity="0.6"/>
        <line x1="320" y1="0" x2="0" y2="300" stroke="#2AA8BB" strokeWidth="1.5" opacity="0.6"/>
        <rect x="0" y="0" width="320" height="300" fill="none" stroke="#2AA8BB" strokeWidth="1.5"/>
      </g>
    </svg>
  );
}

// ── Modern / Contemporary era art ─────────────────────────────────────
function ModernDeep() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="mod-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="32" height="32" fill="none" stroke="#1A3E8A" strokeWidth="0.4" opacity="0.35"/>
        </pattern>
        <pattern id="mod-dots" width="64" height="64" patternUnits="userSpaceOnUse">
          <circle cx="32" cy="32" r="1.5" fill="#4A8FEF" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mod-grid)"/>
      <rect width="100%" height="100%" fill="url(#mod-dots)"/>
      {/* Central radial */}
      <g className="svg-spin-slow" style={{transformOrigin:'960px 540px'}} opacity="0.1">
        {Array.from({length:20},(_,i)=>{
          const a=(i/20)*Math.PI*2;
          return <line key={i} x1="960" y1="540" x2={960+Math.cos(a)*500} y2={540+Math.sin(a)*500} stroke="#4A8FEF" strokeWidth="0.5"/>;
        })}
        <circle cx="960" cy="540" r="500" fill="none" stroke="#1A3E8A" strokeWidth="0.5"/>
        <circle cx="960" cy="540" r="320" fill="none" stroke="#4A8FEF" strokeWidth="0.4"/>
      </g>
    </svg>
  );
}

function ModernMid() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Parliament building – detailed modern rendering */}
      <g opacity="0.2" className="svg-rise">
        {/* Base */}
        <rect x="160" y="550" width="1200" height="480" fill="none" stroke="#4A8FEF" strokeWidth="1.5"/>
        {/* Floor divisions */}
        <line x1="160" y1="680" x2="1360" y2="680" stroke="#4A8FEF" strokeWidth="0.8"/>
        <line x1="160" y1="810" x2="1360" y2="810" stroke="#4A8FEF" strokeWidth="0.8"/>
        {/* Central tower */}
        <rect x="600" y="280" width="220" height="280" fill="none" stroke="#4A8FEF" strokeWidth="2"/>
        <polygon points="710,180 740,280 680,280" fill="none" stroke="#4A8FEF" strokeWidth="2"/>
        {/* Side towers */}
        <rect x="160" y="380" width="120" height="180" fill="none" stroke="#4A8FEF" strokeWidth="1.5"/>
        <polygon points="220,320 248,380 192,380" fill="none" stroke="#4A8FEF" strokeWidth="1.5"/>
        <rect x="1240" y="390" width="120" height="170" fill="none" stroke="#4A8FEF" strokeWidth="1.5"/>
        <polygon points="1300,330 1328,390 1272,390" fill="none" stroke="#4A8FEF" strokeWidth="1.5"/>
        {/* Clock face */}
        <circle cx="710" cy="420" r="42" fill="none" stroke="#4A8FEF" strokeWidth="1.5"/>
        <line x1="710" y1="420" x2="710" y2="388" stroke="#4A8FEF" strokeWidth="2"/>
        <line x1="710" y1="420" x2="732" y2="428" stroke="#4A8FEF" strokeWidth="1.5"/>
        {/* Windows */}
        {[180,240,300,360,420,480,540,660,780,840,900,960,1020,1100,1160,1220,1280,1320].map((x,i)=>(
          <g key={i}>
            <rect x={x} y={570} width={38} height={55} fill="none" stroke="#4A8FEF" strokeWidth="0.7"/>
            <rect x={x} y={700} width={38} height={55} fill="none" stroke="#4A8FEF" strokeWidth="0.7"/>
          </g>
        ))}
      </g>
      {/* Modern skyline behind */}
      <g opacity="0.1">
        {[1420,1520,1580,1650,1720,1800].map((x,i)=>(
          <rect key={i} x={x} y={200+i*60} width={60} height={840-i*60} fill="none" stroke="#4A8FEF" strokeWidth="1"/>
        ))}
      </g>
    </svg>
  );
}

function ModernFore() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* NHS-inspired cross */}
      <g opacity="0.12" style={{transform:'translate(1500px,200px) scale(1.4)'}}>
        <rect x="60" y="0"  width="80" height="200" fill="none" stroke="#4A8FEF" strokeWidth="2"/>
        <rect x="0"  y="60" width="200" height="80"  fill="none" stroke="#4A8FEF" strokeWidth="2"/>
      </g>
      {/* Scan lines effect */}
      <g className="svg-pulse-o">
        {[200,350,500,650,800].map((y,i)=>(
          <line key={i} x1="0" y1={y} x2="1920" y2={y} stroke="#4A8FEF" strokeWidth="0.35" opacity="0.25"/>
        ))}
      </g>
      {/* "UK" text watermark geometric */}
      <g opacity="0.08" style={{transform:'translate(200px,320px)'}}>
        {/* U */}
        <path d="M 0 0 L 0 120 Q 0 180 60 180 Q 120 180 120 120 L 120 0" fill="none" stroke="#4A8FEF" strokeWidth="3"/>
        {/* K */}
        <line x1="160" y1="0" x2="160" y2="180" stroke="#4A8FEF" strokeWidth="3"/>
        <line x1="160" y1="90" x2="280" y2="0"   stroke="#4A8FEF" strokeWidth="3"/>
        <line x1="160" y1="90" x2="280" y2="180" stroke="#4A8FEF" strokeWidth="3"/>
      </g>
    </svg>
  );
}

// ── Era layer wrappers ────────────────────────────────────────────────
const ERA_LAYERS: Record<EraName, { deep: React.FC; mid: React.FC; fore: React.FC }> = {
  ancient:  { deep: AncientDeep,  mid: AncientMid,  fore: AncientFore  },
  medieval: { deep: MedievalDeep, mid: MedievalMid, fore: MedievalFore },
  empire:   { deep: EmpireDeep,   mid: EmpireMid,   fore: EmpireFore   },
  modern:   { deep: ModernDeep,   mid: ModernMid,   fore: ModernFore   },
};

const ERA_NAMES: EraName[] = ['ancient', 'medieval', 'empire', 'modern'];

// ── Main component ─────────────────────────────────────────────────────
interface TimelineCanvasProps {
  cameraX: number;
}

export default function TimelineCanvas({ cameraX }: TimelineCanvasProps) {
  const opacities = useMemo(
    () => Object.fromEntries(ERA_NAMES.map(e => [e, getEraOpacity(e, cameraX)])) as Record<EraName, number>,
    [cameraX],
  );

  return (
    <div className="parallax-root" aria-hidden="true">
      {/* ── Base gradient that transitions colors via CSS vars ── */}
      <div className="absolute inset-0 era-base" />

      {/* ── Glow orbs ── */}
      <div className="glow-orb absolute" style={{
        width:'50vw', height:'50vw', background:'var(--era-glow)',
        top:'-18%', left:'-12%',
      }}/>
      <div className="glow-orb glow-orb-2 absolute" style={{
        width:'40vw', height:'40vw', background:'var(--era-glow)',
        bottom:'-14%', right:'-8%',
      }}/>

      {/* ── Deep parallax layer (speed=0.12) ── */}
      <div className="parallax-layer p-deep" style={{ transform: translate(cameraX, SPEED_DEEP) }}>
        {ERA_NAMES.map(era => (
          <div key={era} className="era-layer" style={{ opacity: opacities[era] }}>
            {opacities[era] > 0.01 && (() => { const C = ERA_LAYERS[era].deep; return <C/>; })()}
          </div>
        ))}
      </div>

      {/* ── Mid parallax layer (speed=0.30) ── */}
      <div className="parallax-layer p-mid" style={{ transform: translate(cameraX, SPEED_MID) }}>
        {ERA_NAMES.map(era => (
          <div key={era} className="era-layer" style={{ opacity: opacities[era] }}>
            {opacities[era] > 0.01 && (() => { const C = ERA_LAYERS[era].mid; return <C/>; })()}
          </div>
        ))}
      </div>

      {/* ── Foreground parallax layer (speed=0.56) ── */}
      <div className="parallax-layer p-fore" style={{ transform: translate(cameraX, SPEED_FORE) }}>
        {ERA_NAMES.map(era => (
          <div key={era} className="era-layer" style={{ opacity: opacities[era] * 0.7 }}>
            {opacities[era] > 0.05 && (() => { const C = ERA_LAYERS[era].fore; return <C/>; })()}
          </div>
        ))}
      </div>

      {/* ── Bottom era teaser strip ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--era-deep), transparent)' }}
      />

      {/* ── Vignette overlay ── */}
      <div className="absolute inset-0 vignette"/>
    </div>
  );
}
