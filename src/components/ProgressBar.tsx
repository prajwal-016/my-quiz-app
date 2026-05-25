import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-center mb-2 text-xs font-medium text-slate-500">
        <span className="font-mono">Question <strong className="text-slate-700">{current}</strong> of {total}</span>
        <span className="font-mono font-semibold text-javaBlue">{Math.round(percentage)}% Complete</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div
          className="h-full bg-gradient-to-r from-javaBlue to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
