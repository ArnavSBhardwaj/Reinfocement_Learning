# RL Playground - Implementation Guide

## Project Overview

Build an educational web interface for exploring reinforcement learning algorithms interactively. Users should be able to control learning parameters of a Q-learning agent, and see its training on a frozenlake environment. 

**Repository**: `rl-playground`  
**Target Users**: Students, educators, RL learners  
**Deployment**: Local (users clone and run on localhost)

---

## Phase 1 Scope

**Implement ONLY**:
- Algorithm: Q-Learning (tabular)
- Environment: FrozenLake-v1

**Future phases**: Add stable-baselines3 algorithms (DQN, PPO, SAC) and more Gym environments

---

## Tech Stack

### Backend
- Python with Flask
- Virtual environment managed by **uv** (not pip/venv)
- Gymnasium for environments
- Server-Sent Events (SSE) for real-time streaming
- Design compatible with stable-baselines3 (for future)

### Frontend
- React
- Recharts for visualization
- Axios for API calls
- SSE via EventSource API

### Communication
- REST API for control
- SSE for real-time training updates

---

## Critical Design Decision: Rendering Strategy

### During Training
- Render **ONLY final frame** of each episode
- Send immediately via SSE (no batching)
- Result: ~10 updates/second, manageable bandwidth
- **Why**: 1000 episodes × 20 steps = 20K frames (too much!)

### During Policy Playback  
- Render **EVERY step** of execution
- Collect all frames (typically 10-20)
- Send complete array in one SSE event
- Frontend animates with 200ms delay per frame
- **Why**: Few frames total, user needs to see exact behavior

**This is the most important architectural decision!**

---

## Project Structure

```
rl-playground/
├── backend/
│   ├── app.py                      # Flask API
│   ├── algorithms/
│   │   ├── __init__.py             # AlgorithmFactory
│   │   ├── base_algorithm.py      # Abstract base class
│   │   └── q_learning.py          # Q-Learning impl
│   ├── environments/
│   │   ├── __init__.py
│   │   └── environment_manager.py
│   ├── training/
│   │   ├── __init__.py
│   │   └── trainer.py
│   ├── pyproject.toml              # uv project config
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParameterPanel.jsx
│   │   │   ├── EnvironmentViewer.jsx
│   │   │   ├── RewardChart.jsx
│   │   │   ├── LearningVisualization.jsx
│   │   │   └── ControlButtons.jsx
│   │   ├── App.jsx
│   │   └── api.js
│   └── package.json
└── README.md
```

---

## Backend Requirements

### Python Environment Setup
- Use **uv** for virtual environment and dependency management
- Create `pyproject.toml` with dependencies
- Dependencies: Flask, Flask-CORS, gymnasium, numpy, Pillow

### Architecture Pattern: Modular & Extensible

**Design for future compatibility with stable-baselines3**:
- Abstract base class works with ANY algorithm (custom or sb3)
- Environment manager handles ANY Gym/Gymnasium environment
- API endpoints are algorithm-agnostic
- Parameter schema system flexible for neural network hyperparameters

### 1. Base Algorithm Interface

Abstract class defining:
- `train(num_episodes, callback)` - train and call callback after each episode
- `play_policy(callback)` - execute policy, return all frames
- `get_learning_data()` - return viz data (Q-table, loss curves, etc.)
- `get_parameter_schema()` - return parameter specs as dict

### 2. Q-Learning Implementation

Tabular Q-Learning for discrete spaces:
- Q-table: numpy array (num_states × num_actions)
- Epsilon-greedy exploration
- Standard Q-learning update rule
- initialize Q-table as zeros (num_states × num_actions)
- **Only render after episode completes** (critical!)
**Parameters**:
- learning_rate (α): 0.01-1.0, default 0.1
- discount_factor (γ): 0.0-1.0, default 0.95
- exploration_rate (ε): 0.0-1.0, default 0.1
- num_episodes: 1-10000, default 1000

### 3. Environment Manager

- Create Gymnasium environments with `render_mode="rgb_array"`
- Convert frames to base64 PNG strings
- Validate environment names
- Phase 1: Only support FrozenLake-v1
- Future: Support any Gym environment

**Key Functions**:
- `create_environment(env_name, seed)` - Create env with render_mode="rgb_array"
- `get_available_environments()` - Return list of supported envs (Phase 1: only FrozenLake-v1)
- `frame_to_base64(frame)` - Convert numpy array to base64 PNG string
- Validate environment names

### 4. Algorithm Factory

