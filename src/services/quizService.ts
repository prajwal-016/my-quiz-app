import { supabase, getSupabaseConfig } from '../lib/supabase';
import type { Category, Question } from './mockData';
import { mockCategories, mockQuestions } from './mockData';

export interface QuizAttemptInput {
  category_id: string;
  score: number;
  total_questions: number;
  accuracy: number;
  time_taken: number;
}

export const quizService = {
  /**
   * Checks if Supabase is connected and responding.
   */
  isSupabaseConfigured(): boolean {
    const config = getSupabaseConfig();
    return config.isConnected;
  },

  /**
   * Fetches categories dynamically with question counts.
   * Falls back to mock data if Supabase is offline or not configured.
   */
  async getCategories(): Promise<Category[]> {
    if (!this.isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured. Using local mock categories.');
      return mockCategories;
    }

    try {
      // 1. Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('id, name, description, slug');

      if (catError) throw catError;
      if (!categoriesData || categoriesData.length === 0) {
        console.warn('No categories found in Supabase. Falling back to mock categories.');
        return mockCategories;
      }

      // 2. Fetch questions to map counts dynamically
      const { data: questionsData, error: qError } = await supabase
        .from('questions')
        .select('category_id');

      if (qError) {
        console.error('Error fetching questions for counts:', qError);
      }

      // 3. Calculate question counts
      const countsMap: Record<string, number> = {};
      if (questionsData) {
        questionsData.forEach((q) => {
          countsMap[q.category_id] = (countsMap[q.category_id] || 0) + 1;
        });
      }

      return categoriesData.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        slug: cat.slug,
        questionCount: countsMap[cat.id] || 0,
      }));
    } catch (error) {
      console.error('Error connecting to Supabase categories, using mock fallback:', error);
      return mockCategories;
    }
  },

  /**
   * Fetches questions filtered by category and difficulty.
   * Falls back to mock data if offline or not configured.
   */
  async getQuestions(categoryId: string, difficulty?: 'easy' | 'medium' | 'hard' | 'all'): Promise<Question[]> {
    if (!this.isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured. Filtering local mock questions.');
      return this.getMockQuestions(categoryId, difficulty);
    }

    try {
      let query = supabase
        .from('questions')
        .select('id, category_id, type, question_text, options, correct_answer, explanation, difficulty')
        .eq('category_id', categoryId);

      if (difficulty && difficulty !== 'all') {
        query = query.eq('difficulty', difficulty);
      }

      const { data: questionsData, error } = await query;

      if (error) throw error;

      if (!questionsData || questionsData.length === 0) {
        console.warn(`No questions found in Supabase for category ${categoryId}. Using mock fallback.`);
        return this.getMockQuestions(categoryId, difficulty);
      }

      // Parse Supabase JSONB options array correctly
      return questionsData.map((q) => {
        let parsedOptions: string[] | null = null;
        if (q.type === 'mcq') {
          if (Array.isArray(q.options)) {
            parsedOptions = q.options as string[];
          } else if (typeof q.options === 'string') {
            try {
              parsedOptions = JSON.parse(q.options);
            } catch {
              parsedOptions = [];
            }
          }
        }

        return {
          id: q.id,
          category_id: q.category_id,
          type: q.type as 'mcq' | 'fill_blank',
          question_text: q.question_text,
          options: parsedOptions,
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        };
      });
    } catch (error) {
      console.error('Error fetching questions from Supabase, using mock fallback:', error);
      return this.getMockQuestions(categoryId, difficulty);
    }
  },

  /**
   * Helper to filter mock questions locally.
   */
  getMockQuestions(categoryId: string, difficulty?: 'easy' | 'medium' | 'hard' | 'all'): Question[] {
    let filtered = mockQuestions.filter((q) => q.category_id === categoryId);
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }
    return filtered;
  },

  /**
   * Push quiz attempt results back to the database.
   */
  async saveQuizAttempt(attempt: QuizAttemptInput): Promise<boolean> {
    if (!this.isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured. Quiz attempt not saved to database.');
      return false;
    }

    try {
      const { error } = await supabase.from('quiz_attempts').insert([
        {
          category_id: attempt.category_id,
          score: attempt.score,
          total_questions: attempt.total_questions,
          accuracy: attempt.accuracy,
          time_taken: attempt.time_taken,
        },
      ]);

      if (error) {
        console.error('Failed to save quiz attempt to Supabase:', error);
        return false;
      }

      console.log('Successfully saved quiz attempt to Supabase.');
      return true;
    } catch (error) {
      console.error('Error saving attempt to Supabase:', error);
      return false;
    }
  },
};
