import { UIEvent, useMemo, useRef, useState } from 'react';
import { CheckCircle2, FileText, Search } from 'lucide-react';
import { testSets } from '../data/questions';

interface ExplanationsProps {
  onCameraScroll: (x: number) => void;
}

function getCorrectAnswerText(question: (typeof testSets)[number]['questions'][number]): string {
  const correct = new Set(question.correctAnswers);
  return question.answers.filter(a => correct.has(a.id)).map(a => a.text).join(', ');
}

export default function Explanations({ onCameraScroll }: ExplanationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return testSets;

    return testSets
      .map(set => ({
        ...set,
        questions: set.questions.filter(question => {
          const haystack = [
            set.title,
            question.text,
            getCorrectAnswerText(question),
            question.explanation || '',
            question.category,
          ].join(' ').toLowerCase();
          return haystack.includes(q);
        }),
      }))
      .filter(set => set.questions.length > 0);
  }, [query]);

  const totalQuestions = testSets.reduce((sum, set) => sum + set.questions.length, 0);
  const totalNotes = testSets.reduce((sum, set) => sum + set.questions.filter(q => Boolean(q.explanation)).length, 0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const progress = el.scrollTop / maxScroll;
    onCameraScroll(progress * 1200);
  };

  return (
    <div ref={scrollRef} className="dash-scroll relative z-10" onScroll={handleScroll}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <section className="glass-dark rounded-2xl border border-white/10 p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-chip mb-3">
                <FileText className="w-3.5 h-3.5 text-sky-300" />
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Study Guide</span>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight">Explanations Hub</h1>
              <p className="text-white/50 text-sm mt-2 max-w-2xl">
                Review all papers with correct answers and explanation notes in one place.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="glass-chip rounded-xl px-4 py-3 text-center min-w-[110px]">
                <p className="text-white/45 text-[11px] uppercase tracking-wider font-semibold">Papers</p>
                <p className="text-white text-2xl font-extrabold mt-1">{testSets.length}</p>
              </div>
              <div className="glass-chip rounded-xl px-4 py-3 text-center min-w-[110px]">
                <p className="text-white/45 text-[11px] uppercase tracking-wider font-semibold">Questions</p>
                <p className="text-white text-2xl font-extrabold mt-1">{totalQuestions}</p>
              </div>
              <div className="glass-chip rounded-xl px-4 py-3 text-center min-w-[110px]">
                <p className="text-white/45 text-[11px] uppercase tracking-wider font-semibold">Notes</p>
                <p className="text-white text-2xl font-extrabold mt-1">{totalNotes}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-dark rounded-2xl border border-white/10 p-4 mb-6 animate-fade-in">
          <div className="exp-search flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <Search className="exp-search-icon w-4 h-4 text-white/45" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by paper, question, answer, category, or explanation"
              className="exp-search-input w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
            />
          </div>
        </section>

        <div className="space-y-4">
          {filtered.map((set, setIdx) => (
            <details
              key={set.id}
              open={setIdx === 0}
              className="exp-paper glass-dark rounded-2xl border border-white/10 p-4 sm:p-5 animate-fade-in group"
            >
              <summary className="exp-paper-summary list-none cursor-pointer flex items-start justify-between gap-3">
                <div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Paper {set.id}</p>
                  <h2 className="text-white text-lg sm:text-xl font-bold">{set.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70 border border-white/15">
                    {set.questions.length} questions
                  </span>
                  <span className="exp-paper-arrow text-white/45 group-open:rotate-90 transition-transform">›</span>
                </div>
              </summary>

              <div className="mt-4 space-y-3">
                {set.questions.map((q, idx) => (
                  <article key={q.id} className="exp-item rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="exp-summary px-4 py-3.5">
                      <p className="exp-meta text-[11px] uppercase tracking-wider font-semibold text-sky-300 mb-1">
                        Question {idx + 1} · {q.category}
                      </p>
                      <p className="exp-question text-sm sm:text-base text-white/90 font-semibold leading-relaxed">{q.text}</p>
                    </div>

                    <div className="exp-content border-t border-white/10 px-4 py-4 space-y-3">
                      <div className="exp-answer-box rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2.5">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-300 mb-1">Correct Answer</p>
                        <p className="text-sm text-white/90">{getCorrectAnswerText(q)}</p>
                      </div>

                      {q.explanation && (
                        <div className="exp-note-box rounded-lg border border-sky-400/25 bg-sky-500/10 px-3 py-2.5 flex gap-2.5">
                          <FileText className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] uppercase tracking-wider font-semibold text-sky-300 mb-1">Explanation</p>
                            <p className="text-sm text-white/85 leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </details>
          ))}

          {filtered.length === 0 && (
            <div className="glass-dark rounded-2xl border border-white/10 p-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-white/35 mx-auto mb-3" />
              <p className="text-white font-semibold">No matches found</p>
              <p className="text-white/45 text-sm mt-1">Try a broader search phrase.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
