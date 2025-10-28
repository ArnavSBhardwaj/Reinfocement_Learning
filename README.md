# RL Playground

An interactive web interface for exploring reinforcement learning algorithms. Watch Q-Learning agents train in real-time on FrozenLake-v1!

## Project Overview

**Phase 1** features:
- Algorithm: Q-Learning (tabular)
- Environment: FrozenLake-v1 (4x4 grid)
- Real-time training visualization
- Interactive parameter controls
- Q-table heatmap visualization
- Episode reward tracking
- Policy playback

**Future phases** will add more algorithms (DQN, PPO, SAC) and environments (CartPole, LunarLander, etc.)

## Architecture

- **Backend**: Python Flask with Server-Sent Events (SSE) for real-time streaming
- **Frontend**: React with Recharts for visualization
- **Communication**: REST API + SSE for live updates

### Key Design Decision: Rendering Strategy

**During Training**:
- Renders ONLY the final frame of each episode
- Keeps bandwidth manageable (~10 updates/second)

**During Policy Playback**:
- Renders EVERY step
- Shows exact agent behavior with 200ms frame animation

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 14+
- `uv` (Python package manager)

To install `uv`:
```bash
pip install uv
```

### Backend Setup

```bash
cd backend

# Install dependencies and create virtual environment
uv sync

# Run backend server
uv run python app.py
```

Backend runs on `http://localhost:5000`

Alternatively, you can activate the virtual environment first:
```bash
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate  # Windows
python app.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

## Usage

1. **Start Backend**: Run `python app.py` in the backend directory
2. **Start Frontend**: Run `npm start` in the frontend directory
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Adjust Parameters**: Use sliders to set learning rate, discount factor, exploration rate, and number of episodes
5. **Start Training**: Click "Start Training" and watch the agent learn in real-time
6. **View Visualizations**:
   - Environment frame updates after each episode
   - Reward chart shows training progress
   - Q-table heatmap displays learned values
7. **Play Policy**: After training completes, click "Play Policy" to watch the trained agent
8. **Reset**: Click "Reset" to clear all data and start fresh

## Project Structure

```
rl-playground/
├── backend/
│   ├── algorithms/
│   │   ├── base_algorithm.py       # Abstract base class
│   │   ├── q_learning.py           # Q-Learning implementation
│   │   └── __init__.py             # AlgorithmFactory
│   ├── environments/
│   │   └── environment_manager.py  # Gym env handling
│   ├── training/
│   │   └── trainer.py              # Session management
│   ├── app.py                      # Flask API (7 endpoints)
│   └── pyproject.toml              # Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParameterPanel.jsx
│   │   │   ├── EnvironmentViewer.jsx
│   │   │   ├── RewardChart.jsx
│   │   │   ├── LearningVisualization.jsx
│   │   │   └── ControlButtons.jsx
│   │   ├── App.js                  # Main app with state management
│   │   └── api.js                  # Backend communication + SSE
│   └── package.json
└── README.md
```

## API Endpoints

1. `GET /api/algorithms` - List available algorithms
2. `GET /api/environments` - List available environments
3. `GET /api/parameters/<algorithm>` - Get parameter schema
4. `POST /api/train` - Start training session
5. `GET /api/train/stream/<session_id>` - SSE training updates
6. `GET /api/play-policy/stream/<session_id>` - SSE policy playback
7. `POST /api/reset` - Clear all sessions

## Q-Learning Parameters

- **Learning Rate (α)**: 0.01-1.0, controls how much new information overrides old (default: 0.1)
- **Discount Factor (γ)**: 0.0-1.0, importance of future rewards (default: 0.95)
- **Exploration Rate (ε)**: 0.0-1.0, probability of random action (default: 0.1)
- **Number of Episodes**: 1-10000, training duration (default: 1000)

## Understanding FrozenLake

FrozenLake is a 4×4 grid world where:
- **S**: Starting position
- **F**: Frozen (safe to walk)
- **H**: Hole (episode ends, no reward)
- **G**: Goal (episode ends, +1 reward)

The ice is slippery, so actions are stochastic (agent might slip in perpendicular directions).

## Troubleshooting

**CORS errors**: Make sure backend is running on port 5000 and frontend on port 3000

**"Module not found" errors**: Ensure you've installed all dependencies with `uv pip install` (backend) and `npm install` (frontend)

**Training not starting**: Check browser console for errors; ensure backend is running

**No frames showing**: Verify backend is sending SSE events (check Network tab in browser DevTools)

## Future Enhancements

- Phase 2: Add SARSA algorithm
- Phase 3: Add CartPole environment
- Phase 4: Add DQN with neural networks
- Phase 5: Add PPO and policy gradient methods
- Support for custom environments
- Training session save/load
- Hyperparameter optimization

## License

MIT License - Feel free to use for educational purposes!
