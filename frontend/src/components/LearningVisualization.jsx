import React from 'react';
import './LearningVisualization.css';

const LearningVisualization = ({ learningData, algorithm }) => {
  if (algorithm !== 'Q-Learning' || !learningData || !learningData.q_table) {
    return (
      <div className="learning-visualization">
        <h2>Learning Data</h2>
        <div className="placeholder">
          <p>No learning data available</p>
        </div>
      </div>
    );
  }

  const qTable = learningData.q_table;

  // For FrozenLake 4x4: 16 states, 4 actions (UP=0, DOWN=1, LEFT=2, RIGHT=3)
  const numStates = qTable.length;
  const gridSize = Math.sqrt(numStates);

  // Calculate statistics
  const allValues = qTable.flat();
  const minQ = Math.min(...allValues);
  const maxQ = Math.max(...allValues);
  const avgQ = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;

  // Color mapping function (normalize to 0-1 range)
  const getColor = (value) => {
    if (maxQ === minQ) return '#cccccc';
    const normalized = (value - minQ) / (maxQ - minQ);

    // Blue (low) to Yellow (high)
    const r = Math.round(normalized * 255);
    const g = Math.round(normalized * 255);
    const b = Math.round((1 - normalized) * 255);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Render Q-table as 4x4 grid with action values in cross pattern
  const renderQTable = () => {
    const cells = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const state = row * gridSize + col;
        const qValues = qTable[state];

        // qValues: [UP, DOWN, LEFT, RIGHT]
        const up = qValues[0];
        const down = qValues[1];
        const left = qValues[2];
        const right = qValues[3];

        // Get max Q-value for background color
        const maxValue = Math.max(...qValues);
        const bgColor = getColor(maxValue);

        cells.push(
          <div
            key={state}
            className="q-cell"
            style={{ backgroundColor: bgColor }}
          >
            <div className="state-number">{state}</div>
            <div className="q-values-cross">
              <div className="q-up">{up.toFixed(2)}</div>
              <div className="q-left">{left.toFixed(2)}</div>
              <div className="q-right">{right.toFixed(2)}</div>
              <div className="q-down">{down.toFixed(2)}</div>
            </div>
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="learning-visualization">
      <h2>Q-Table Heatmap</h2>

      <div className="stats">
        <div className="stat">
          <span className="label">Min Q:</span>
          <span className="value">{minQ.toFixed(3)}</span>
        </div>
        <div className="stat">
          <span className="label">Max Q:</span>
          <span className="value">{maxQ.toFixed(3)}</span>
        </div>
        <div className="stat">
          <span className="label">Avg Q:</span>
          <span className="value">{avgQ.toFixed(3)}</span>
        </div>
      </div>

      <div className="q-table-grid">
        {renderQTable()}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: getColor(minQ) }}></div>
          <span>Low Q-value</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: getColor(maxQ) }}></div>
          <span>High Q-value</span>
        </div>
      </div>

      <p className="hint">
        Each cell shows Q-values for actions: ↑ (up), ↓ (down), ← (left), → (right)
      </p>
    </div>
  );
};

export default LearningVisualization;
