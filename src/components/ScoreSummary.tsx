import React, { useState } from 'react';
import { Award, RotateCcw, Home, Clock, Percent, ClipboardCheck, ChevronDown, ChevronUp, Check, X, BookOpen } from 'lucide-react';
import type { Question } from '../services/mockData';
import { CodeViewer } from './CodeViewer';

interface AttemptDetail {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  attempts: AttemptDetail[];
  onRetake: () => void;
  onGoHome: () => void;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  score,
  totalQuestions,
  timeTaken,
  attempts,
  onRetake,
  onGoHome,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  // Format time taken beautifully
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getAccuracyColor = (pct: number) => {
    if (pct >= 80) return { stroke: 'stroke-emerald-500', text: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-150', comment: 'Excellent performance! You have high proficiency.' };
    if (pct >= 50) return { stroke: 'stroke-amber-500', text: 'text-amber-600 bg-amber-50', border: 'border-amber-150', comment: 'Good job! Review the missed concepts to perfect your score.' };
    return { stroke: 'stroke-red-500', text: 'text-red-600 bg-red-50', border: 'border-red-150', comment: 'Needs review. Go through the explanations and try again to improve.' };
  };

  const accStyle = getAccuracyColor(accuracy);

  // SVG parameters for Accuracy Circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  // Split and render questions correctly with CodeViewer in review
  const renderReviewQuestion = (text: string) => {
    if (!text.includes('```')) {
      return <p className="text-slate-700 font-medium text-sm md:text-base mb-3 leading-relaxed">{text}</p>;
    }
    const parts = text.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const lines = part.split('\n');
        const firstLine = lines[0].trim();
        const language = ['java', 'sql', 'html', 'javascript', 'css'].includes(firstLine) ? firstLine : 'java';
        const code = lines.slice(1).join('\n').trim();
        return <CodeViewer key={index} code={code} language={language} />;
      } else {
        return part.trim() ? (
          <p key={index} className="text-slate-700 font-medium text-sm md:text-base mb-3 leading-relaxed">
            {part}
          </p>
        ) : null;
      }
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 select-none animate-slide-in text-left">
      
      {/* Overview Block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center text-center gap-6 mb-6">
        
        {/* Radial SVG Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Gray background track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="8"
            />
            {/* Highlighting segment */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={`fill-none transition-all duration-1000 ease-out ${accStyle.stroke}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-slate-800 font-mono tracking-tighter">{accuracy}%</span>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Accuracy</span>
          </div>
        </div>

        {/* Dynamic Comment */}
        <div className="max-w-md">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Award className="text-javaBlue" size={20} />
            <h2 className="text-xl font-extrabold text-slate-800">Quiz Completed!</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            {accStyle.comment}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-javaBlue mb-1.5 border border-sky-100">
              <ClipboardCheck size={18} />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
            <span className="text-base font-extrabold text-slate-800 font-mono">{score} / {totalQuestions}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1.5 border border-amber-100">
              <Clock size={18} />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time Taken</span>
            <span className="text-base font-extrabold text-slate-800 font-mono">{formatTime(timeTaken)}</span>
          </div>

          <div className={`flex flex-col items-center`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 border ${accStyle.text.split(' ')[1]} ${accStyle.text.split(' ')[0]}`}>
              <Percent size={18} />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accuracy</span>
            <span className="text-base font-extrabold text-slate-800 font-mono">{accuracy}%</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col md:flex-row gap-3 mt-2">
          <button
            onClick={onRetake}
            className="flex-1 py-3.5 px-4 bg-javaBlue hover:bg-javaBlue-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <RotateCcw size={16} />
            <span>Retake Module</span>
          </button>
          
          <button
            onClick={onGoHome}
            className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <Home size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Accordion Review Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <BookOpen className="text-javaBlue" size={18} />
          <h3 className="font-extrabold text-slate-800 text-base">Questions Review</h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {attempts.map((attempt, index) => {
            const isExpanded = expandedIndex === index;
            
            return (
              <div
                key={index}
                className={`border rounded-xl transition-all duration-200 ${
                  isExpanded 
                    ? 'border-slate-300 shadow-sm' 
                    : 'border-slate-150 hover:border-slate-200 hover:bg-slate-50/40'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center gap-3 py-3.5 px-4 text-left font-medium text-slate-800 focus:outline-none"
                >
                  <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg border text-xs font-bold ${
                    attempt.isCorrect 
                      ? 'bg-emerald-500 text-white border-emerald-600' 
                      : 'bg-red-500 text-white border-red-600'
                  }`}>
                    {attempt.isCorrect ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                  </span>

                  <span className="flex-1 truncate text-sm md:text-base font-semibold pr-2">
                    {attempt.question.question_text.replace(/```[\s\S]*?```/g, '[CodeSnippet]').substring(0, 75)}...
                  </span>

                  <span className="text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-slate-100 animate-fade-in">
                    
                    {/* Rendered Question */}
                    <div className="text-slate-800 mb-4 select-text">
                      {renderReviewQuestion(attempt.question.question_text)}
                    </div>

                    {/* Answers Breakdown Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs md:text-sm">
                      {/* User's Answer */}
                      <div className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                        attempt.isCorrect 
                          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950' 
                          : 'bg-red-50/40 border-red-200 text-red-950'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Answer:</span>
                        <code className="font-mono font-bold text-xs md:text-sm break-all">{attempt.userAnswer || '[Empty / Time out]'}</code>
                      </div>

                      {/* Correct Answer */}
                      <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-950 flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correct Answer:</span>
                        <code className="font-mono font-bold text-xs md:text-sm text-emerald-700 break-all">{attempt.question.correct_answer}</code>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-slate-600 text-xs md:text-sm leading-relaxed select-text">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1 h-3 bg-javaBlue rounded-full" />
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Takeaway / Concept</span>
                      </div>
                      <p>{attempt.question.explanation}</p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
