import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { nextQuestion, previousQuestion, updateScore, resetQuiz } from '../quizSlice';
import useLocalStorage from '../hooks/useLocalStorage';

const Quiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, name, score } = useSelector((state: RootState) => state.quiz);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [leaderboard, setLeaderboard] = useLocalStorage<Array<{ name: string; score: number }>>('leaderboard', []);

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/');
    }
  }, [questions, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          handleNextQuestion();
          return getTimeForQuestion();
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const getTimeForQuestion = () => {
    const difficulty = questions[currentQuestionIndex]?.difficulty;
    switch (difficulty) {
      case 'hard':
        return 10;
      case 'medium':
        return 15;
      default:
        return 20;
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === questions[currentQuestionIndex].correct_answer) {
      dispatch(updateScore(1));
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(nextQuestion());
      setTimeLeft(getTimeForQuestion());
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer('');
    dispatch(previousQuestion());
    setTimeLeft(getTimeForQuestion());
  };

  const finishQuiz = () => {
    const newLeaderboard = [...leaderboard, { name, score }];
    setLeaderboard(newLeaderboard);
    console.log('Leaderboard updated:', newLeaderboard); 
    dispatch(resetQuiz());
    navigate('/leaderboard');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = useMemo(() => {
    return [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);
  }, [currentQuestionIndex]); 

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  // const currentQuestion = questions[currentQuestionIndex];
  // const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);

  return (
    <div className="quiz">
      <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p>Time left: {timeLeft} seconds</p>
      <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></h3>
      <ul>
        {allAnswers.map((answer, index) => (
          <li key={index}>
            <button onClick={() => handleAnswer(answer)} disabled={showFeedback}>
              {answer}
            </button>
          </li>
        ))}
      </ul>
      {showFeedback && (
        <div className="feedback">
          {selectedAnswer === currentQuestion.correct_answer ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
      <div className="navigation">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion}>Previous</button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNextQuestion}>Next</button>
        ) : (
          <button onClick={finishQuiz}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Quiz;