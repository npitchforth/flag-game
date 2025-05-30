import React, { useState, useEffect, useRef } from 'react';
import GameHeader from './components/GameHeader';
import ProgressBar from './components/ProgressBar';
import FlagOptionsGrid from './components/FlagOptionsGrid';
import DifficultySelector from './components/DifficultySelector';
import GameOverScreen from './components/GameOverScreen';
import HighScoresModal from './components/HighScoresModal';
import { addHighScore } from './config/supabase'; 

const App = () => {
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCountry, setQuestionCountry] = useState(null);
  const [flagOptions, setFlagOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [clickedFlag, setClickedFlag] = useState(null);
  const [disableClicks, setDisableClicks] = useState(false);
  const [usedCountries, setUsedCountries] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [optionCount, setOptionCount] = useState(4);
  const [highScores, setHighScores] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flagGameHighScores')) || [];
    } catch {
      return [];
    }
  });
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [sovereignOnly, setSovereignOnly] = useState(false);

  const timerRef = useRef(null);
  const progressBarRef = useRef(null);

  const difficultySettings = {
    easy: { time: 15, optionCount: 4 },
    medium: { time: 15, optionCount: 4 },
    hard: { time: 15, optionCount: 4 }
  };

  useEffect(() => () => clearInterval(timerRef.current), []);
  useEffect(() => {
    if (timeLeft === 0) endGame();
  }, [timeLeft]);
  useEffect(() => {
    if (difficulty) {
      setTimeLeft(difficultySettings[difficulty].time);
      setOptionCount(difficultySettings[difficulty].optionCount);
    }
  }, [difficulty]);

  const startNewGame = () => {
    if (!window.countries || window.countries.length === 0) {
      alert('Error: Countries data not loaded. Please refresh the page and try again.');
      return;
    }
    setScore(0);
    setStreak(0);
    setCurrentStreak(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setUsedCountries([]);
    setGameOver(false);
    setTimeLeft(difficultySettings[difficulty].time);
    setFeedback('');
    setCorrectGuesses([]);
    setIncorrectGuesses([]);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    generateQuestion([]);
    setGameStarted(true);
  };

  const endGame = async () => {
    setGameOver(true);
    clearInterval(timerRef.current);
    const newScore = {
      playerName: 'Player', // Replace with actual player name if available
      score,
      date: new Date().toISOString(),
      difficulty,
      accuracy: totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      sovereignOnly,
      streak: currentStreak,
    };
  //save to local storage
    setHighScores(prev => [...prev, newScore]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
        if (a.sovereignOnly !== b.sovereignOnly) return (a.sovereignOnly === false ? -1 : 1);
        return new Date(a.date) - new Date(b.date);
      })
      .slice(0, 10)
    );
    localStorage.setItem('flagGameHighScores', JSON.stringify(
      [...highScores, newScore]
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
          if (a.sovereignOnly !== b.sovereignOnly) return (a.sovereignOnly === false ? -1 : 1);
          return new Date(a.date) - new Date(b.date);
        })
        .slice(0, 10)
    ));
  
    // Save to Supabase
    try {
      await addHighScore(newScore);
    } catch (error) {
      console.error('Failed to save score to Supabase:', error);
    }
  };
  
  

  const generateQuestion = (used = usedCountries) => {
    let pool = window.countries.filter(c => 
      difficulty === 'easy' ? c.difficulty === 'easy' :
      difficulty === 'medium' ? c.difficulty === 'medium' :
      !c.difficulty || c.difficulty === 'hard'
    );
    
    if (sovereignOnly) {
      pool = pool.filter(c => c.entity === 'sovereign-state');
    }
    
    const available = pool.filter(c => !used.includes(c.code));
    if (available.length < optionCount) {
      setUsedCountries([]);
      generateQuestion([]);
      return;
    }
    
    const newQuestion = available[Math.floor(Math.random() * available.length)];
    const wrongOptions = pool
      .filter(c => c.code !== newQuestion.code)
      .sort(() => 0.5 - Math.random())
      .slice(0, optionCount - 1);
    
    setQuestionCountry(newQuestion);
    setFlagOptions([...wrongOptions, newQuestion].sort(() => 0.5 - Math.random()));
    setFeedback('');
    setClickedFlag(null);
    setDisableClicks(false);
    setUsedCountries(prev => [...prev, newQuestion.code]);
  };

  const handleFlagClick = country => {
    if (disableClicks || gameOver) return;
    const isCorrect = country.code === questionCountry.code;
    setDisableClicks(true);
    setClickedFlag(country.code);
    setTotalAnswers(t => t + 1);
    
    if (isCorrect) {
      setScore(s => s + 1);
      setCorrectAnswers(ca => ca + 1);
      setCurrentStreak(cs => cs + 1);
      setStreak(s => Math.max(s, currentStreak + 1));
      setFeedback('Correct!');
      setCorrectGuesses(prev => [...prev, questionCountry]);
      setTimeout(() => generateQuestion(), 1000);
    } else {
      setCurrentStreak(0);
      setFeedback(`That's ${country.name}.`);
      setIncorrectGuesses(prev => [...prev, questionCountry]);
      setTimeout(() => generateQuestion(), 1500);
    }
  };

  const renderMainContent = () => {
    if (!gameStarted) {
      return (
        <div className="container">
          <header><h1>Guessy Flaggy</h1></header>
          <DifficultySelector
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            sovereignOnly={sovereignOnly}
            onSovereignOnlyChange={setSovereignOnly}
          />
          <div className="button-container">
            <button className="button success" onClick={startNewGame}>Start</button>
            <button className="button" onClick={() => setShowHighScores(true)}>High Scores</button>
          </div>
        </div>
      );
    }

    if (gameOver) {
      return (
        <GameOverScreen
          correctAnswers={correctAnswers}
          totalAnswers={totalAnswers}
          streak={streak}
          onPlayAgain={() => setGameStarted(false)}
          onShowHighScores={() => setShowHighScores(true)}
          correctGuesses={correctGuesses}
          incorrectGuesses={incorrectGuesses}
        />
      );
    }

    return (
      <div className="container">
        <GameHeader
          score={score}
          timeLeft={timeLeft}
          currentStreak={currentStreak}
        />
        <ProgressBar
          timeLeft={timeLeft}
          totalTime={difficultySettings[difficulty].time}
        />
        {questionCountry && (
          <>
            <div className="question">
              Which is the flag of <span style={{color: '#2563eb'}}>{questionCountry.name}</span>?
            </div>
            <FlagOptionsGrid
              flagOptions={flagOptions}
              questionCountry={questionCountry}
              clickedFlag={clickedFlag}
              onFlagClick={handleFlagClick}
            />
            <div className="feedback">{feedback}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {renderMainContent()}
      <HighScoresModal
        isOpen={showHighScores}
        onClose={() => setShowHighScores(false)}
        highScores={highScores}
      />
    </>
  );
};

export default App; 