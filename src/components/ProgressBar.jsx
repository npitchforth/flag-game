import React from 'react';

const ProgressBar = ({ timeLeft, totalTime }) => {
  const progressRef = React.useRef(null);

  React.useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.backgroundColor =
        timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#f59e42' : '#2563eb';
    }
  }, [timeLeft]);

  return (
    <div className="progress-container">
      <div 
        className="progress-bar" 
        ref={progressRef} 
        style={{ width: `${(timeLeft / totalTime) * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar; 