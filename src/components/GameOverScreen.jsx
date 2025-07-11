import React from 'react';
import { Capacitor } from '@capacitor/core';
import useOrientation from '../hooks/useOrientation';

const GameOverScreen = ({
  correctAnswers,
  totalAnswers,
  streak,
  onPlayAgain,
  onShowHighScores,
  correctGuesses,
  incorrectGuesses,
  isNewHighScore,
  highScoreDifficulty,
  leaderboardPosition,
  leaderboardDifficulty,
  showForm,
  playerName,
  onPlayerNameChange,
  onSubmit,
  isPersonalBest,
  personalBestPosition,
  personalBestDifficulty,
  showAnonymousConfirmation,
  onAnonymousConfirm,
  onAnonymousCancel
}) => {
  // Platform detection for Capacitor-specific styling
  const isNativeApp = Capacitor.isNativePlatform();
  const isMobile = Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios';
  const { isLandscape } = useOrientation();
  const containerClass = isNativeApp ? 'container native-app' : 'container';

  const getAccuracy = () => totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const getDifficultyDisplayName = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getDifficultyEmoji = (difficulty) => {
    const emojis = {
      easy: '🟢',
      medium: '🟦', 
      hard: '⬛'
    };
    return emojis[difficulty] || '';
  };

  const getPositionText = (position) => {
    const positions = {
      2: '2nd',
      3: '3rd',
      4: '4th'
    };
    return positions[position] || '';
  };

  const getPersonalBestPositionText = (position) => {
    const positions = {
      1: '1st',
      2: '2nd',
      3: '3rd',
      4: '4th'
    };
    return positions[position] || '';
  };

  // Determine layout class based on orientation and platform
  const getLayoutClass = () => {
    if (!isNativeApp) {
      // Web version - keep unchanged
      return isMobile ? 'mobile-layout' : '';
    }
    
    // Native app - responsive to orientation
    if (isLandscape) {
      return 'native-landscape-layout';
    } else {
      return 'mobile-layout'; // Keep portrait layout unchanged
    }
  };



  console.log('🎮 GameOverScreen rendered with props:', {
    correctAnswers,
    totalAnswers,
    streak,
    isNewHighScore,
    highScoreDifficulty,
    leaderboardPosition,
    leaderboardDifficulty,
    correctGuessesCount: correctGuesses?.length,
    incorrectGuessesCount: incorrectGuesses?.length
  });

  return (
    <div className={`${containerClass} game-over-container`}>
      <header><h1>Game Over</h1></header>
      
      {/* High Score Banner - shown for 1st place */}
      {isNewHighScore && (
        <div className="new-high-score-banner">
           Wow! You've beaten the All Time {getDifficultyDisplayName(highScoreDifficulty)} Level High Score! 
        </div>
      )}
      
      {/* Leaderboard Banner - shown for 2nd, 3rd, 4th place */}
      {!isNewHighScore && leaderboardPosition && (
        <div className="leaderboard-banner">
           Wow, you've made the All Time {getDifficultyDisplayName(leaderboardDifficulty)} Level Leaderboard! ({getPositionText(leaderboardPosition)} Place)
        </div>
      )}
      
      {/* Personal Best Banner - shown for personal best but not all-time high score */}
      {!isNewHighScore && !leaderboardPosition && isPersonalBest && (
        <div className={`personal-best-banner ${personalBestPosition > 1 ? 'secondary' : ''}`}>
           Congratulations, that's your {personalBestPosition === 1 ? 'best' : getPersonalBestPositionText(personalBestPosition) + ' best'} score on {getDifficultyDisplayName(personalBestDifficulty)} level!
        </div>
      )}
      
      {showForm && (
        <form onSubmit={onSubmit} className="player-name-form">
          <input
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            placeholder="Enter your name"
            maxLength={25}
            className="player-name-input"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}
      
      {/* Anonymous Confirmation Dialog */}
      {showAnonymousConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>No Name Entered!</h3>
            <p>Are you sure you don't want to enter a name? If you don't, your high score will be displayed on the leaderboard with the name "Anonymous".</p>
            <div className="confirmation-buttons">
              <button 
                type="button" 
                className="button secondary" 
                onClick={onAnonymousConfirm}
              >
                Remain Anonymous
              </button>
              <button 
                type="button" 
                className="button success" 
                onClick={onAnonymousCancel}
              >
                Enter Name
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="game-over">
        <div className={`game-stats ${getLayoutClass()}`}>
          <div className="stat">
            <span className="stat-value">{correctAnswers}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalAnswers - correctAnswers}</span>
            <span className="stat-label">Wrong</span>
          </div>
          <div className="stat">
            <span className="stat-value">{getAccuracy()}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
        
        <div className="button-container">
          <button className="button success" onClick={onPlayAgain}>Play Again</button>
          <button className="button" onClick={onShowHighScores}>High Scores</button>
        </div>

        <div className="game-over-flags-container">
          <div className="flag-column">
            <h3>Correct</h3>
            {correctGuesses.length > 0 ? (
              <div className="flag-list">
                {correctGuesses.map((country, index) => {
                  const flagPath = window.getFlagImage(country);
                  console.log('Correct guess country:', country, 'Flag path:', flagPath);
                  return (
                    <div key={index} className="flag-item">
                      <img
                        src={flagPath}
                        alt={country.name}
                      />
                      <span>{country.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-message">None</div>
            )}
          </div>
          
          <div className="flag-column">
            <h3>Incorrect</h3>
            {incorrectGuesses.length > 0 ? (
              <div className="flag-list">
                {incorrectGuesses.map((country, index) => {
                  const flagPath = window.getFlagImage(country);
                  console.log('Incorrect guess country:', country, 'Flag path:', flagPath);
                  return (
                    <div key={index} className="flag-item">
                      <img
                        src={flagPath}
                        alt={country.name}
                      />
                      <span>{country.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-message">None</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;