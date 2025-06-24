import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { getDeviceId } from '../services/deviceId';

const HighScoresModal = ({ isOpen, onClose, highScores, loading }) => {
  const [activeTab, setActiveTab] = useState('my'); // 'all' or 'my' - default to 'my'
  const [deviceId, setDeviceId] = useState(null);
  const [filteredScores, setFilteredScores] = useState([]);

  // Add debugging with specific tags
  console.log('[FLAG_GAME] HighScoresModal props:', { isOpen, highScores, loading });
  
  // Load device ID when component mounts
  useEffect(() => {
    if (isOpen) {
      getDeviceId().then(id => {
        setDeviceId(id);
        console.log('[FLAG_GAME] Device ID loaded:', id);
      });
    }
  }, [isOpen]);

  // Filter scores based on active tab
  useEffect(() => {
    if (!highScores || !Array.isArray(highScores)) {
      setFilteredScores([]);
      return;
    }

    if (activeTab === 'my' && deviceId) {
      // Filter to only show scores from this device
      const myScores = highScores.filter(score => score.deviceId === deviceId);
      setFilteredScores(myScores);
      console.log('[FLAG_GAME] My scores filtered:', myScores.length, 'scores');
    } else {
      // Show all scores
      setFilteredScores(highScores);
      console.log('[FLAG_GAME] All scores:', highScores.length, 'scores');
    }
  }, [highScores, activeTab, deviceId]);
  
  if (!isOpen) return null;

  // Ensure filteredScores is an array
  const safeHighScores = Array.isArray(filteredScores) ? filteredScores : [];
  console.log('[FLAG_GAME] Safe high scores:', safeHighScores);

  const difficulties = ['easy', 'medium', 'hard'];
  const difficultyEmojis = {
    easy: '🟢',
    medium: '🟦',
    hard: <span className="rotate-emoji">⬛</span>,
  };

  const scoresByDifficulty = difficulties.map(difficultyLevel => ({
    level: difficultyLevel,
    displayName: difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1),
    emoji: difficultyEmojis[difficultyLevel],
    scores: safeHighScores.filter(score => score && score.difficulty === difficultyLevel).slice(0, 4)
  }));

  // Simplified platform detection - just check if we're in a native app
  const isNativeApp = Capacitor.isNativePlatform();
  console.log('[FLAG_GAME] Platform:', Capacitor.getPlatform(), 'isNative:', isNativeApp);

  const handleClose = (e) => {
    console.log('[FLAG_GAME] Close function called');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onClose) {
      console.log('[FLAG_GAME] Calling onClose function');
      onClose();
    } else {
      console.log('[FLAG_GAME] onClose function is undefined');
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  };

  // Use CSS classes instead of inline styles for better compatibility
  const modalClasses = `modal ${isOpen ? 'active' : ''} ${isNativeApp ? 'native-app' : ''}`;
  const contentClasses = `modal-content ${isNativeApp ? 'native-content' : ''}`;

  console.log('[FLAG_GAME] Rendering modal with classes:', modalClasses);
  console.log('[FLAG_GAME] Scores by difficulty:', scoresByDifficulty);

  return (
    <div className={modalClasses} onClick={handleBackdropClick}>
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>High Scores</h2>
          <button 
            className="modal-close"
            onClick={handleClose}
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="high-scores-tabs">
          <button
            className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
            type="button"
          >
            My High Scores
          </button>
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            type="button"
          >
            All Time High Scores
          </button>
        </div>

        {/* Note Section */}
        <div className="high-score-note">
          {activeTab === 'my' && (
            <p>
              Table displays highest scores achieved during this session or with this mobile device.
            </p>
          )}
          <p>
            An asterisk (*) indicates that the score was attained while playing with country flags only.
          </p>
        </div>

        {/* Content */}
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">Loading high scores...</div>
          ) : safeHighScores.length === 0 ? (
            <div className="modal-empty">No high scores yet. Play a game to see your scores!</div>
          ) : (
            <div className={`high-scores-container ${activeTab === 'my' ? 'my-scores' : ''}`}>
              {scoresByDifficulty.map(group => {
                console.log('[FLAG_GAME] Rendering group:', group.level, 'with', group.scores.length, 'scores');
                if (group.scores.length > 0) {
                  return (
                    <div key={group.level} className="high-scores-difficulty-group">
                      <h3 className={`difficulty-group-header difficulty-header-${group.level}`}>
                        {group.emoji} {group.displayName}
                      </h3>
                      
                      {/* Header row */}
                      <div className="high-scores-header">
                        <span className="header-rank">Rank</span>
                        {activeTab === 'all' && <span className="header-name">Name</span>}
                        <span className="header-score">Score</span>
                        <span className="header-accuracy">Accuracy</span>
                        <span className="header-date">Date</span>
                      </div>
                      
                      {/* Score rows */}
                      <ul className="high-scores-list">
                        {group.scores.map((score, index) => (
                          <li key={index} className="high-score-entry">
                            <span className="entry-position">{index + 1}.</span>
                            {activeTab === 'all' && <span className="entry-name">{score.playerName || 'Anonymous'}</span>}
                            <span className="entry-points">
                              {score.score}{score.sovereignOnly ? <sup>*</sup> : null}
                            </span>
                            <span className="entry-accuracy">{score.accuracy}%</span>
                            <span className="entry-date">{new Date(score.date).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="button"
            onClick={handleClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighScoresModal;