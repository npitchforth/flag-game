
import React, { useState } from 'react';

const DifficultySelector = ({
  difficulty,
  onDifficultyChange,
  sovereignOnly,
  onSovereignOnlyChange
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

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
            id="sovereign-only"
            name="sovereign-only"
            checked={sovereignOnly}
            onChange={() => onSovereignOnlyChange(prev => !prev)}
          />
          <span className="switch-slider"></span>
        </label>
       
        <span className="toggle-label">Only Include Countries</span>
        <button
          className="info-button"
          onClick={() => setShowInfoModal(true)}
          type="button"
          aria-label="Information about country filter"
        >
          ?
        </button>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="info-modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-body">
              <p>
                <strong>'Only Include Countries' mode</strong>
              </p>
              <p>
                When 'Only Include Countries' is active, you'll see flags exclusively from UN Member & Observer States. We use this specific definition because 'country' can be interpreted differently. As a result, some places you might consider countries are not included, and vice-versa. Flags of states, territories, and organizations are excluded.
              </p>
            </div>
            <div className="info-modal-footer">
              <button 
                className="button"
                onClick={() => setShowInfoModal(false)}
                type="button"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultySelector;