- Create algorithm instances by name
- Return available algorithms list
- Get parameter schema for each algorithm
- Phase 1: Only Q-Learning
- Future: Wrapper for stable-baselines3 models

**Key Functions**:
- `create_algorithm(name, env, params)` - Instantiate algorithm
- `get_available_algorithms()` - Return list (Phase 1: ["Q-Learning"])
- `get_parameter_schema(name)` - Get parameter specs

### 5. Training Coordinator

- Manage training sessions (UUID-based)
- Algorithm-agnostic design
- Session storage in memory
- Methods: create_session, train, play_policy, reset

**Key Functions**:
- `create_session(algo, env, params, seed)` - Return session_id
- `train(session_id, num_episodes, callback)` - Run training
- `play_policy(session_id, callback)` - Execute policy
- `reset_all_sessions()` - Clear memory

### 6. Flask API Endpoints

1. `GET /api/algorithms` - list available algorithms
2. `GET /api/environments` - list available environments  
3. `GET /api/parameters/<algorithm>` - get parameter schema
4. `POST /api/train` - start training, return session_id
5. `GET /api/train/stream/<session_id>` - SSE training updates
6. `GET /api/play-policy/stream/<session_id>` - SSE policy playback
7. `POST /api/reset` - clear all sessions

**Key Points**:
- Enable CORS for localhost:3000
- Use `stream_with_context()` for SSE
- Validate all inputs (algorithm, environment, parameter ranges)
- SSE format: `data: {json}\n\n`
- Include proper headers for SSE (Cache-Control, X-Accel-Buffering)

**SSE Event Formats**:

Training event:
```json
{
  "episode": 150,
  "reward": 0.5,
  "learning_data": {"q_table": [[...]]},
  "frame": "base64_string",
  "status": "training"
}
```

Playback event:
```json
{
  "frames": ["base64_1", "base64_2", ...],
  "num_frames": 15,
  "status": "complete"
}
```

**Requirements**:
- Enable CORS for localhost:3000
- Use `stream_with_context()` for SSE
- Validate all inputs
- Handle errors gracefully
- Proper SSE headers

---

## Frontend Requirements

### 1. API Communication Layer (`api.js`)

Functions for all backend endpoints:
- Get algorithms/environments/parameters
- Start training
- Subscribe to SSE streams (training & playback)
- Reset training
- Proper error handling and EventSource cleanup

**Purpose**: Communicate with backend

**Functions**:
- `getAlgorithms()` - Fetch available algorithms
- `getEnvironments()` - Fetch available environments
- `getParameterSchema(algorithm)` - Fetch parameter schema
- `startTraining(config)` - POST to /api/train
- `subscribeToTraining(sessionId, onUpdate, onComplete, onError)` - SSE connection
- `subscribeToPlayback(sessionId, onFrames, onError)` - SSE for playback
- `resetTraining()` - POST to /api/reset

**Key Points**:
- Handle SSE with EventSource API
- Parse JSON events
- Proper error handling and cleanup
- Close EventSource when done

### 2. Parameter Panel
**Purpose**: Dynamic parameter controls based on schema

**Features**:
- Fetch parameter schema on mount
- Generate sliders/inputs dynamically from schema
- Display algorithm selector (disabled in Phase 1)
- Display environment selector (disabled in Phase 1)
- Show parameter labels, current values, descriptions
- Validate and update parent state

### 3. Environment Viewer
**Purpose**: Display Gymnasium environment frames

**Features**:
- Display base64 image: `<img src="data:image/png;base64,{frame}" />`
- Show current episode number overlay
- Show training status indicator
- Placeholder when no frame available
- Responsive sizing

### 4. Reward Chart
**Purpose**: Line chart of episode rewards

**Features**:
- Use Recharts LineChart
- X-axis: episode number
- Y-axis: reward value
- Update in real-time as data arrives
- Show statistics (avg, max, count)
- Placeholder when empty

### 5. Learning Visualization
**Purpose**: Algorithm-specific visualization (Q-table heatmap for Q-Learning)

**Features**:
- Detect algorithm type and render appropriate viz
- **For Q-Learning**: Display Q-table as 4×4 grid of cells
- Each cell shows 4 action values in cross pattern (↑ ↓ ← →)
- Color-code by Q-value magnitude (blue=low, yellow=high)
- Show min/max/avg statistics
- Placeholder when no data
### 6. Control Buttons
**Purpose**: Start, Reset, Play Policy buttons

**Features**:
- Start Training: trigger training, disabled during training
- Reset: clear all state, disabled during training
- Play Policy: show playback, disabled until training complete
- Display button states clearly

