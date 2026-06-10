import { useRef, UIEvent } from 'react';
import {
  CheckCircle, XCircle, Circle, Clock, ChevronRight,
  BookOpen, Shuffle, BarChart2, TrendingUp, Layers,
} from 'lucide-react';
import { TestResult, TestSet } from '../types';
import { testSets } from '../data/questions';
import CircularProgress from './CircularProgress';
import { getDominantEra, ERA_PALETTES, EraName } from '../hooks/useCamera';

interface DashboardProps {
  results: Record<number, TestResult>;
  onLaunchTest: (testId: number) => void;
  onOpenExplanations: () => void;
  onCameraScroll: (x: number) => void;
  shuffleOn: boolean;
  onToggleShuffle: () => void;
  onOpenAnalytics: () => void;
  cameraX: number;
  launching: boolean;
  launchingId: number | null;
}

function StatusBadge({ result }: { result?: TestResult }) {
  if (!result || result.status === 'not_started')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60 border border-white/15">
        <Circle className="w-3 h-3"/>Not Started
      </span>
    );
  if (result.status === 'passed')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <CheckCircle className="w-3 h-3"/>Passed ({result.accuracy}%)
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
      <XCircle className="w-3 h-3"/>Failed ({result.accuracy}%)
    </span>
  );
}

export default function Dashboard({
  results, onLaunchTest, onOpenExplanations, onCameraScroll,
  shuffleOn, onToggleShuffle, onOpenAnalytics, cameraX, launching, launchingId,
}: DashboardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const attempted     = Object.values(results).filter(r => r.status !== 'not_started').length;
  const passedResults = Object.values(results).filter(r => r.status === 'passed');
  const avgAccuracy   = passedResults.length
    ? Math.round(passedResults.reduce((a, r) => a + (r.accuracy || 0), 0) / passedResults.length)
    : 0;

  const era     = getDominantEra(cameraX);
  const palette = ERA_PALETTES[era];

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el        = e.currentTarget;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const progress  = el.scrollTop / maxScroll;
    // Map scroll 0-1 → cameraX 0-1200
    onCameraScroll(progress * 1200);
  };

  return (
    <div
      ref={scrollRef}
      className="dash-scroll relative z-10"
      onScroll={handleScroll}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats Banner ── */}
        <div className="relative overflow-hidden rounded-2xl mb-8 animate-fade-in" style={{background:'rgba(0,0,0,0.52)'}}>
          <div className="glass-dark rounded-2xl overflow-hidden">
            {/* Accent top edge */}
            <div className="h-0.5 accent-line w-full"/>

            <div className="px-6 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">

              {/* Left CTA */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border era-badge mb-3">
                  <TrendingUp className="w-3 h-3"/>
                  <span className="text-[11px] font-bold uppercase tracking-widest">Preparation Progress</span>
                </div>
                <h1 className="text-white text-3xl font-extrabold leading-tight mb-2">
                  Ready for<br/>the Exam?
                </h1>
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  Practice all 17 simulator sets. Aim for 75%+ on each to secure your pass. Scroll down to journey through British history.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={onOpenExplanations}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-chip text-white text-sm font-semibold hover:bg-white/20 transition-all duration-200"
                  >
                    <BookOpen className="w-4 h-4"/>Open Explanations
                  </button>
                  <button
                    onClick={onOpenAnalytics}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-chip text-white text-sm font-semibold hover:bg-white/20 transition-all duration-200"
                  >
                    <BarChart2 className="w-4 h-4"/>My Progress
                  </button>
                </div>
              </div>

              {/* Attempted sets */}
              <div className="glass-chip rounded-2xl px-6 py-5 text-center">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Attempted Sets</p>
                <div className="text-white text-5xl font-extrabold mb-1 leading-none">
                  {attempted}
                  <span className="text-white/30 text-3xl font-bold"> / {testSets.length}</span>
                </div>
                <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{
                      width:`${((attempted/testSets.length)*100).toFixed(1)}%`,
                      background:`var(--era-accent)`,
                    }}
                  />
                </div>
                <p className="text-white/40 text-xs mt-2">
                  {testSets.length - attempted > 0 ? 'Keep practicing remaining sets!' : '🎉 All sets completed!'}
                </p>
              </div>

              {/* Accuracy ring */}
              <div className="flex flex-col items-center gap-2">
                <CircularProgress
                  percentage={avgAccuracy}
                  size={130}
                  strokeWidth={9}
                  color={palette.accent}
                  trackColor="rgba(255,255,255,0.08)"
                />
                <div className="text-center">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Average Accuracy</p>
                  <p className="text-white/35 text-xs mt-0.5">
                    {avgAccuracy>=75 ? 'Excellent readiness!' : avgAccuracy>0 ? 'Aim for 75%+' : 'Complete tests to begin'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Era indicator + section header ── */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-6 flex-col sm:flex-row">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4" style={{color:'var(--era-accent)'}}/>
              <span className="text-xs font-bold uppercase tracking-widest era-badge border-0 bg-transparent px-0 py-0">
                {palette.name}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/35 text-xs">{palette.years}</span>
            </div>
            <h2 className="text-white text-xl font-bold">Exam Practice Papers</h2>
            <p className="text-white/40 text-sm">
              Scroll through history · Each set covers a{' '}
              <span style={{color:'var(--era-accent)'}} className="font-medium">different era of British heritage</span>
            </p>
          </div>

          {/* Shuffle toggle */}
          <div className="flex-shrink-0 flex items-center gap-3 glass-dark rounded-xl px-4 py-3">
            <Shuffle className="w-4 h-4 flex-shrink-0" style={{color: shuffleOn ? 'var(--era-accent)' : 'rgba(255,255,255,0.35)'}}/>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">Shuffle questions</p>
              <p className="text-white/40 text-xs leading-tight">Randomise order</p>
            </div>
            <button
              onClick={onToggleShuffle}
              className="relative inline-flex flex-shrink-0 h-6 w-11 cursor-pointer rounded-full"
              role="switch"
              aria-checked={shuffleOn}
            >
              <span className={`absolute inset-0 rounded-full transition-colors duration-250 ${shuffleOn ? 'bg-sky-500' : 'bg-white/20'}`}/>
              <span className={`relative z-10 w-5 h-5 rounded-full bg-white shadow-md top-0.5 transition-transform duration-250 ${shuffleOn ? 'translate-x-5' : 'translate-x-0.5'}`}/>
            </button>
          </div>
        </div>

        {/* ── Era era dividers + test cards grid ── */}
        <EraSection era="ancient"  label="Roman & Ancient Britain"  years="43 AD – 1066"  cards={testSets.slice(0,4)}   results={results} onLaunch={onLaunchTest} launching={launching} launchingId={launchingId}/>
        <EraSection era="medieval" label="Medieval & Tudor Era"     years="1066 – 1603"   cards={testSets.slice(4,9)}   results={results} onLaunch={onLaunchTest} launching={launching} launchingId={launchingId}/>
        <EraSection era="empire"   label="Empire & Industrial Age"  years="1603 – 1914"   cards={testSets.slice(9,14)}  results={results} onLaunch={onLaunchTest} launching={launching} launchingId={launchingId}/>
        <EraSection era="modern"   label="Modern Britain"           years="1914 – Present" cards={testSets.slice(14)}   results={results} onLaunch={onLaunchTest} launching={launching} launchingId={launchingId}/>

        {/* Bottom spacer so the tease gradient has room */}
        <div className="h-32"/>
      </div>
    </div>
  );
}

