import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setQuizSetup, fetchQuestions } from '../quizSlice';
import { AppDispatch } from '../store';

const QuizSetup: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('9'); // Default: General Knowledge
  const [difficulty, setDifficulty] = useState('easy');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(setQuizSetup({ name, category, difficulty, numberOfQuestions }));
    await dispatch(fetchQuestions());
    navigate('/quiz');
  };

  return (
    <div className="quiz-setup">
      <h1>Quiz master</h1>
      <form onSubmit={handleStartQuiz}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="9">General Knowledge</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="number"
          placeholder="Number of Questions"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          min="1"
          max="50"
          required
        />
        <button type="submit">Start Quiz</button>
      </form>
    </div>
  );
};

export default QuizSetup;