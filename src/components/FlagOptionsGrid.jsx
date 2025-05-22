import React from 'react';
import FlagOption from './FlagOption';

const FlagOptionsGrid = ({ flagOptions, questionCountry, clickedFlag, onFlagClick }) => {
  return (
    <div className="flag-options" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {flagOptions.slice(0, 2).map((country) => (
          <FlagOption
            key={country.code}
            country={country}
            onClick={() => onFlagClick(country)}
            isClicked={clickedFlag === country.code}
            isCorrect={clickedFlag === country.code && country.code === questionCountry.code}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {flagOptions.slice(2, 4).map((country) => (
          <FlagOption
            key={country.code}
            country={country}
            onClick={() => onFlagClick(country)}
            isClicked={clickedFlag === country.code}
            isCorrect={clickedFlag === country.code && country.code === questionCountry.code}
          />
        ))}
      </div>
    </div>
  );
};

export default FlagOptionsGrid; 