import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizState {
  name: string;
  category: string;
  difficulty: string;
  numberOfQuestions: number;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  name: '',
  category: '',
  difficulty: '',
  numberOfQuestions: 10,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (_, { getState, rejectWithValue }) => {
    const { quiz } = getState() as { quiz: QuizState };
    const { category, difficulty, numberOfQuestions } = quiz;
    
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch questions');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizSetup: (state, action: PayloadAction<Partial<QuizState>>) => {
      return { ...state, ...action.payload };
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    previousQuestion: (state) => {
      state.currentQuestionIndex -= 1;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    resetQuiz: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuizSetup, nextQuestion, previousQuestion, updateScore, resetQuiz } = quizSlice.actions;

export default quizSlice.reducer;