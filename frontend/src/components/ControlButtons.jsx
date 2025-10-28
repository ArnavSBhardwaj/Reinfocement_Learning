import React from 'react';
import './ControlButtons.css';

const ControlButtons = ({
  onStartTraining,
  onReset,
  onPlayPolicy,
  isTraining,
  isPlayback,
  canPlayPolicy
}) => {
  return (
    <div className="control-buttons">
      <button
        className="btn btn-primary"
        onClick={onStartTraining}
        disabled={isTraining || isPlayback}
      >
        {isTraining ? 'Training...' : 'Start Training'}
      </button>

      <button
        className="btn btn-secondary"
        onClick={onPlayPolicy}
        disabled={isTraining || isPlayback || !canPlayPolicy}
      >
        {isPlayback ? 'Playing...' : 'Play Policy'}
      </button>

      <button
        className="btn btn-danger"
        onClick={onReset}
        disabled={isTraining || isPlayback}
      >
        Reset
      </button>
    </div>
  );
};

export default ControlButtons;
