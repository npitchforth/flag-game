import React from 'react';

const FlagOption = ({ country, onClick, isClicked, isCorrect }) => {
  const getBorderStyle = () => {
    if (!isClicked) return '2.5px solid transparent';
    return isCorrect ? '2.5px solid #22c55e' : '2.5px solid #ef4444';
  };

  return (
    <div className="flag-option" onClick={onClick}>
      <img
        className="flag-img"
        src={window.getFlagImage ? window.getFlagImage(country) : `https://flagcdn.com/w320/${country.code}.png`}
        alt={country.name}
        style={{
          width: '120px',
          height: '80px',
          objectFit: 'contain',
          borderRadius: '6px',
          border: getBorderStyle()
        }}
      />
    </div>
  );
};

export default FlagOption; 