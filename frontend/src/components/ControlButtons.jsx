import React from 'react';
import './ControlButtons.css';

const ControlButtons = ({
  onStartTraining,
  onStopTraining,
  onPlayPolicy,
  isTraining,
  isPlayback,
  canPlayPolicy,
  disabled = false
}) => {
  return (
    <div className="control-buttons">
      <button
        className="btn btn-primary"
        onClick={isTraining ? onStopTraining : onStartTraining}
        disabled={isPlayback || disabled}
      >
        {isTraining ? 'Stop Training' : 'Start Training'}
      </button>

      {/* Validation Error Message */}
      {disabled && !isTraining && (
        <p className="validation-error">
          ⚠️ Fix parameter errors before training
        </p>
      )}

      <button
        className="btn btn-secondary"
        onClick={onPlayPolicy}
        disabled={isTraining || isPlayback || !canPlayPolicy}
      >
        {isPlayback ? 'Playing...' : 'Play Policy'}
      </button>
    </div>
  );
};

export default ControlButtons;
