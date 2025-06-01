import React from 'react';

const HighScoresModal = ({ isOpen, onClose, highScores, loading }) => {
  if (!isOpen) return null;

  const difficulties = ['easy', 'medium', 'hard'];
  const difficultyEmojis = {
    easy: '🟢',
    medium: '🟦',
    hard: '⬛',
  };

  const scoresByDifficulty = difficulties.map(difficultyLevel => ({
    level: difficultyLevel,
    displayName: difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1),
    emoji: difficultyEmojis[difficultyLevel],
    scores: highScores.filter(score => score.difficulty === difficultyLevel).slice(0, 4)
  }));

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>High Scores</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="high-score-note">
          <p>
            An asterisk (*) indicates that the score was attained while playing with country flags only.
          </p>
        </div>

        {loading ? (
          <div className="modal-loading">Loading high scores...</div>
        ) : highScores.length === 0 ? (
          <div className="modal-empty">No high scores yet. Play a game to see your scores!</div>
        ) : (
          scoresByDifficulty.map(group => {
            if (group.scores.length > 0) {
              return (
                <div key={group.level} className="high-scores-difficulty-group">
                  <h3 className={`difficulty-group-header difficulty-header-${group.level}`}>
                    {group.emoji} {group.displayName}
                  </h3>
                  <div className="high-scores-header">
                    <span className="header-rank">Rank</span>
                    <span className="header-score">Score</span>
                    <span className="header-accuracy">Accuracy</span>
                    <span className="header-date">Date</span>
                  </div>
                  <ul className="high-scores-list">
                    {group.scores.map((score, index) => (
                      <li className="high-score-entry" key={index}>
                        <span className="entry-position">{index + 1}.</span>
                        <span className="entry-points">{score.score}{score.sovereignOnly ? <sup>*</sup> : null}</span>
                        <span className="entry-accuracy">{score.accuracy}%</span>
                        <span className="entry-date">{new Date(score.date).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })
        )}
        <div className="modal-footer">
          <button className="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default HighScoresModal;