# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RL Playground is an educational web interface for exploring reinforcement learning algorithms interactively. Users control learning parameters and watch agents train in real-time.

**Phase 1 Scope**: Q-Learning (tabular) on FrozenLake-v1 only. Future phases will add stable-baselines3 algorithms (DQN, PPO, SAC) and more Gym environments.

## Development Commands

### Backend (Python/Flask)
```bash
cd backend
uv sync                    # Install dependencies and create virtual environment
uv run python app.py       # Run Flask server (uv automatically uses venv)
```

**Important**: Use `uv sync` to install dependencies from `pyproject.toml`. Use `uv run` to execute commands in the virtual environment.

### Frontend (React)
```bash
cd frontend
npm install
npm start                  # Run development server on localhost:3000
```

## Critical Architecture Decisions

### 1. Rendering Strategy (MOST IMPORTANT!)

**During Training**:
- Render ONLY the final frame of each episode
- Call `env.render()` AFTER the episode loop completes
- Send immediately via SSE (no batching)
- Result: ~10 updates/second for 1000 episodes

**During Policy Playback**:
- Render EVERY step of execution
- Call `env.render()` AFTER every step
- Collect all frames (typically 10-20)
- Send complete array in one SSE event
- Frontend animates with 200ms delay per frame

**Why**: Training generates thousands of frames (1000 episodes × 20 steps = 20K frames). Only showing final frames keeps bandwidth manageable while policy playback needs every step visible.

### 2. Modular, Extensible Design

The architecture is designed for future compatibility with stable-baselines3:

- **Base Algorithm Interface**: Abstract class with `train()`, `play_policy()`, `get_learning_data()`, `get_parameter_schema()`
- **Algorithm Factory**: Creates algorithm instances by name
- **Environment Manager**: Handles ANY Gym/Gymnasium environment
- **Training Coordinator**: Algorithm-agnostic session management with UUIDs
- **API Endpoints**: Generic, work with any algorithm

**Do NOT hardcode "Q-Learning" everywhere!** Use the factory pattern. Think: "How would DQN from stable-baselines3 fit here?"

### 3. Communication Pattern

- **REST API**: Control operations (start training, reset)
- **Server-Sent Events (SSE)**: Real-time streaming updates
  - Training endpoint: `/api/train/stream/<session_id>`
  - Playback endpoint: `/api/play-policy/stream/<session_id>`
- **CORS**: Enabled for localhost:3000

## Project Structure

```
backend/
├── app.py                      # Flask API (7 endpoints)
├── algorithms/
│   ├── __init__.py             # AlgorithmFactory
│   ├── base_algorithm.py       # Abstract base class
│   └── q_learning.py           # Q-Learning implementation
├── environments/
│   └── environment_manager.py  # Gym env creation, frame→base64 conversion
├── training/
│   └── trainer.py              # Session management, UUID-based
└── pyproject.toml              # uv project config

frontend/
├── src/
│   ├── components/
│   │   ├── ParameterPanel.jsx          # Dynamic controls from schema
│   │   ├── EnvironmentViewer.jsx       # Display base64 frames
│   │   ├── RewardChart.jsx             # Recharts line chart
│   │   ├── LearningVisualization.jsx   # Q-table heatmap (4×4 grid)
│   │   └── ControlButtons.jsx          # Start/Reset/Play Policy
│   ├── App.jsx                          # State orchestration
│   └── api.js                           # Backend communication + SSE
└── package.json
```

## Backend Implementation Details

### Q-Learning Specifics
- Initialize Q-table as zeros: `np.zeros((num_states, num_actions))`
- Epsilon-greedy exploration
- Standard Q-learning update rule: `Q[s,a] = Q[s,a] + α * (r + γ * max(Q[s']) - Q[s,a])`
- Parameters: learning_rate (α), discount_factor (γ), exploration_rate (ε), num_episodes

### Environment Manager
- Create envs with `render_mode="rgb_array"`
- Convert frames to base64 PNG strings for transmission
- Phase 1: Only FrozenLake-v1 supported
- Validate environment names

### Flask API Endpoints (7 total)
1. `GET /api/algorithms` - List available algorithms
2. `GET /api/environments` - List available environments
3. `GET /api/parameters/<algorithm>` - Get parameter schema
4. `POST /api/train` - Start training, return session_id
5. `GET /api/train/stream/<session_id>` - SSE training updates
6. `GET /api/play-policy/stream/<session_id>` - SSE policy playback
7. `POST /api/reset` - Clear all sessions

### SSE Event Formats

**Training event** (sent after each episode):
```json
{
  "episode": 150,
  "reward": 0.5,
  "learning_data": {"q_table": [[...]]},
  "frame": "base64_string",
  "status": "training"
}
```

**Playback event** (sent once with all frames):
```json
{
  "frames": ["base64_1", "base64_2", ...],
  "num_frames": 15,
  "status": "complete"
}
```

## Frontend Implementation Details

### State Management (App.jsx)
- `selectedAlgorithm`, `selectedEnvironment`
- `parameters` (from schema)
- `trainingData` (frame, episode, rewards, learningData, status flags)
- `sessionId`, `eventSource`, `error`

### Training Flow
1. User adjusts parameters in ParameterPanel
2. User clicks Start Training
3. Call `startTraining()` API → get session_id
4. Subscribe to SSE stream via EventSource
5. Update state on each event
6. On complete, enable Play Policy button
7. On Play Policy click, subscribe to playback stream
8. Animate through frames with setInterval (200ms delay)

### Q-Table Visualization
- Display as 4×4 grid (FrozenLake has 16 states)
- Each cell shows 4 action values in cross pattern (↑ ↓ ← →)
- Color-code by Q-value magnitude (blue=low, yellow=high)
- Show min/max/avg statistics

### EventSource Cleanup
Always close EventSource connections to prevent memory leaks:
```javascript
if (eventSource) {
  eventSource.close();
}
```

## Common Pitfalls to Avoid

1. Rendering every step during training (ONLY render final frame per episode!)
2. Hardcoding "Q-Learning" instead of using factory pattern
3. Forgetting CORS configuration for localhost:3000
4. Not closing EventSource connections (memory leaks)
5. Blocking UI thread (use SSE for non-blocking updates)
6. Missing error handling in async operations

## Implementation Order

1. **Backend first**: Create structure, implement base classes, Q-Learning, Flask API
2. **Test backend**: Use curl/Postman to verify all endpoints and SSE streams work
3. **Frontend**: Build React app with components and state management
4. **Integration**: Connect frontend to backend, test full flow

## Phase 1 Success Criteria

- User adjusts Q-Learning parameters
- Training starts and streams updates in real-time
- Environment frame, reward chart, and Q-table update during training
- Training completes without errors
- Play Policy shows smooth frame-by-frame animation
- Reset clears all state
- No console errors
- Clean, modular code ready for Phase 2 extensions

## Future Extensions (Post-Phase 1)

The modular design enables easy additions:
- Phase 2: Add SARSA algorithm
- Phase 3: Add CartPole environment
- Phase 4: Add DQN with neural networks (stable-baselines3)
- Phase 5: Add PPO, policy gradients

When adding new algorithms, create wrappers that implement the base algorithm interface. For stable-baselines3 models, the wrapper should translate between sb3's API and our base class methods.
