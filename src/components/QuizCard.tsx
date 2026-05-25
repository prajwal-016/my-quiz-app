import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, ArrowUpRight, Keyboard } from 'lucide-react';
import type { Question } from '../services/mockData';
import { CodeViewer } from './CodeViewer';

interface QuizCardProps {
  question: Question;
  onAnswerSubmit: (isCorrect: boolean, userAnswer: string) => void;
  isAnswered: boolean;
  selectedAnswer: string;
  isCorrect: boolean | null;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswerSubmit,
  isAnswered,
  selectedAnswer,
  isCorrect,
  onNext,
  isLastQuestion
}) => {
  const [mcqSelection, setMcqSelection] = useState<string>('');
  const [blankInput, setBlankInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync state when question changes
  useEffect(() => {
    setMcqSelection(isAnswered ? selectedAnswer : '');
    setBlankInput(isAnswered ? selectedAnswer : '');
    setErrorMsg('');
  }, [question, isAnswered, selectedAnswer]);

  // Split question text into paragraphs and code blocks
  const renderQuestionBody = (text: string) => {
    if (!text.includes('```')) {
      return (
        <p className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium mb-4">
          {text}
        </p>
      );
    }

    const parts = text.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Code block: extract language and code content
        const lines = part.split('\n');
        const firstLine = lines[0].trim();
        const language = ['java', 'sql', 'html', 'javascript', 'css'].includes(firstLine) ? firstLine : 'java';
        const code = lines.slice(1).join('\n').trim();
        return <CodeViewer key={index} code={code} language={language} />;
      } else {
        // Plain text paragraph
        return part.trim() ? (
          <p key={index} className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium mb-4">
            {part}
          </p>
        ) : null;
      }
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered) return;

    if (question.type === 'mcq') {
      if (!mcqSelection) {
        setErrorMsg('Please select an option before submitting.');
        return;
      }
      const isRight = mcqSelection === question.correct_answer;
      onAnswerSubmit(isRight, mcqSelection);
    } else {
      if (!blankInput.trim()) {
        setErrorMsg('Please enter an answer before submitting.');
        return;
      }
      
      // Trim, strip multiple spaces, and match case-insensitively
      const cleanInput = blankInput.trim().replace(/\s+/g, ' ');
      const cleanCorrect = question.correct_answer.trim().replace(/\s+/g, ' ');
      
      const isRight = cleanInput.toLowerCase() === cleanCorrect.toLowerCase();
      onAnswerSubmit(isRight, cleanInput);
    }
    setErrorMsg('');
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 md:p-8 shadow-sm animate-slide-in select-none">
      {/* Category Badge & Difficulty */}
      <div className="flex justify-between items-center gap-2 mb-5">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-javaBlue uppercase tracking-wider bg-javaBlue-50 px-2.5 py-1 rounded-full border border-javaBlue-100/60">
          <HelpCircle size={12} />
          {question.type === 'mcq' ? 'Multiple Choice' : 'Fill In The Blanks'}
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
          question.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          question.difficulty === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
          'bg-red-50 text-red-600 border-red-100'
        }`}>
          {question.difficulty}
        </span>
      </div>

      {/* Question Text & Code Snippets */}
      <div className="mb-6 text-left">
        {renderQuestionBody(question.question_text)}
      </div>

      {/* Interactive Options Area */}
      <div className="mb-6">
        {question.type === 'mcq' ? (
          /* MCQ OPTIONS */
          <div className="grid grid-cols-1 gap-3.5">
            {question.options?.map((option, idx) => {
              const isSelected = mcqSelection === option;
              const isOptionCorrect = option === question.correct_answer;
              
              let cardStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white';
              let badgeStyle = 'bg-slate-100 text-slate-500 border-slate-200';

              if (isAnswered) {
                if (isOptionCorrect) {
                  // Correct option - always green
                  cardStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium shadow-sm shadow-emerald-100';
                  badgeStyle = 'bg-emerald-500 text-white border-emerald-600';
                } else if (isSelected && !isCorrect) {
                  // User selected incorrect option - red
                  cardStyle = 'border-red-400 bg-red-50/60 text-red-950 font-medium shadow-sm shadow-red-100';
                  badgeStyle = 'bg-red-500 text-white border-red-600';
                } else {
                  // Unselected non-correct option - faded
                  cardStyle = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                  badgeStyle = 'bg-slate-100 text-slate-300 border-slate-200';
                }
              } else if (isSelected) {
                // Not submitted but selected - blue
                cardStyle = 'border-javaBlue bg-sky-50/50 text-javaBlue-dark font-medium shadow-sm';
                badgeStyle = 'bg-javaBlue text-white border-javaBlue-dark';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && setMcqSelection(option)}
                  disabled={isAnswered}
                  className={`w-full flex items-center gap-4 text-left p-4 rounded-xl border text-sm md:text-base transition-all duration-200 focus:outline-none ${cardStyle}`}
                >
                  <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border text-xs font-bold font-mono transition-all ${badgeStyle}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{option}</span>
                  {isAnswered && isOptionCorrect && (
                    <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle size={20} className="text-red-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* FILL IN THE BLANKS */
          <form onSubmit={handleSubmit} className="text-left">
            <div className={`flex flex-col gap-3 p-5 rounded-xl border transition-all ${
              isAnswered
                ? isCorrect
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-red-400 bg-red-50/30'
                : 'border-slate-200 bg-slate-50/40 focus-within:border-javaBlue focus-within:bg-white shadow-sm'
            }`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Keyboard size={14} className="text-slate-400" />
                <span>Type your answer:</span>
              </div>
              <input
                type="text"
                value={blankInput}
                onChange={(e) => !isAnswered && setBlankInput(e.target.value)}
                disabled={isAnswered}
                placeholder="Enter missing term..."
                className="w-full text-base font-mono bg-transparent border-b-2 border-slate-200 focus:border-javaBlue py-2 px-1 focus:outline-none text-slate-800 disabled:text-slate-600 font-semibold"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
              />
              
              {isAnswered && (
                <div className="mt-2 text-xs md:text-sm flex flex-col gap-1 animate-fade-in">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Correct! You answered "{selectedAnswer}"</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-500" />
                        <span className="text-red-700 font-semibold">Incorrect. You answered "{selectedAnswer || '[No Answer]'}"</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <div className="mt-1 bg-white border border-red-100 rounded-lg p-3 text-slate-700 flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Correct Value:</span>
                      <code className="text-emerald-600 text-sm font-bold bg-emerald-50/60 px-2 py-1 rounded inline-block w-fit font-mono">{question.correct_answer}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mb-4 text-xs md:text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 text-left animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-2">
        {!isAnswered ? (
          <button
            onClick={() => handleSubmit()}
            className="w-full md:w-auto px-7 py-3 text-sm md:text-base font-semibold text-white bg-javaBlue hover:bg-javaBlue-dark rounded-xl transition-all shadow-sm hover:shadow active:scale-98 flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
          >
            <span>Submit Answer</span>
            <ArrowUpRight size={18} />
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full md:w-auto px-7 py-3 text-sm md:text-base font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm hover:shadow active:scale-98 flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
          >
            <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className="mt-6 border border-slate-200/60 bg-slate-50/60 rounded-xl p-5 text-left animate-slide-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 bg-javaBlue rounded-full" />
            <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Explanation</h4>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
