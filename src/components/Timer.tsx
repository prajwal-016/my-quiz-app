import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // Duration in seconds
  onTimeout: () => void;
  isActive: boolean; // Pause timer when answer is submitted
  resetKey: any; // Changes when moving to a new question
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeout, isActive, resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isActive, onTimeout]);

  // Calculate percentage of time remaining
  const percentage = (timeLeft / duration) * 100;
  
  // Choose color based on urgency
  let strokeColor = 'stroke-javaBlue';
  let textColor = 'text-javaBlue';

  if (timeLeft <= 5) {
    strokeColor = 'stroke-red-500';
    textColor = 'text-red-600 animate-pulse';
  } else if (timeLeft <= 10) {
    strokeColor = 'stroke-amber-500';
    textColor = 'text-amber-600';
  }

  // SVG parameters for the sleek circular timer
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-100 bg-white shadow-sm font-semibold select-none">
      {/* Circular SVG Progress */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            className="stroke-slate-100 fill-none"
            strokeWidth="3"
          />
          {/* Active Circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            className={`fill-none transition-all duration-1000 ease-linear ${strokeColor}`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-mono tracking-tighter text-slate-400">
          <Clock size={11} className="text-slate-400" />
        </span>
      </div>

      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 leading-none">Time Left</span>
        <span className={`text-sm font-mono leading-tight ${textColor}`}>{timeLeft}s</span>
      </div>
    </div>
  );
};
