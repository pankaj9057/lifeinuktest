import { CheckCircle, XCircle, RotateCcw, Home, Trophy, Clock } from 'lucide-react';

interface ResultModalProps {
  testTitle: string;
  score: number;
  total: number;
  timeTaken: number;
  passed: boolean;
  onRetry: () => void;
  onHome: () => void;
  showExplanations: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export default function ResultModal({
  testTitle,
  score,
  total,
  timeTaken,
  passed,
  onRetry,
  onHome,
}: ResultModalProps) {
  const accuracy = Math.round((score / total) * 100);
  const totalTime = 45 * 60;
  const timeSaved = totalTime - timeTaken;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
        style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
      >
        {/* Banner */}
        <div
          className={`px-8 pt-8 pb-6 text-center ${
            passed
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
              : 'bg-gradient-to-br from-rose-500 to-red-600'
          }`}
        >
          <div className="flex justify-center mb-3">
            {passed ? (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">
            {passed ? 'Test Passed!' : 'Test Failed'}
          </h2>
          <p className="text-white/80 text-sm">{testTitle}</p>
        </div>

        {/* Stats */}
        <div className="p-8">
          {/* Big score */}
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <div
                className={`text-6xl font-bold mb-1 ${
                  passed ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {accuracy}%
              </div>
              <div className="text-slate-500 text-sm font-medium">
                {score} / {total} questions correct
              </div>
              <div
                className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  passed
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {passed ? 'Pass threshold (75%) met' : 'Below pass threshold (75%)'}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-slate-800 font-bold text-lg">{score}</div>
              <div className="text-slate-500 text-xs mt-0.5">Correct</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-slate-800 font-bold text-lg">{total - score}</div>
              <div className="text-slate-500 text-xs mt-0.5">Incorrect</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-slate-800 font-bold text-lg flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {formatTime(timeTaken)}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Time taken</div>
            </div>
          </div>

          {timeSaved > 0 && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span className="text-sky-700 text-sm font-medium">
                You finished {formatTime(timeSaved)} ahead of the time limit
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0F172A] text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>
            <button
              onClick={onHome}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