// ── Era section with divider ──────────────────────────────────────────
function EraSection({
  era, label, years, cards, results, onLaunch, launching, launchingId,
}: {
  era: EraName; label: string; years: string;
  cards: TestSet[]; results: Record<number, TestResult>;
  onLaunch: (id: number) => void;
  launching: boolean; launchingId: number | null;
}) {
  if (!cards.length) return null;
  const palette = ERA_PALETTES[era];

  return (
    <div className="mb-10">
      {/* Era divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 opacity-20" style={{background:`linear-gradient(to right, ${palette.accent}, transparent)`}}/>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-chip">
          <span className="w-2 h-2 rounded-full" style={{background:palette.accent, boxShadow:`0 0 8px ${palette.accent}`}}/>
          <span className="text-white/70 text-xs font-semibold">{label}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/40 text-xs">{years}</span>
        </div>
        <div className="h-px flex-1 opacity-20" style={{background:`linear-gradient(to left, ${palette.accent}, transparent)`}}/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(set => {
          const result   = results[set.id];
          const isPassed = result?.status === 'passed';
          const isLaunching = launching && launchingId === set.id;

          return (
            <div
              key={set.id}
              className="dash-card glass-dark rounded-2xl border border-white/10 p-5 flex flex-col group"
              style={{ borderColor: isLaunching ? palette.accent : undefined }}
              onClick={() => !launching && onLaunch(set.id)}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Paper {set.id}</span>
                <StatusBadge result={result}/>
              </div>

              <h3 className="text-white text-lg font-bold mb-1.5 leading-tight">{set.title}</h3>

              <p className="text-white/45 text-sm leading-relaxed flex-grow">
                Complete {set.questions.length} simulated questions on British{' '}
                <span style={{color:palette.accent}} className="font-medium">history, culture &amp; law.</span>
              </p>

              {/* Progress bar if attempted */}
              {result && result.status !== 'not_started' && (
                <div className="mt-3 mb-1">
                  <div className="flex justify-between text-xs text-white/35 mb-1">
                    <span>{result.score}/{result.totalQuestions} correct</span>
                    <span className={isPassed ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {result.accuracy}%
                    </span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-red-400'}`}
                      style={{width:`${result.accuracy}%`}}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
                <button
                  className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all duration-200"
                  style={{color: palette.accent}}
                  onClick={e => { e.stopPropagation(); !launching && onLaunch(set.id); }}
                >
                  {isLaunching ? 'Launching…' : 'Launch Simulator'}
                  {!isLaunching && <ChevronRight className="w-4 h-4"/>}
                </button>
                <div className="flex items-center gap-1.5 text-white/35 text-xs">
                  <Clock className="w-3.5 h-3.5"/>
                  <span>45m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
