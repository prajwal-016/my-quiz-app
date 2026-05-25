import React from 'react';

export const CategorySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse select-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm h-60">
          <div className="flex justify-between items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
            {/* Badge */}
            <div className="w-20 h-5 bg-slate-200 rounded-full" />
          </div>
          
          {/* Title */}
          <div className="w-3/4 h-6 bg-slate-200 rounded-md" />
          
          {/* Description */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-full h-3.5 bg-slate-200 rounded" />
            <div className="w-5/6 h-3.5 bg-slate-200 rounded" />
          </div>

          {/* Button */}
          <div className="w-full h-11 bg-slate-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const QuizSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-pulse select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="w-28 h-6 bg-slate-200 rounded-full" />
        <div className="w-20 h-6 bg-slate-200 rounded-full" />
      </div>

      {/* Question Text */}
      <div className="flex flex-col gap-3">
        <div className="w-full h-5 bg-slate-200 rounded" />
        <div className="w-11/12 h-5 bg-slate-200 rounded" />
        <div className="w-2/3 h-5 bg-slate-200 rounded" />
      </div>

      {/* Option Cards */}
      <div className="flex flex-col gap-3.5 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full h-14 bg-slate-100 rounded-xl border border-slate-150 flex items-center px-4 gap-3">
            <div className="w-7 h-7 bg-slate-200 rounded-lg flex-shrink-0" />
            <div className="w-1/2 h-4 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="flex justify-end mt-4">
        <div className="w-36 h-12 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};
