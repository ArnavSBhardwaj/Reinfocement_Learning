import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './RewardChart.css';

const RewardChart = ({ rewards }) => {
  // Prepare data for chart
  const chartData = rewards.map((reward, index) => ({
    episode: index + 1,
    reward: reward
  }));

  // Calculate statistics
  const avgReward = rewards.length > 0
    ? (rewards.reduce((sum, r) => sum + r, 0) / rewards.length).toFixed(3)
    : 0;
  const maxReward = rewards.length > 0
    ? Math.max(...rewards).toFixed(3)
    : 0;

  return (
    <div className="reward-chart">
      <h2>Episode Rewards</h2>

      {rewards.length > 0 ? (
        <>
          <div className="stats">
            <div className="stat">
              <span className="label">Episodes:</span>
              <span className="value">{rewards.length}</span>
            </div>
            <div className="stat">
              <span className="label">Average:</span>
              <span className="value">{avgReward}</span>
            </div>
            <div className="stat">
              <span className="label">Max:</span>
              <span className="value">{maxReward}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="episode"
                label={{ value: 'Episode', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: 'Reward', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="reward"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                name="Reward"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="placeholder">
          <p>No reward data yet</p>
          <p className="hint">Rewards will appear as training progresses</p>
        </div>
      )}
    </div>
  );
};

export default RewardChart;
