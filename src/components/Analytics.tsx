import { UIEvent, useRef } from 'react';
import {
  CheckCircle, XCircle, Circle, ArrowLeft, Trophy,
  TrendingUp, Target, BarChart2,
} from 'lucide-react';
import { TestResult } from '../types';
import { testSets } from '../data/questions';
import { ERA_PALETTES, EraName, getDominantEra } from '../hooks/useCamera';

interface AnalyticsProps {
  results: Record<number, TestResult>;
  onBack: () => void;
  onLaunchTest: (testId: number) => void;
  onCameraScroll: (x: number) => void;
  cameraX: number;
}


function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent: string }) {
  return (
    <div className="glass-dark rounded-2xl px-5 py-5 flex items-center gap-4 border border-white/10">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:`${accent}22`, border:`1px solid ${accent}44` }}>
        <div style={{color:accent}}>{icon}</div>
      </div>
      <div>
        <div className="text-white text-2xl font-extrabold leading-tight">{value}</div>
        <div className="text-white/45 text-xs font-medium">{label}</div>
      </div>
    </div>
  );
}

export default function Analytics({ results, onBack, onLaunchTest, onCameraScroll, cameraX }: AnalyticsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const attempted   = Object.values(results).filter(r => r.status !== 'not_started').length;
  const passed      = Object.values(results).filter(r => r.status === 'passed').length;
  const passedList  = Object.values(results).filter(r => r.status === 'passed');
  const avgAcc      = passedList.length
    ? Math.round(passedList.reduce((a,r) => a+(r.accuracy||0), 0) / passedList.length)
    : 0;
  const passRate    = attempted ? Math.round((passed/attempted)*100) : 0;

  const era     = getDominantEra(cameraX);
  const palette = ERA_PALETTES[era];

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const progress  = el.scrollTop / maxScroll;
    // Analytics lives at cameraX 2400-3200
    onCameraScroll(2400 + progress * 800);
  };

  return (
    <div ref={scrollRef} className="dash-scroll relative z-10" onScroll={handleScroll}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <button
            onClick={onBack}
            className="p-2 rounded-xl glass-chip text-white/70 hover:text-white hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4"/>
          </button>
          <div>
            <h1 className="text-white text-2xl font-extrabold leading-tight">Your Journey</h1>
            <p className="text-white/40 text-sm">Track your path through British history</p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 animate-fade-in">
          <StatCard icon={<Target className="w-5 h-5"/>}    value={`${attempted}/${testSets.length}`} label="Tests Attempted" accent={palette.accent}/>
          <StatCard icon={<CheckCircle className="w-5 h-5"/>} value={`${passed}`}  label="Tests Passed"   accent="#10B981"/>
          <StatCard icon={<BarChart2 className="w-5 h-5"/>}  value={`${avgAcc}%`} label="Avg Accuracy"   accent={palette.accent}/>
          <StatCard icon={<Trophy className="w-5 h-5"/>}     value={`${passRate}%`} label="Pass Rate"    accent="#F59E0B"/>
        </div>

        {/* ── Overall accuracy bar ── */}
        {attempted > 0 && (
          <div className="glass-dark rounded-2xl border border-white/10 px-6 py-5 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold text-sm">Overall Readiness</span>
              <span className="font-bold text-sm" style={{color: avgAcc>=75?'#10B981':'#F59E0B'}}>
                {avgAcc>=75 ? 'Exam Ready!' : avgAcc>50 ? 'Almost There' : 'Keep Practicing'}
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-fill"
                style={{ width:`${avgAcc}%`, background: avgAcc>=75 ? '#10B981' : '#F59E0B' }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/35 mt-1.5">
              <span>0%</span>
              <span className="text-white/50 font-medium">Pass threshold: 75%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* ── Era sections with timeline nodes ── */}
        {[
          { era:'ancient'  as EraName, label:'Roman & Ancient Britain',  years:'43 AD – 1066', tests:testSets.slice(0,4)  },
          { era:'medieval' as EraName, label:'Medieval & Tudor Era',     years:'1066 – 1603',  tests:testSets.slice(4,9)  },
          { era:'empire'   as EraName, label:'Empire & Industrial Age',  years:'1603 – 1914',  tests:testSets.slice(9,14) },
          { era:'modern'   as EraName, label:'Modern Britain',           years:'1914 – Present', tests:testSets.slice(14) },
        ].map(({ era:e, label, years, tests }) => {
          const p = ERA_PALETTES[e];
          return (
            <div key={e} className="mb-10">
              {/* Era divider header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{background:`linear-gradient(to right, ${p.accent}44, transparent)`}}/>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-chip">
                  <span className="w-2 h-2 rounded-full" style={{background:p.accent, boxShadow:`0 0 8px ${p.accent}`}}/>
                  <span className="text-white/75 text-xs font-bold">{label}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/40 text-xs">{years}</span>
                </div>
                <div className="h-px flex-1" style={{background:`linear-gradient(to left, ${p.accent}44, transparent)`}}/>
              </div>

              {/* Timeline row */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-8 left-8 right-8 h-0.5 rounded-full"
                  style={{background:`linear-gradient(to right, ${p.accent}30, ${p.accent}60, ${p.accent}30)`}}/>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tests.map((set) => {
                    const r = results[set.id];
                    const isPassed  = r?.status === 'passed';
                    const isFailed  = r?.status === 'failed';
                    const isPending = !r || r.status === 'not_started';

                    return (
                      <div
                        key={set.id}
                        className={`timeline-node glass-dark rounded-2xl border border-white/10 px-3 py-4 flex flex-col items-center gap-2 cursor-pointer ${isPassed?'node-passed':''} ${isFailed?'node-failed':''} ${isPending?'node-pending':''}`}
                        style={{borderColor: isPassed?'#10B981'+'44': isFailed?'#EF4444'+'44': `${p.accent}25`}}
                        onClick={() => onLaunchTest(set.id)}
                      >
                        {/* Node dot */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center relative"
                          style={{
                            background: isPassed?'rgba(16,185,129,0.2)': isFailed?'rgba(239,68,68,0.2)': `${p.accent}18`,
                            border: `2px solid ${isPassed?'#10B981': isFailed?'#EF4444': p.accent}${isPending?'44':''}`,
                          }}
                        >
                          {isPassed  && <CheckCircle className="w-5 h-5 text-emerald-400"/>}
                          {isFailed  && <XCircle    className="w-5 h-5 text-red-400"/>}
                          {isPending && <Circle     className="w-5 h-5 text-white/25"/>}
                          {/* Sequence number */}
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/60">
                            {set.id}
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="text-white/80 text-xs font-semibold leading-tight">Test {set.id}</div>
                          {r && r.status !== 'not_started' ? (
                            <>
                              <div
                                className="text-sm font-bold leading-tight mt-0.5"
                                style={{color: isPassed?'#10B981':'#F87171'}}
                              >
                                {r.accuracy}%
                              </div>
                              <div className="text-white/35 text-[10px]">
                                {r.score}/{r.totalQuestions}
                              </div>
                            </>
                          ) : (
                            <div className="text-white/25 text-[10px] mt-0.5">Not started</div>
                          )}
                        </div>

                        {/* Mini accuracy bar */}
                        {r && r.status !== 'not_started' && (
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{width:`${r.accuracy}%`, background: isPassed?'#10B981':'#EF4444'}}
                            />
                          </div>
                        )}

                        <button
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:bg-white/15"
                          style={{color:p.accent, border:`1px solid ${p.accent}44`}}
                          onClick={e => { e.stopPropagation(); onLaunchTest(set.id); }}
                        >
                          {r && r.status !== 'not_started' ? 'Retry' : 'Start'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Milestone summary */}
        {attempted > 0 && (
          <div className="glass-dark rounded-2xl border border-white/10 px-6 py-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-white/60"/>
              <h3 className="text-white font-bold text-sm">Milestones Achieved</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {attempted >= 1  && <MilestoneBadge text="First Step"   accent="#F59E0B"/>}
              {passed    >= 1  && <MilestoneBadge text="First Pass"   accent="#10B981"/>}
              {passed    >= 5  && <MilestoneBadge text="5 Tests Passed" accent="#10B981"/>}
              {passed    >= 10 && <MilestoneBadge text="10 Tests Passed" accent="#10B981"/>}
              {passed    >= 17 && <MilestoneBadge text="All Passed!"   accent="#F59E0B"/>}
              {avgAcc    >= 90 && <MilestoneBadge text="High Achiever" accent={palette.accent}/>}
              {attempted === testSets.length && <MilestoneBadge text="Explorer" accent={palette.accent}/>}
            </div>
          </div>
        )}

        <div className="h-24"/>
      </div>
    </div>
  );
}

function MilestoneBadge({ text, accent }: { text: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background:`${accent}18`, color:accent, border:`1px solid ${accent}35` }}
    >
      <Trophy className="w-3 h-3"/>
      {text}
    </span>
  );
}
