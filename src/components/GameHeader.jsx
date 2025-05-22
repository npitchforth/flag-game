import React from 'react';

const GameHeader = ({ score, timeLeft, currentStreak }) => {
  const getTimerClass = () => timeLeft <= 10 ? 'danger' : timeLeft <= 20 ? 'warning' : '';

  return (
    <>
      <header>
        <h1>Guessy Flaggy</h1>
      </header>
      <div className="game-info">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-value">{score}</span>
            <span className="stat-label">Score</span>
          </div>
          <div className="stat">
            <span className={`stat-value ${getTimerClass()}`} id="timer">{timeLeft}</span>
            <span className="stat-label">Sec</span>
          </div>
          <div className="stat">
            <span className="stat-value">{currentStreak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameHeader; 