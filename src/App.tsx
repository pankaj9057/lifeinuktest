import { useState, useCallback, useRef, useEffect } from 'react';
import { TestResult } from './types';
import { testSets } from './data/questions';
import { useCamera, getDominantEra, ERA_PALETTES, ANALYTICS_CAMERA_X, simulatorCameraX } from './hooks/useCamera';
import TimelineCanvas from './components/TimelineCanvas';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Analytics from './components/Analytics';
import Explanations from './components/Explanations';
import Header from './components/Header';

// ── Types ─────────────────────────────────────────────────────────────
type AppView = 'dashboard' | 'simulator' | 'analytics' | 'explanations';

const STORAGE_KEY = 'lituk_progress_v3';
const DARK_MODE_KEY = 'lituk_dark_mode_v1';

function loadResults(): Record<number, TestResult> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadDarkMode(): boolean {
  try {
    const raw = localStorage.getItem(DARK_MODE_KEY);
    if (raw !== null) return raw === '1';
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

// ── App ────────────────────────────────────────────────────────────────
export default function App() {
  const { pos, animateTo, setInstant } = useCamera(0, 0);

  const [view,          setView]          = useState<AppView>('dashboard');
  const [prevView,      setPrevView]      = useState<AppView | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [activeTestId,  setActiveTestId]  = useState<number | null>(null);
  const [shuffleOn,     setShuffleOn]     = useState(false);
  const [explanationsOn, setExpOn]        = useState(true);
  const [darkMode,      setDarkMode]      = useState(loadDarkMode);
  const [results,       setResults]       = useState<Record<number, TestResult>>(loadResults);
  const [launching,     setLaunching]     = useState(false);
  const [launchingId,   setLaunchingId]   = useState<number | null>(null);

  const dashCameraXRef = useRef(0); // remember where dashboard was

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(DARK_MODE_KEY, darkMode ? '1' : '0');
    } catch {}
  }, [darkMode]);

  // ── Camera-driven palette (already handled inside useCamera) ──────

  // ── Transition helper ─────────────────────────────────────────────
  const switchView = useCallback((to: AppView, cameraTarget?: number, duration?: number) => {
    setTransitioning(true);
    setPrevView(view);
    setTimeout(() => {
      setView(to);
      setTransitioning(false);
      setPrevView(null);
    }, 420);
    if (cameraTarget !== undefined) {
      animateTo(cameraTarget, 0, duration ?? 1100);
    }
  }, [view, animateTo]);

  // ── Launch test ───────────────────────────────────────────────────
  const handleLaunchTest = useCallback((testId: number) => {
    if (launching) return;
    setLaunching(true);
    setLaunchingId(testId);
    const targetX = simulatorCameraX(testId, 0);

    // Animate camera toward the test era (zoom-in feel)
    animateTo(targetX, 0, 900, 'inout');

    setTimeout(() => {
      setActiveTestId(testId);
      setLaunching(false);
      setLaunchingId(null);
      setView('simulator');
      setTransitioning(false);
    }, 700);
  }, [launching, animateTo]);

  // ── Test complete ─────────────────────────────────────────────────
  const handleTestComplete = useCallback((
    score: number, total: number, _timeTaken: number, passed: boolean,
  ) => {
    if (activeTestId === null) return;
    const accuracy = Math.round((score / total) * 100);
    setResults(prev => ({
      ...prev,
      [activeTestId]: {
        testId: activeTestId,
        status: passed ? 'passed' : 'failed',
        score, totalQuestions: total,
        completedAt: new Date().toISOString(),
        accuracy,
      },
    }));
    // Return to dashboard at saved scroll position
    animateTo(dashCameraXRef.current, 0, 1100, 'expo');
    setView('dashboard');
    setActiveTestId(null);
  }, [activeTestId, animateTo]);

  // ── Back from simulator ───────────────────────────────────────────
  const handleBack = useCallback(() => {
    animateTo(dashCameraXRef.current, 0, 900, 'expo');
    setView('dashboard');
    setActiveTestId(null);
  }, [animateTo]);

  // ── Dashboard scroll → camera ─────────────────────────────────────
  const handleDashScroll = useCallback((x: number) => {
    dashCameraXRef.current = x;
    setInstant(x, 0);
  }, [setInstant]);

  // ── Analytics scroll → camera ─────────────────────────────────────
  const handleAnalyticsScroll = useCallback((x: number) => {
    setInstant(x, 0);
  }, [setInstant]);

  // ── Simulator camera update → global camera ───────────────────────
  const handleSimulatorCamera = useCallback((x: number) => {
    setInstant(x, 0);
  }, [setInstant]);

  // ── Open analytics ────────────────────────────────────────────────
  const handleOpenAnalytics = useCallback(() => {
    switchView('analytics', ANALYTICS_CAMERA_X, 1000);
  }, [switchView]);

  const handleOpenExplanations = useCallback(() => {
    switchView('explanations', dashCameraXRef.current, 900);
  }, [switchView]);

  // ── Back from analytics ───────────────────────────────────────────
  const handleBackFromAnalytics = useCallback(() => {
    switchView('dashboard', dashCameraXRef.current, 900);
  }, [switchView]);

  // ── Clear progress ────────────────────────────────────────────────
  const handleClearProgress = useCallback(() => {
    if (window.confirm('Clear all progress? This cannot be undone.')) {
      setResults({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleToggleHeaderExplanations = useCallback(() => {
    if (view === 'simulator') {
      setExpOn(v => !v);
      return;
    }
    if (view === 'explanations') {
      switchView('dashboard', dashCameraXRef.current, 900);
      return;
    }
    handleOpenExplanations();
  }, [view, handleOpenExplanations, switchView]);

  const handleExplanationsScroll = useCallback((x: number) => {
    setInstant(x, 0);
  }, [setInstant]);

  const era     = getDominantEra(pos.x);
  const palette = ERA_PALETTES[era];

  const activeTest = activeTestId !== null
    ? testSets.find(t => t.id === activeTestId) ?? null
    : null;

  return (
    <div style={{ minHeight: '100dvh', position: 'relative' }}>

      {/* ── Layer 0: Continuous parallax timeline canvas (fixed) ── */}
      <TimelineCanvas cameraX={pos.x}/>

      {/* ── Layer 1: Sticky Header ── */}
      {(
        <div className="relative z-[70]">
          <Header
            onClearProgress={handleClearProgress}
            onToggleExplanations={handleToggleHeaderExplanations}
            explanationsOn={view === 'explanations' || (view === 'simulator' && explanationsOn)}
            isExplanationsView={view === 'explanations'}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(v => !v)}
          />
        </div>
      )}

      {/* ── Layer 2: Views ── */}

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className={`view-layer ${transitioning && prevView==='dashboard' ? 'view-zoom-exit' : 'view-zoom-enter'}`}>
          <Dashboard
            results={results}
            onLaunchTest={handleLaunchTest}
            onOpenExplanations={handleOpenExplanations}
            onCameraScroll={handleDashScroll}
            shuffleOn={shuffleOn}
            onToggleShuffle={() => setShuffleOn(v => !v)}
            onOpenAnalytics={handleOpenAnalytics}
            cameraX={pos.x}
            launching={launching}
            launchingId={launchingId}
          />
        </div>
      )}

      {/* Simulator */}
      {view === 'simulator' && activeTest && (
        <div className={`view-layer ${transitioning && prevView==='simulator' ? 'view-exit' : 'view-zoom-enter'}`}>
          <Simulator
            testSet={activeTest}
            shuffle={shuffleOn}
            showExplanations={explanationsOn}
            onBack={handleBack}
            onHome={handleBack}
            onComplete={handleTestComplete}
            onCameraUpdate={handleSimulatorCamera}
          />
        </div>
      )}

      {/* Analytics */}
      {view === 'analytics' && (
        <div className={`view-layer ${transitioning && prevView==='analytics' ? 'view-exit' : 'view-enter'}`}>
          <Analytics
            results={results}
            onBack={handleBackFromAnalytics}
            onLaunchTest={handleLaunchTest}
            onCameraScroll={handleAnalyticsScroll}
            cameraX={pos.x}
          />
        </div>
      )}

      {/* Explanations */}
      {view === 'explanations' && (
        <div className={`view-layer ${transitioning && prevView==='explanations' ? 'view-exit' : 'view-enter'}`}>
          <Explanations
            onCameraScroll={handleExplanationsScroll}
          />
        </div>
      )}

      {/* ── Era watermark at bottom-right ── */}
      {view !== 'simulator' && (
        <div
          className="fixed bottom-4 right-4 z-20 text-[10px] font-bold uppercase tracking-widest pointer-events-none"
          style={{ color: `${palette.accent}55`, transition: 'color 0.8s ease' }}
        >
          {palette.name} · {palette.years}
        </div>
      )}
    </div>
  );
}
