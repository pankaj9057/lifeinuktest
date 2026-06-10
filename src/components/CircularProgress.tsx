import { useEffect, useRef, useState } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}

export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#10B981',
  trackColor = 'rgba(255,255,255,0.1)',
  label,
  sublabel,
}: CircularProgressProps) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const animRef = useRef<number>(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const target = Math.min(100, Math.max(0, percentage));

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(eased * target);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none"
          style={{ fontSize: size * 0.22, color }}
        >
          {Math.round(animatedPct)}%
        </span>
        {label && (
          <span
            className="text-white/60 font-medium text-center leading-tight mt-0.5"
            style={{ fontSize: size * 0.1 }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="text-white/40 text-center leading-tight"
            style={{ fontSize: size * 0.085 }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
