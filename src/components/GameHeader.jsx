import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import useOrientation from '../hooks/useOrientation';

const GameHeader = ({ score, timeLeft, currentStreak, showStreakBonus, streakTimeBonus, streakBonusKey }) => {
  const [showFloatingBonus, setShowFloatingBonus] = useState(false);
  const { isLandscape, isNativeApp } = useOrientation();
  
  const getTimerClass = () => {
    let classes = [];
    if (timeLeft <= 10) classes.push('danger');
    else if (timeLeft <= 20) classes.push('warning');
    return classes.join(' ');
  };

  // Check if the platform is mobile (iOS or Android)
  const isMobile = Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios';

  // Handle streak bonus animation - trigger on every streakBonusKey change
  useEffect(() => {
    if (streakBonusKey > 0 && streakTimeBonus > 0) {
      setShowFloatingBonus(true);
      
      // Remove the floating bonus element after animation completes
      const timer = setTimeout(() => {
        setShowFloatingBonus(false);
      }, 2500); // Doubled the time for twice as long visibility
      
      return () => clearTimeout(timer);
    }
  }, [streakBonusKey]); // Only depend on streakBonusKey which increments each time

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



  return (
    <>
      <header className="game-header-main">
        <h1 style={{ padding: isMobile ? '20px' : '0' }}>Guessy Flaggy</h1>
      </header>
      <div className={`game-info ${isNativeApp ? 'native-app' : ''}`}>
        <div className={`game-stats ${getLayoutClass()}`}>
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
      {showFloatingBonus && (
        <div className="floating-bonus-indicator">
          +{streakTimeBonus}s
        </div>
      )}
    </>
  );
};

export default GameHeader; 