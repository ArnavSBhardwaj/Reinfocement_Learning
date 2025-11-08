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

### Option 1: Docker Setup (Strongly Recommended)

**Docker is the recommended way to run this project.** It provides a consistent environment across all platforms and avoids system-specific issues (especially pygame compatibility problems on macOS). All development should be done using Docker to ensure everything works correctly.

#### Prerequisites

- **Docker Desktop** ([Download here](https://www.docker.com/products/docker-desktop/))
  - macOS: Install Docker Desktop for Mac
  - Windows: Install Docker Desktop for Windows
  - Linux: Install Docker Engine or Docker Desktop

#### Quick Start

1. **Start the application** (first time will download images and install dependencies):
```bash
docker-compose up
```

That's it! Docker will:
- Build both backend and frontend containers
- Install all Python and Node.js dependencies
- Start both services with live code reloading

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

3. **Stop the application**:
```bash
# Press Ctrl+C in the terminal where docker-compose is running
# OR run this in another terminal:
docker-compose down
```

**New to Docker?** Check out the [Docker Development Workflow Guide](tutorials/docker-workflow.md) for a complete beginner-friendly walkthrough.

#### Quick Reference: Essential Docker Commands

```bash
# Start in background (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f          # All services
docker-compose logs backend     # Backend only
docker-compose logs frontend    # Frontend only

# Stop containers
docker-compose down

# Rebuild after dependency changes (package.json, pyproject.toml)
docker-compose up --build

# Remove all containers and volumes (fresh start)
docker-compose down -v
```

#### Troubleshooting Docker Setup

**Containers not starting**: Check Docker Desktop is running
```bash
docker --version  # Should show Docker version
```

**Port already in use**: Make sure ports 3000 and 5001 are not used by other applications
```bash
# macOS/Linux
lsof -i :3000
lsof -i :5001

# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 3000
Get-NetTCPConnection -LocalPort 5001
```

**Changes not reflecting**: Restart containers
```bash
docker-compose restart
```

**"Permission denied" errors on Linux**: Add your user to docker group
```bash
sudo usermod -aG docker $USER
# Then log out and log back in
```

---

### Option 2: Local Setup (Not Recommended)

**Warning:** Local setup is not recommended and may encounter system-specific compatibility issues, particularly with pygame on macOS. Use Docker instead for a guaranteed working environment.

If you still prefer to run services directly on your machine:

#### Prerequisites

- Python 3.9+
- Node.js 14+
- `uv` (Python package manager)

To install `uv`:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Backend Setup

```bash
cd backend

# Install dependencies and create virtual environment
uv sync

# Run backend server
uv run python app.py
```

Backend runs on `http://localhost:5001`

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

### With Docker (Recommended)

1. **Start Application**: Run `docker-compose up` in the project root
2. **Open Browser**: Navigate to `http://localhost:3000`

### Without Docker

1. **Start Backend**: Run `uv run python app.py` in the backend directory
2. **Start Frontend**: Run `npm start` in the frontend directory
3. **Open Browser**: Navigate to `http://localhost:3000`

### Using the Application

1. **Adjust Parameters**: Use sliders to set learning rate, discount factor, exploration rate, and number of episodes
2. **Start Training**: Click "Start Training" and watch the agent learn in real-time
3. **View Visualizations**:
   - Environment frame updates after each episode
   - Reward chart shows training progress
   - Q-table heatmap displays learned values
4. **Play Policy**: After training completes, click "Play Policy" to watch the trained agent
5. **Reset**: Click "Reset" to clear all data and start fresh

## Project Structure

```
rl-playground/
├── backend/
│   ├── algorithms/
│   │   ├── base_algorithm.py         # Abstract base class for all algorithms
│   │   ├── q_learning.py             # Q-Learning implementation
│   │   ├── __init__.py               # AlgorithmFactory
│   ├── environments/
│   │   ├── environment_manager.py    # Gym environment handling
│   │   └── __init__.py
│   ├── training/
│   │   ├── trainer.py                # Session management with UUID tracking
│   │   └── __init__.py
│   ├── app.py                        # Flask API with 7 REST + 2 SSE endpoints
│   ├── Dockerfile                    # Backend container image
│   ├── .dockerignore                 # Backend Docker ignore rules
│   ├── pyproject.toml                # Python dependencies (uv)
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParameterPanel.jsx    # Dynamic parameter controls
│   │   │   ├── ParameterPanel.css
│   │   │   ├── EnvironmentViewer.jsx # Environment frame display
│   │   │   ├── EnvironmentViewer.css
│   │   │   ├── RewardChart.jsx       # Episode reward tracking
│   │   │   ├── RewardChart.css
│   │   │   ├── LearningVisualization.jsx  # Q-table heatmap
│   │   │   ├── LearningVisualization.css
│   │   │   ├── ControlButtons.jsx    # Start/Reset/Play Policy
│   │   │   └── ControlButtons.css
│   │   ├── App.js                    # Main app with state management
│   │   ├── api.js                    # Backend communication + SSE
│   │   ├── index.js
│   │   └── setupTests.js
│   ├── public/
│   │   └── manifest.json
│   ├── Dockerfile                    # Frontend container image
│   ├── .dockerignore                 # Frontend Docker ignore rules
│   ├── package.json                  # Node.js dependencies
│   ├── package-lock.json
│   └── README.md
├── tutorials/
│   └── docker-workflow.md            # Beginner's guide to Docker development
├── docker-compose.yml                # Multi-container orchestration
├── CHANGELOG.md                      # Version history
├── CLAUDE.md                         # Project instructions for Claude Code
├── WORKPLAN.md                       # Development roadmap
├── rl_instructions.md                # Additional RL instructions
└── README.md                         # This file
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

### General Issues

**CORS errors**: Make sure backend is running on port 5001 and frontend on port 3000

**"Module not found" errors** (local setup): Ensure you've installed all dependencies with `uv sync` (backend) and `npm install` (frontend)

**Training not starting**: Check browser console for errors; ensure backend is running

**No frames showing**: Verify backend is sending SSE events (check Network tab in browser DevTools)

### Docker-Specific Issues

See the [Troubleshooting Docker Setup](#troubleshooting-docker-setup) section above for Docker-related issues.

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
