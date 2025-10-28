import React from 'react';
import './EnvironmentViewer.css';

const EnvironmentViewer = ({ frame, episode, isTraining, isPlayback }) => {
  const getStatusText = () => {
    if (isPlayback) return 'Playing Policy';
    if (isTraining) return `Training - Episode ${episode}`;
    return 'Ready';
  };

  const getStatusClass = () => {
    if (isPlayback) return 'playback';
    if (isTraining) return 'training';
    return 'ready';
  };

  return (
    <div className="environment-viewer">
      <h2>Environment</h2>
      <div className={`status-indicator ${getStatusClass()}`}>
        {getStatusText()}
      </div>

      <div className="frame-container">
        {frame ? (
          <img
            src={`data:image/png;base64,${frame}`}
            alt="Environment state"
            className="environment-frame"
          />
        ) : (
          <div className="placeholder">
            <p>No frame to display</p>
            <p className="hint">Start training to see the environment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentViewer;
