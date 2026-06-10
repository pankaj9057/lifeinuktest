import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Home, CheckCircle, XCircle, ShieldCheck,
  Clock, ChevronRight, Lightbulb, BookOpen, Layers,
} from 'lucide-react';
import { Question, TestSet } from '../types';
import ResultModal from './ResultModal';
import { simulatorCameraX, getDominantEra, ERA_PALETTES } from '../hooks/useCamera';

interface SimulatorProps {
  testSet: TestSet;
  shuffle: boolean;
  showExplanations: boolean;
  onBack: () => void;
  onHome: () => void;
  onComplete: (score: number, total: number, timeTaken: number, passed: boolean) => void;
  onCameraUpdate: (x: number) => void;
}

const TOTAL_SECONDS = 45 * 60;
const LABELS = ['A', 'B', 'C', 'D', 'E'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(s: number) {
  return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
}

interface Ripple { x: number; y: number; id: number; }

export default function Simulator({
  testSet, shuffle: doShuffle, showExplanations,
  onBack, onHome, onComplete, onCameraUpdate,
}: SimulatorProps) {
  const [questions] = useState<Question[]>(() =>
    doShuffle ? shuffle(testSet.questions) : testSet.questions
  );
  const total = questions.length;

  const [idx,       setIdx]       = useState(0);
  const [cardKey,   setCardKey]   = useState(0);
  const [exiting,   setExiting]   = useState(false);
  const [selected,  setSelected]  = useState<Set<string>>(new Set());
  const [validated, setValidated] = useState(false);
  const [score,     setScore]     = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_SECONDS);
  const [showResult, setShowResult] = useState(false);
  const [timeTaken,  setTimeTaken]  = useState(0);
  const [showExpl,   setShowExpl]   = useState(false);
  const [ripples,    setRipples]    = useState<Ripple[]>([]);

  const timerRef = useRef<number>(0);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(0);

  useEffect(() => { scoreRef.current = score; }, [score]);

  const currentQ = questions[idx];
  const correctSet = new Set(currentQ.correctAnswers);
  const isMulti = currentQ.type === 'multi';
  const isLast  = idx === total - 1;
  const progress = idx / total;

  // ── Camera update whenever question changes ──────────────────────
  useEffect(() => {
    onCameraUpdate(simulatorCameraX(testSet.id, idx));
  }, [idx, testSet.id, onCameraUpdate]);

  const era = getDominantEra(simulatorCameraX(testSet.id, idx));
  const palette = ERA_PALETTES[era];

  // ── Timer ──────────────────────────────────────────────────────
  const finish = useCallback(() => {
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    setTimeTaken(elapsed);
    setShowResult(true);
  }, []);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(timerRef.current); finish(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [finish]);

  // ── Ripple ─────────────────────────────────────────────────────
  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 750);
  };

  // ── Selection ──────────────────────────────────────────────────
  const handleSelect = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (validated) return;
    addRipple(e);
    setSelected(prev => {
      const next = new Set(prev);
      if (isMulti) { next.has(id) ? next.delete(id) : next.add(id); }
      else { next.clear(); next.add(id); }
      return next;
    });
    setShowExpl(false);
  };

  const handleValidate = () => {
    if (!selected.size) return;
    setValidated(true);
    const correct = selected.size === correctSet.size && [...selected].every(id => correctSet.has(id));
    if (correct) setScore(s => s + 1);
    setShowExpl(false);
  };

  // ── Next question with slide transition ─────────────────────────
  const handleNext = () => {
    if (isLast) { finish(); return; }
    setExiting(true);
    setTimeout(() => {
      setIdx(i => i + 1);
      setSelected(new Set());
      setValidated(false);
      setShowExpl(false);
      setExiting(false);
      setCardKey(k => k + 1);
    }, 340);
  };

  // ── Option styling ──────────────────────────────────────────────
  const optionBg = (id: string) => {
    const sel = selected.has(id);
    const cor = correctSet.has(id);
    if (!validated) return sel ? 'bg-white/[0.18] border-blue-400' : 'bg-white/[0.07] border-white/[0.12]';
    if (cor)        return 'bg-emerald-500/[0.22] border-emerald-400';
    if (sel && !cor) return 'bg-red-500/[0.18] border-red-400';
    return 'bg-white/[0.04] border-white/[0.08] opacity-50';
  };
  const labelBg = (id: string) => {
    const sel = selected.has(id);
    const cor = correctSet.has(id);
    if (!validated) return sel ? 'bg-blue-500 text-white' : 'bg-white/[0.1] text-white/50';
    if (cor)        return 'bg-emerald-500 text-white';
    if (sel && !cor) return 'bg-red-400 text-white';
    return 'bg-white/[0.06] text-white/25';
  };

  const isCorrect  = validated && selected.size === correctSet.size && [...selected].every(id => correctSet.has(id));
  const timerUrgent = timeLeft <= 5 * 60;

  // ── Result screen ───────────────────────────────────────────────
  if (showResult) {
    const finalScore = scoreRef.current;
    const passed = finalScore / total >= 0.75;
    return (
      <div className="relative min-h-screen">
        <ResultModal
          testTitle={testSet.title}
          score={finalScore}
          total={total}
          timeTaken={timeTaken}
          passed={passed}
          onRetry={() => onComplete(finalScore, total, timeTaken, passed)}
          onHome={() => { onComplete(finalScore, total, timeTaken, passed); onHome(); }}
          showExplanations={showExplanations}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">

      {/* ── Frosted glass sticky header ── */}
      <div className="fixed top-16 left-0 right-0 z-40 px-4">
        <div className="max-w-2xl mx-auto glass-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-14 px-4 flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4"/>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-6 bg-slate-200 hidden sm:block flex-shrink-0"/>
          <div className="flex-1 min-w-0 hidden sm:block">
            <div className="text-slate-900 font-bold text-sm truncate leading-tight">{testSet.title}</div>
            <div className="text-slate-400 text-[11px] truncate">{palette.name}</div>
          </div>
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <button
              onClick={onHome}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
            >
              <Home className="w-3.5 h-3.5"/>
              <span className="hidden sm:inline">Home</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold">
              <CheckCircle className="w-3.5 h-3.5"/>
              <span>{score}/{total}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-sm font-bold font-mono ${
              timerUrgent ? 'bg-red-50 border-red-300 text-red-600' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${timerUrgent ? 'timer-pulse' : ''}`}/>
              <span className={timerUrgent ? 'timer-pulse' : ''}>{fmt(timeLeft)}</span>
            </div>
          </div>
          </div>
          {/* Accent progress bar along bottom */}
          <div className="h-0.5 bg-slate-200/80">
            <div
              className="h-full progress-fill"
              style={{ width:`${(progress*100).toFixed(1)}%`, background:palette.accent }}
            />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 pt-[9.5rem] pb-12 px-4 flex flex-col items-center min-h-screen">

        {/* Era + question meta */}
        <div className="max-w-2xl w-full flex items-center justify-between mb-4 mt-4">
          <div className="glass-chip flex items-center gap-2 px-3 py-1.5 rounded-full">
            <Layers className="w-3.5 h-3.5" style={{color:palette.accent}}/>
            <span className="text-white/80 text-xs font-semibold">{palette.name}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/45 text-xs">{palette.years}</span>
          </div>
          <div className="glass-chip flex items-center gap-2 px-3 py-1.5 rounded-full">
            <span className="text-white/55 text-xs">
              Q{idx+1}<span className="text-white/25">/{total}</span>
            </span>
            <span className="text-white/25 text-xs">·</span>
            <span className="text-xs font-semibold" style={{color:palette.accent}}>
              {Math.round(progress*100)}% done
            </span>
          </div>
        </div>

        {/* ── Question card ── */}
        <div
          key={cardKey}
          className={`max-w-2xl w-full glass-card rounded-2xl overflow-hidden ${exiting ? 'q-exit' : 'q-enter'}`}
        >
          <div className="px-6 pt-6">
            {/* Type + category badges */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                style={{background:`${palette.accent}22`, color:palette.accent, border:`1px solid ${palette.accent}44`}}
              >
                {isMulti ? 'Select Two' : 'Multiple Choice'}
              </span>
              <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                {currentQ.category}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-slate-900 text-lg sm:text-xl font-bold leading-snug mb-6">
              {currentQ.text}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-2.5 mb-2">
              {currentQ.answers.map((answer, i) => {
                const isSel = selected.has(answer.id);
                const isCor = correctSet.has(answer.id);
                return (
                  <button
                    key={answer.id}
                    onClick={e => handleSelect(answer.id, e)}
                    disabled={validated}
                    className={`answer-row w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left border-2 ${optionBg(answer.id)} ${validated ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {/* Ripple dots for this row (only show when matching selection) */}
                    {ripples.filter(() => isSel || !validated).map(r => (
                      <span key={r.id} className="ripple-dot" style={{
                        width: 80, height: 80,
                        top: r.y - 40, left: r.x - 40,
                      }}/>
                    )).slice(0, 1)}

                    <div className={`answer-label w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${labelBg(answer.id)}`}>
                      {LABELS[i]}
                    </div>
                    <span className="flex-1 text-sm font-medium leading-snug text-slate-800">{answer.text}</span>
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {validated && isCor  ? <CheckCircle className="w-5 h-5 text-emerald-500"/>
                      : validated && isSel && !isCor ? <XCircle className="w-5 h-5 text-red-400"/>
                      : isMulti ? (
                        <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors ${isSel?'bg-blue-500 border-blue-500':'border-slate-300'}`}>
                          {isSel && <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-white"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      ) : (
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${isSel?'border-blue-500':'border-slate-300'}`}>
                          {isSel && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"/>}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback + explanation + CTA */}
          <div className="px-6 pb-6 pt-4">
            {validated && (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3 text-sm font-semibold feedback-enter ${isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                {isCorrect
                  ? <><CheckCircle className="w-4 h-4 flex-shrink-0"/>Correct! Well done.</>
                  : <><XCircle    className="w-4 h-4 flex-shrink-0"/>Incorrect — correct {correctSet.size>1?'answers are':'answer is'} highlighted.</>
                }
              </div>
            )}

            {validated && showExplanations && currentQ.explanation && (
              <div className="mb-4">
                <button
                  onClick={() => setShowExpl(v=>!v)}
                  className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-sm font-semibold transition-colors mb-2"
                >
                  <Lightbulb className="w-4 h-4"/>
                  {showExpl ? 'Hide' : 'Show'} Explanation
                </button>
                {showExpl && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex gap-3 animate-fade-in">
                    <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                    <p className="text-slate-700 text-sm leading-relaxed">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              {!validated ? (
                <button
                  onClick={handleValidate}
                  disabled={!selected.size}
                  className={`validate-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${selected.size ? 'bg-[#0F172A] text-white shadow-md cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  <ShieldCheck className="w-4 h-4"/>Validate Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="validate-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#0F172A] text-white shadow-md cursor-pointer"
                >
                  {isLast ? 'See Results' : 'Next Question'}
                  <ChevronRight className="w-4 h-4"/>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex flex-wrap gap-1.5 justify-center mt-6 max-w-md">
          {questions.map((_,i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i===idx ? 18 : 8,
                height: 8,
                background: i===idx ? palette.accent : i<idx ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>

        <p className="mt-4 text-white/18 text-xs font-medium tracking-widest uppercase">{palette.years}</p>
      </div>
    </div>
  );
}
