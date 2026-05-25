import React, { useState } from 'react';
import { Coffee, Leaf, Layers, Database, Globe, Wifi, WifiOff, Settings, Star, Play, Terminal } from 'lucide-react';
import type { Category } from '../services/mockData';

interface DashboardProps {
  categories: Category[];
  onStartQuiz: (categoryId: string, difficulty: 'easy' | 'medium' | 'hard' | 'all') => void;
  isDbConnected: boolean;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  categories,
  onStartQuiz,
  isDbConnected,
  onOpenSettings,
}) => {
  // State to track selected difficulty for each category card
  const [difficulties, setDifficulties] = useState<Record<string, 'easy' | 'medium' | 'hard' | 'all'>>({});

  const handleDifficultyChange = (catId: string, diff: 'easy' | 'medium' | 'hard' | 'all') => {
    setDifficulties((prev) => ({
      ...prev,
      [catId]: diff,
    }));
  };

  // Helper to fetch the Lucide icon per category
  const getCategoryIcon = (slug: string) => {
    const props = { className: 'text-javaBlue flex-shrink-0', size: 24 };
    switch (slug) {
      case 'core-java':
        return <Coffee {...props} />;
      case 'spring-boot':
        return <Leaf {...props} className="text-emerald-500 flex-shrink-0" />;
      case 'hibernate-jpa':
        return <Layers {...props} className="text-indigo-500 flex-shrink-0" />;
      case 'sql-database':
        return <Database {...props} className="text-amber-500 flex-shrink-0" />;
      case 'frontend-integration':
        return <Globe {...props} className="text-sky-500 flex-shrink-0" />;
      default:
        return <Terminal {...props} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 select-none animate-fade-in">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-slate-200/60 pb-8 text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-javaBlue rounded-full" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Java Full Stack Academy
            </h1>
          </div>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Test and sharpen your skills across Java backend engineering, JPA mapping, SQL databases, and frontend API integrations.
          </p>
        </div>

        {/* Database Status Button */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:shadow active:scale-98 cursor-pointer focus:outline-none bg-white ${
            isDbConnected
              ? 'border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/20'
              : 'border-amber-200 text-amber-700 hover:border-amber-300 hover:bg-amber-50/20'
          }`}
        >
          {isDbConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi size={16} />
              <span>Live Database</span>
            </>
          ) : (
            <>
              <WifiOff size={16} />
              <span>Mock Mode</span>
            </>
          )}
          <Settings size={15} className="ml-1 opacity-70" />
        </button>
      </div>

      {/* Main Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const selectedDiff = difficulties[category.id] || 'all';

          return (
            <div
              key={category.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col gap-4.5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 group text-left relative overflow-hidden"
            >
              {/* Java blue subtle gradient on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 group-hover:bg-javaBlue transition-colors" />

              <div className="flex justify-between items-start">
                {/* Icon wrapper */}
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                  {getCategoryIcon(category.slug)}
                </div>
                {/* Questions Count Badge */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100 bg-slate-50 px-2.5 py-1 rounded-full">
                  {category.questionCount} {category.questionCount === 1 ? 'Question' : 'Questions'}
                </span>
              </div>

              {/* Category Info */}
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-javaBlue transition-colors mb-1.5 leading-snug">
                  {category.name}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Difficulty selector (SaaS pills layout) */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100/60">
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <Star size={11} className="text-slate-400" />
                  <span>Select Difficulty</span>
                </div>
                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-100/80 border border-slate-150">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => handleDifficultyChange(category.id, diff)}
                      className={`text-[10px] font-bold py-1.5 rounded-md capitalize transition-all focus:outline-none cursor-pointer ${
                        selectedDiff === diff
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Quiz Action */}
              <button
                onClick={() => onStartQuiz(category.id, selectedDiff)}
                className="w-full mt-1.5 py-3 px-4 bg-javaBlue hover:bg-javaBlue-dark text-white rounded-xl text-xs md:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
              >
                <span>Start Module</span>
                <Play size={13} fill="currentColor" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
