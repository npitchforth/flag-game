import React from 'react';

const GameOverScreen = ({
  correctAnswers,
  totalAnswers,
  streak,
  onPlayAgain,
  onShowHighScores,
  correctGuesses,
  incorrectGuesses
}) => {
  const getAccuracy = () => totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <div className="container">
      <header><h1>Game Over</h1></header>
      <div className="game-over">
        <div className="game-stats">
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
                {correctGuesses.map((country, index) => (
                  <div key={index} className="flag-item">
                    <img
                      src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
                      alt={country.name}
                    />
                    <span>{country.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">None</div>
            )}
          </div>
          
          <div className="flag-column">
            <h3>Incorrect</h3>
            {incorrectGuesses.length > 0 ? (
              <div className="flag-list">
                {incorrectGuesses.map((country, index) => (
                  <div key={index} className="flag-item">
                    <img
                      src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
                      alt={country.name}
                    />
                    <span>{country.name}</span>
                  </div>
                ))}
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