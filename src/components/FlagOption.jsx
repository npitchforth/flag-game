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
        src={getFlagImage(country)}
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

// Helper function to get flag image URL
const getFlagImage = (country) => {
  return `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
};

export default FlagOption; 