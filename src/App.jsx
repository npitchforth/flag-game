import React, { useState, useEffect, useRef } from 'react';
import GameHeader from './components/GameHeader';
import ProgressBar from './components/ProgressBar';
import FlagOptionsGrid from './components/FlagOptionsGrid';
import DifficultySelector from './components/DifficultySelector';
import GameOverScreen from './components/GameOverScreen';
import HighScoresModal from './components/HighScoresModal';
import { addHighScore, getHighScores } from './config/supabase'; 

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
  const [highScores, setHighScores] = useState([]);
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [sovereignOnly, setSovereignOnly] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [loadingHighScores, setLoadingHighScores] = useState(false);
  const [highScoreDifficulty, setHighScoreDifficulty] = useState('');
  // New states for leaderboard positioning
  const [leaderboardPosition, setLeaderboardPosition] = useState(null);
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState('');

  const timerRef = useRef(null);
  const progressBarRef = useRef(null);

  const difficultySettings = {
    easy: { time: 45, optionCount: 4 },
    medium: { time: 45, optionCount: 4 },
    hard: { time: 45, optionCount: 4 }
  };

    // Load high scores from Supabase on component mount
    useEffect(() => {
      loadHighScores();
    }, []);
  
    const loadHighScores = async () => {
      setLoadingHighScores(true);
      try {
        const scores = await getHighScores();
        console.log('📊 Loaded high scores from Supabase:', scores);
        setHighScores(scores);
      } catch (error) {
        console.error('Failed to load high scores:', error);
        // Fallback to local storage if Supabase fails
        try {
          const localScores = JSON.parse(localStorage.getItem('flagGameHighScores')) || [];
          console.log('📊 Fallback to local scores:', localScores);
          setHighScores(localScores);
        } catch {
          setHighScores([]);
        }
      } finally {
        setLoadingHighScores(false);
      }
    };
  
    const sortScores = (scores) => {
      return scores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
        if (a.sovereignOnly !== b.sovereignOnly) return (a.sovereignOnly === false ? -1 : 1);
        return new Date(a.date) - new Date(b.date);
      });
    };
  
    const isTopScoreForDifficulty = (newScore, existingScores, difficulty) => {
      console.log('🏆 Checking if top score for difficulty:', difficulty);
      console.log('🏆 New score:', newScore);
      
      // Filter existing scores by difficulty
      const difficultyScores = existingScores.filter(score => score.difficulty === difficulty);
      console.log('🏆 Existing scores for', difficulty, ':', difficultyScores);
      
      if (difficultyScores.length === 0) {
        console.log('🏆 No existing scores for this difficulty - this is the top score!');
        return true;
      }
      
      // Get the current top score for this difficulty
      const sortedExisting = sortScores([...difficultyScores]);
      const currentTopScore = sortedExisting[0];
      console.log('🏆 Current top score for', difficulty, ':', currentTopScore);
      
      // Compare new score with current top score using the same logic as sorting
      let isNewTop = false;
      
      if (newScore.score > currentTopScore.score) {
        isNewTop = true;
      } else if (newScore.score === currentTopScore.score) {
        if (newScore.accuracy > currentTopScore.accuracy) {
          isNewTop = true;
        } else if (newScore.accuracy === currentTopScore.accuracy) {
          // Check sovereign preference (non-sovereign is better)
          if (newScore.sovereignOnly === false && currentTopScore.sovereignOnly === true) {
            isNewTop = true;
          } else if (newScore.sovereignOnly === currentTopScore.sovereignOnly) {
            // If all else equal, newer date wins (this should rarely happen)
            isNewTop = new Date(newScore.date) >= new Date(currentTopScore.date);
          }
        }
      }
      
      console.log('🏆 Is new top score for', difficulty, '?', isNewTop);
      return isNewTop;
    };

    // New function to check leaderboard position (2nd, 3rd, 4th)
    const checkLeaderboardPosition = (newScore, existingScores, difficulty) => {
      console.log('🏅 Checking leaderboard position for difficulty:', difficulty);
      
      // Filter existing scores by difficulty
      const difficultyScores = existingScores.filter(score => score.difficulty === difficulty);
      console.log('🏅 Existing scores for', difficulty, ':', difficultyScores);
      
      // Add the new score to the list and sort
      const allScores = [...difficultyScores, newScore];
      const sortedScores = sortScores(allScores);
      
      console.log('🏅 All scores sorted:', sortedScores);
      
      // Find the position of the new score
      const newScoreIndex = sortedScores.findIndex(score => 
        score.score === newScore.score &&
        score.accuracy === newScore.accuracy &&
        score.sovereignOnly === newScore.sovereignOnly &&
        score.date === newScore.date
      );
      
      const position = newScoreIndex + 1; // Convert to 1-based position
      console.log('🏅 New score position:', position);
      
      // Return position if it's 2nd, 3rd, or 4th place
      if (position >= 2 && position <= 4) {
        return position;
      }
      
      return null;
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
    setIsNewHighScore(false);
    setHighScoreDifficulty('');
    setLeaderboardPosition(null);
    setLeaderboardDifficulty('');
    console.log('🎮 New game started, isNewHighScore reset to false');
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    generateQuestion([]);
    setGameStarted(true);
  };

  const endGame = async () => {
    console.log('🎮 Game ending...');
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

    console.log('🎮 Final game stats:', {
      score,
      correctAnswers,
      totalAnswers,
      currentStreak,
      difficulty,
      sovereignOnly
    });

    // Check if this is a new high score before saving
    console.log('🎮 Current high scores before check:', highScores);
    const isNewHigh = isTopScoreForDifficulty(newScore, highScores, difficulty);
    console.log('🎮 Setting isNewHighScore to:', isNewHigh);
    setIsNewHighScore(isNewHigh);

    // Set the difficulty for which the high score was achieved
    if (isNewHigh) {
      setHighScoreDifficulty(difficulty);
    }

    // Check for leaderboard position (2nd, 3rd, 4th) only if not a new high score
    if (!isNewHigh) {
      const position = checkLeaderboardPosition(newScore, highScores, difficulty);
      console.log('🏅 Leaderboard position:', position);
      setLeaderboardPosition(position);
      if (position) {
        setLeaderboardDifficulty(difficulty);
      }
    }

    // Save to local storage as backup
    const updatedLocalScores = sortScores([...highScores, newScore]).slice(0, 10);
    localStorage.setItem('flagGameHighScores', JSON.stringify(updatedLocalScores));
    console.log('🎮 Saved to local storage:', updatedLocalScores);
  
    // Save to Supabase
    try {
      console.log('🎮 Saving to Supabase...');
      await addHighScore(newScore);
      console.log('🎮 Successfully saved to Supabase');
      // Reload high scores from Supabase after saving
      console.log('🎮 Reloading high scores from Supabase...');
      await loadHighScores();
    } catch (error) {
      console.error('Failed to save score to Supabase:', error);
      // Update local state if Supabase fails
      setHighScores(updatedLocalScores);
    }
  };

  // Debug the isNewHighScore state
  useEffect(() => {
    console.log('🏆 isNewHighScore state changed to:', isNewHighScore);
  }, [isNewHighScore]);

  // Debug the leaderboard position state
  useEffect(() => {
    console.log('🏅 leaderboardPosition state changed to:', leaderboardPosition);
  }, [leaderboardPosition]);

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
            <button className="button" onClick={() => setShowHighScores(true)}>
              High Scores {loadingHighScores && '(Loading...)'}
            </button>
          </div>
        </div>
      );
    }

    if (gameOver) {
      console.log('🎮 Rendering GameOverScreen with isNewHighScore:', isNewHighScore);
      console.log('🎮 Rendering GameOverScreen with leaderboardPosition:', leaderboardPosition);
      return (
        <GameOverScreen
          correctAnswers={correctAnswers}
          totalAnswers={totalAnswers}
          streak={streak}
          onPlayAgain={() => setGameStarted(false)}
          onShowHighScores={() => setShowHighScores(true)}
          correctGuesses={correctGuesses}
          incorrectGuesses={incorrectGuesses}
          isNewHighScore={isNewHighScore}
          highScoreDifficulty={highScoreDifficulty}
          leaderboardPosition={leaderboardPosition}
          leaderboardDifficulty={leaderboardDifficulty}
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
        loading={loadingHighScores}
      />
    </>
  );
};

export default App;