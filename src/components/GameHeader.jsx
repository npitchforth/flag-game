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
        <div className={`game-stats ${isMobile ? 'mobile-layout' : ''}`}>
          <div className="stat timer-stat">
            <span className={`stat-value ${getTimerClass()}`} id="timer">{timeLeft}</span>
            <span className="stat-label">Seconds</span>
          </div>
          {isMobile ? (
            <div className="bottom-row">
              <div className="stat score-stat">
                <span className="stat-value">{score}</span>
                <span className="stat-label">Score</span>
              </div>
              <div className="stat streak-stat">
                <span className="stat-value">{currentStreak}</span>
                <span className="stat-label">Streak</span>
              </div>
            </div>
          ) : (
            <>
              <div className="stat score-stat">
                <span className="stat-value">{score}</span>
                <span className="stat-label">Score</span>
              </div>
              <div className="stat streak-stat">
                <span className="stat-value">{currentStreak}</span>
                <span className="stat-label">Streak</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameHeader; 