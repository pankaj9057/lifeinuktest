import { useState, useRef, useCallback, useEffect } from 'react';

export type EraName = 'ancient' | 'medieval' | 'empire' | 'modern';

// ── Easing ────────────────────────────────────────────────────────────
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── Era palette definitions ────────────────────────────────────────────
export const ERA_PALETTES: Record<EraName, {
  bg: string; deep: string; mid: string;
  accent: string; glow: string; name: string; years: string;
}> = {
  ancient: {
    bg: '#100800',  deep: '#1C1005', mid: '#261605',
    accent: '#D4963A', glow: 'rgba(212,150,58,0.28)',
    name: 'Roman & Ancient Britain', years: '43 AD – 1066',
  },
  medieval: {
    bg: '#0C0418',  deep: '#180830', mid: '#1F0A38',
    accent: '#B87E3A', glow: 'rgba(139,30,80,0.32)',
    name: 'Medieval & Tudor Era', years: '1066 – 1603',
  },
  empire: {
    bg: '#021018',  deep: '#041C28', mid: '#062030',
    accent: '#2AA8BB', glow: 'rgba(42,168,187,0.28)',
    name: 'Empire & Industrial Age', years: '1603 – 1914',
  },
  modern: {
    bg: '#020B20',  deep: '#041030', mid: '#061640',
    accent: '#4A8FEF', glow: 'rgba(74,143,239,0.3)',
    name: 'Modern Britain', years: '1914 – Present',
  },
};

// ── Era zones: cameraX ranges (with overlap for blending) ────────────
const ERA_ZONES: Record<EraName, [number, number]> = {
  ancient:  [0,    520],
  medieval: [380,  1020],
  empire:   [880,  1620],
  modern:   [1480, 9999],
};

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function getEraOpacity(era: EraName, x: number): number {
  const [start, end] = ERA_ZONES[era];
  const FADE = 120;
  if (x <= start || x >= end) return 0;
  const fadeIn  = smoothstep(start, start + FADE, x);
  const fadeOut = 1 - smoothstep(end - FADE, end, x);
  return Math.min(fadeIn, fadeOut);
}

export function getDominantEra(x: number): EraName {
  const eras: EraName[] = ['ancient', 'medieval', 'empire', 'modern'];
  let best: EraName = 'modern';
  let bestO = 0;
  for (const e of eras) {
    const o = getEraOpacity(e, x);
    if (o > bestO) { bestO = o; best = e; }
  }
  return best;
}

// ── Inject CSS custom properties onto :root ───────────────────────────
export function injectEraPalette(era: EraName) {
  const p = ERA_PALETTES[era];
  const root = document.documentElement.style;
  root.setProperty('--era-bg',     p.bg);
  root.setProperty('--era-deep',   p.deep);
  root.setProperty('--era-mid',    p.mid);
  root.setProperty('--era-accent', p.accent);
  root.setProperty('--era-glow',   p.glow);
}

// ── Camera hook ───────────────────────────────────────────────────────
export interface CameraState {
  x: number;
  y: number;
}

export function useCamera(initialX = 0, initialY = 0) {
  const [pos, setPos] = useState<CameraState>({ x: initialX, y: initialY });
  const posRef        = useRef<CameraState>({ x: initialX, y: initialY });
  const rafRef        = useRef(0);
  const dominantEra   = useRef<EraName>(getDominantEra(initialX));

  // Inject initial palette
  useEffect(() => {
    injectEraPalette(getDominantEra(initialX));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePos = useCallback((x: number, y: number) => {
    posRef.current = { x, y };
    setPos({ x, y });

    // Palette injection on era change
    const era = getDominantEra(x);
    if (era !== dominantEra.current) {
      dominantEra.current = era;
      injectEraPalette(era);
    }
  }, []);

  const animateTo = useCallback((
    targetX: number,
    targetY: number,
    duration = 1100,
    ease: 'expo' | 'inout' = 'expo',
  ) => {
    cancelAnimationFrame(rafRef.current);
    const startX = posRef.current.x;
    const startY = posRef.current.y;
    const startT = performance.now();
    const fn     = ease === 'expo' ? easeOutExpo : easeInOutQuad;

    const tick = (now: number) => {
      const t = Math.min((now - startT) / duration, 1);
      const e = fn(t);
      updatePos(startX + (targetX - startX) * e, startY + (targetY - startY) * e);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [updatePos]);

  const setInstant = useCallback((x: number, y: number) => {
    cancelAnimationFrame(rafRef.current);
    updatePos(x, y);
  }, [updatePos]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { pos, animateTo, setInstant };
}

// ── Dashboard card-to-cameraX mapping ────────────────────────────────
export function cardIndexToCameraX(cardIndex: number, totalCards: number): number {
  // Cards span camera 0-1200 on the dashboard
  return (cardIndex / Math.max(totalCards - 1, 1)) * 1200;
}

// ── Simulator position ────────────────────────────────────────────────
export function simulatorCameraX(testId: number, questionIdx: number): number {
  // Simulator starts at 1300, each test has a base, questions advance ~40px
  const base = 1300 + (testId - 1) * 5;
  return base + questionIdx * 42;
}

// ── Analytics position ────────────────────────────────────────────────
export const ANALYTICS_CAMERA_X = 2400;