### 7. Main App
**Purpose**: Orchestrate all components, manage global state

**State**:
- selectedAlgorithm, selectedEnvironment
- parameters (from schema)
- trainingData (frame, episode, rewards, learningData, status flags)
- sessionId, eventSource, error

**Flow**:
1. User adjusts parameters
2. User clicks Start Training
3. Call startTraining API → get session_id
4. Subscribe to SSE stream
5. Update state on each event
6. On complete, enable Play Policy
7. On Play Policy click, subscribe to playback stream
8. Animate through frames with setInterval

**Error Handling**:
- Display error banner
- Catch all async errors
- Clean up EventSource on errors
- User-friendly error messages

### 8. Styling
**Requirements**:
- Clean, modern UI
- Three-column layout: Parameters | Environment | Visualizations
- Responsive (stack on small screens)
- Clear visual hierarchy
- Smooth transitions

---

## Setup Instructions

### Backend Setup
```bash
cd backend
uv venv
uv pip install flask flask-cors gymnasium numpy pillow
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

---

## Implementation Checklist

### Backend:
- [ ] Create base algorithm class with abstract methods
- [ ] Implement Q-Learning with proper rendering (final frame only during training)
- [ ] Create environment manager with FrozenLake-v1
- [ ] Create algorithm factory
- [ ] Create training coordinator with session management
- [ ] Implement all 7 Flask API endpoints
- [ ] Set up CORS properly
- [ ] Test SSE streaming

### Frontend:
- [ ] Set up React app
- [ ] Create API layer with SSE support
- [ ] Build ParameterPanel with dynamic schema
- [ ] Build EnvironmentViewer with image display
- [ ] Build RewardChart with Recharts
- [ ] Build LearningVisualization with Q-table heatmap
- [ ] Build ControlButtons
- [ ] Build App with state management and event handling
- [ ] Add CSS styling
- [ ] Test full flow

### Integration:
- [ ] Backend and frontend communicate correctly
- [ ] Training starts and streams updates
- [ ] Visualizations update in real-time
- [ ] Training completes successfully
- [ ] Policy playback animates smoothly
- [ ] Reset clears everything
- [ ] No console errors

---

## Success Criteria

Phase 1 complete when:
1. ✅ User adjusts Q-Learning parameters
2. ✅ Training starts and streams updates
3. ✅ Environment frame updates in real-time
4. ✅ Reward chart updates during training
5. ✅ Q-table heatmap updates during training
6. ✅ Training completes without errors
7. ✅ Play Policy shows smooth animation
8. ✅ Reset clears all state
9. ✅ No console errors
10. ✅ Clean, modular code

---

## Common Pitfalls

1. ❌ Rendering every step during training → Only render final frame per episode!
2. ❌ Hardcoding "Q-Learning" everywhere → Use factory pattern!
3. ❌ Forgetting CORS → Configure Flask-CORS for localhost:3000!
4. ❌ Not closing EventSource → Memory leaks!
5. ❌ Blocking UI → Use SSE for non-blocking updates!
6. ❌ Not handling errors → Add try-catch everywhere!

---

## Critical Implementation Notes

### Rendering (Most Important!)
- Training: `env.render()` only AFTER episode loop
- Playback: `env.render()` AFTER every step
- This is not negotiable!

### Modularity (For Future)
- Use abstract base class and factory pattern
- Don't hardcode "Q-Learning" everywhere
- Design API to work with any algorithm
- Think: "How would stable-baselines3 DQN fit here?"

### Error Handling
- Validate all inputs
- Handle network failures
- Clean up resources (EventSource)
- User-friendly error messages

### Python Environment
- Use **uv**, not pip or venv
- Create proper pyproject.toml
- Document uv commands in README

---

## Future Extensions (NOT Phase 1)

Once Phase 1 works perfectly:
- **Phase 2**: Add SARSA algorithm
- **Phase 3**: Add CartPole environment
- **Phase 4**: Add DQN with neural networks
- **Phase 5**: Add PPO, policy gradients

The modular design (base classes, factories) makes these additions easy!

---

## Notes for Implementation

- Use meaningful variable names
- Add docstrings to classes/methods
- Handle edge cases (empty Q-table, network failures, etc.)
- Test with different parameter values
- Ensure deterministic behavior when seed is provided
- FrozenLake is slippery (stochastic transitions) - agent might not always succeed

**Start with backend, test thoroughly with curl/Postman, then build frontend!**

Good luck! 🚀