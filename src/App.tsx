import { useState, useEffect } from 'react';
import { Database, ArrowLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { getSupabaseConfig } from './lib/supabase';
import { quizService } from './services/quizService';
import type { Category, Question } from './services/mockData';
import { Dashboard } from './components/Dashboard';
import { QuizCard } from './components/QuizCard';
import { ProgressBar } from './components/ProgressBar';
import { Timer } from './components/Timer';
import { ScoreSummary } from './components/ScoreSummary';
import { DatabaseConfig } from './components/DatabaseConfig';
import { CategorySkeleton, QuizSkeleton } from './components/SkeletonLoader';

type ActiveView = 'dashboard' | 'loading_quiz' | 'quiz' | 'summary';

interface AttemptDetail {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

function App() {
  // Database status and configuration drawer state
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isDbDrawerOpen, setIsDbDrawerOpen] = useState(false);

  // App routing and loading views
  const [view, setView] = useState<ActiveView>('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  // Active Quiz State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isCurrentAnswered, setIsCurrentAnswered] = useState(false);
  const [currentSelectedAnswer, setCurrentSelectedAnswer] = useState('');
  const [currentIsCorrect, setCurrentIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState<AttemptDetail[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [finalTimeTaken, setFinalTimeTaken] = useState(0);

  // Check database configuration on load and fetch categories
  useEffect(() => {
    checkDatabaseConnection();
    loadCategories();
  }, []);

  const checkDatabaseConnection = () => {
    const config = getSupabaseConfig();
    setIsDbConnected(config.isConnected);
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError(false);
    try {
      const data = await quizService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategoriesError(true);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleConfigChanged = () => {
    checkDatabaseConnection();
    loadCategories();
  };

  // Start active quiz session
  const handleStartQuiz = async (categoryId: string, difficulty: 'easy' | 'medium' | 'hard' | 'all') => {
    const cat = categories.find((c) => c.id === categoryId) || null;
    setSelectedCategory(cat);
    setSelectedDifficulty(difficulty);
    setView('loading_quiz');

    try {
      const fetchedQuestions = await quizService.getQuestions(categoryId, difficulty);
      
      // Shuffle questions to make each attempt dynamic
      const shuffled = [...fetchedQuestions].sort(() => 0.5 - Math.random());
      
      setQuestions(shuffled);
      setCurrentIdx(0);
      setIsCurrentAnswered(false);
      setCurrentSelectedAnswer('');
      setCurrentIsCorrect(null);
      setAttempts([]);
      setSessionStartTime(Date.now());
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuestions([]);
    } finally {
      setView('quiz');
    }
  };

  // Submit current question answer
  const handleAnswerSubmit = (isCorrect: boolean, userAnswer: string) => {
    setIsCurrentAnswered(true);
    setCurrentSelectedAnswer(userAnswer);
    setCurrentIsCorrect(isCorrect);

    const activeQuestion = questions[currentIdx];
    
    // Track user attempt detail
    setAttempts((prev) => [
      ...prev,
      {
        question: activeQuestion,
        userAnswer,
        isCorrect,
      },
    ]);
  };

  // Handle Timeout (forced submission)
  const handleTimeout = () => {
    if (isCurrentAnswered) return;
    handleAnswerSubmit(false, ''); // Forced incorrect answer with blank text
  };

  // Move to next question or end quiz
  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setIsCurrentAnswered(false);
      setCurrentSelectedAnswer('');
      setCurrentIsCorrect(null);
    } else {
      // End Quiz - save attempts and show summary
      const timeTakenSecs = Math.floor((Date.now() - sessionStartTime) / 1000);
      setFinalTimeTaken(timeTakenSecs);

      // Save statistics back to database asynchronously (optional)
      if (selectedCategory) {
        const correctCount = attempts.filter((a) => a.isCorrect).length;
        const accPct = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
        
        quizService.saveQuizAttempt({
          category_id: selectedCategory.id,
          score: correctCount,
          total_questions: questions.length,
          accuracy: parseFloat(accPct.toFixed(2)),
          time_taken: timeTakenSecs,
        });
      }

      setView('summary');
    }
  };

  // Retake quiz with same filters
  const handleRetakeQuiz = () => {
    if (selectedCategory) {
      handleStartQuiz(selectedCategory.id, selectedDifficulty);
    }
  };

  const handleGoHome = () => {
    setSelectedCategory(null);
    setQuestions([]);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 bg-white border-b border-slate-200/80 shadow-sm z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 py-4.5 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleGoHome}>
            <div className="w-9 h-9 rounded-xl bg-javaBlue flex items-center justify-center text-white shadow-sm shadow-sky-200">
              <Sparkles size={16} fill="currentColor" />
            </div>
            <span className="font-extrabold text-slate-800 text-base md:text-lg tracking-tight font-mono">
              JavaStack<span className="text-javaBlue">.io</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Database status button in header */}
            <button
              onClick={() => setIsDbDrawerOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none cursor-pointer flex items-center gap-1.5"
              title="Database Settings"
            >
              <Database size={17} />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Database</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center py-6 px-4">
        
        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          loadingCategories ? (
            <CategorySkeleton />
          ) : categoriesError ? (
            <div className="w-full max-w-md mx-auto bg-white border border-red-200 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4 animate-fade-in">
              <AlertCircle size={40} className="text-red-500" />
              <h3 className="font-bold text-slate-800 text-lg">Failed to Load Dashboard</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We couldn't connect to the database service. Verify your Supabase settings or internet connection and try again.
              </p>
              <button
                onClick={loadCategories}
                className="py-3 px-6 bg-javaBlue hover:bg-javaBlue-dark text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={15} />
                Retry Loading
              </button>
            </div>
          ) : (
            <Dashboard
              categories={categories}
              onStartQuiz={handleStartQuiz}
              isDbConnected={isDbConnected}
              onOpenSettings={() => setIsDbDrawerOpen(true)}
            />
          )
        )}

        {/* VIEW: LOADING ACTIVE QUIZ */}
        {view === 'loading_quiz' && (
          <div className="max-w-3xl mx-auto w-full">
            <QuizSkeleton />
          </div>
        )}

        {/* VIEW: ACTIVE QUIZ */}
        {view === 'quiz' && (
          questions.length === 0 ? (
            /* EMPTY STATE: No questions exist */
            <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4.5 animate-fade-in">
              <AlertCircle size={40} className="text-amber-500" />
              <h3 className="font-bold text-slate-800 text-lg">No Questions Found</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                There are no active Java questions inside <strong>{selectedCategory?.name}</strong> matching the difficulty filter <strong>"{selectedDifficulty}"</strong>.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleGoHome}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Dashboard
                </button>
                <button
                  onClick={() => selectedCategory && handleStartQuiz(selectedCategory.id, 'all')}
                  className="flex-1 py-3 px-4 bg-javaBlue hover:bg-javaBlue-dark text-white rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  View All Difficulty
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE QUIZ SCREEN */
            <div className="w-full max-w-3xl mx-auto animate-fade-in flex flex-col gap-5">
              
              {/* Back Link */}
              <button
                onClick={handleGoHome}
                className="w-fit flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors focus:outline-none mb-1"
              >
                <ArrowLeft size={13} />
                <span>Quit Quiz</span>
              </button>

              {/* Dynamic Header */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Active Module</span>
                  <span className="text-base font-extrabold text-slate-800 leading-snug">{selectedCategory?.name}</span>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  {/* Slim animated ProgressBar */}
                  <div className="flex-1 md:w-48 max-w-md">
                    <ProgressBar current={currentIdx + 1} total={questions.length} />
                  </div>

                  {/* Circular svg Countdown Timer */}
                  <Timer
                    duration={30}
                    onTimeout={handleTimeout}
                    isActive={!isCurrentAnswered}
                    resetKey={currentIdx}
                  />
                </div>
              </div>

              {/* Core Quiz Question Display Card */}
              <QuizCard
                question={questions[currentIdx]}
                onAnswerSubmit={handleAnswerSubmit}
                isAnswered={isCurrentAnswered}
                selectedAnswer={currentSelectedAnswer}
                isCorrect={currentIsCorrect}
                onNext={handleNextQuestion}
                isLastQuestion={currentIdx + 1 === questions.length}
              />
            </div>
          )
        )}

        {/* VIEW: SCORE BREAKDOWN SUMMARY */}
        {view === 'summary' && (
          <ScoreSummary
            score={attempts.filter((a) => a.isCorrect).length}
            totalQuestions={questions.length}
            timeTaken={finalTimeTaken}
            attempts={attempts}
            onRetake={handleRetakeQuiz}
            onGoHome={handleGoHome}
          />
        )}

      </main>

      {/* Persistent Settings Config Drawer */}
      <DatabaseConfig
        isOpen={isDbDrawerOpen}
        onClose={() => setIsDbDrawerOpen(false)}
        onConfigChanged={handleConfigChanged}
      />

      {/* Footer Info */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center select-none text-xs font-medium text-slate-400">
        <p className="max-w-6xl mx-auto px-4">
          &copy; {new Date().getFullYear()} JavaStack Academy. Built for premium technical interview preparation.
        </p>
      </footer>
    </div>
  );
}

export default App;
