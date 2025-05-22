import React from 'react';

const DifficultySelector = ({ 
  difficulty, 
  onDifficultyChange, 
  sovereignOnly, 
  onSovereignOnlyChange 
}) => {
  return (
    <div className="centered-text">
      <h2>Select Difficulty</h2>
      <div className="difficulty-selector">
        {['easy', 'medium', 'hard'].map(d => (
          <button
            key={d}
            className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
            onClick={() => onDifficultyChange(d)}
          >
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={sovereignOnly}
            onChange={() => onSovereignOnlyChange(prev => !prev)}
          />
          <span className="switch-slider"></span>
        </label>
        <span className="toggle-label">Only Include Countries</span>
      </div>
    </div>
  );
};

export default DifficultySelector; 