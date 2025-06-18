import React from 'react';
import { Capacitor } from '@capacitor/core';

const GameHeader = ({ score, timeLeft, currentStreak }) => {
  const getTimerClass = () => timeLeft <= 10 ? 'danger' : timeLeft <= 20 ? 'warning' : '';

  // Check if the platform is mobile (iOS or Android)
  const isMobile = Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios';

  return (
    <>
      <header>
        <h1 style={{ padding: isMobile ? '20px' : '0' }}>Guessy Flaggy</h1>
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