# Changelog

All notable changes to RL Playground will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.2.0] - 2025-10-30

### Added
- **Docker support** for cross-platform development (macOS, Windows, Linux)
  - Backend Dockerfile with Python 3.10, Flask, Gymnasium, pygame
  - Frontend Dockerfile with Node.js 18 and React dev server
  - docker-compose.yml for multi-container orchestration
  - Volume mounting for live code editing during development
  - .dockerignore files for optimized builds
- **Comprehensive Docker development guide** (400+ lines) in README.md
  - Step-by-step first-time setup instructions
  - Daily development workflow guide
  - Troubleshooting flowcharts for common issues
  - Common beginner mistakes and fixes
  - Visual diagrams of Docker architecture
- **WORKPLAN.md** documenting future Q-table visualization features
  - Phase 2: Arrow-based policy visualization
  - Phase 3: Number-based heatmap with toggle
  - Detailed design specifications and implementation plans

### Changed
- Default environment changed from FrozenLake-v1 (slippery) to FrozenLake-v1-NoSlip (deterministic)
- Flask configured to use `host='0.0.0.0'` for Docker networking (allows external connections)

### Fixed
- **CRITICAL**: Fixed SSE streaming bug that prevented real-time training updates
  - Issue: Nested callback function's `yield` statements had no effect
  - Solution: Implemented queue-based threading pattern for proper data flow
  - Impact: Training updates now stream correctly to frontend (episode counter, reward chart, frames)
- Removed obsolete `version` attribute from docker-compose.yml

### Technical Details
- **Threading**: Training now runs in background thread with queue-based communication
- **SSE Keep-Alive**: Added periodic keep-alive comments to prevent connection timeouts
- **Docker Networking**: Backend accessible at localhost:5001, frontend at localhost:3000
- **Development Setup**: One command (`docker-compose up`) starts entire application

### Workshop Ready
- Participants can now run the application on any OS with just Docker Desktop installed
- No manual Python/Node.js/dependency installation required
- Live code reloading enabled for development
- Consistent environment across all platforms

## [0.1.0] - 2025-01-28

### Added
- Q-Learning algorithm with tabular approach for discrete state/action spaces
- FrozenLake-v1 environment (slippery/stochastic)
- FrozenLake-v1-NoSlip environment (deterministic)
- React frontend with real-time training visualization
- Server-Sent Events (SSE) for streaming training updates
- Environment preview on app load
- Q-table heatmap visualization (4×4 grid with action values)
- Episode reward chart with statistics
- Dynamic parameter panel with sliders
- Policy playback with frame-by-frame animation
- Environment-specific parameter ranges (num_episodes adapts per environment)
- Auto-reset when switching environments

### Fixed
- Critical tie-breaking bug in Q-Learning: `argmax` now randomly selects among tied Q-values
- Added max_steps_per_episode (100) to prevent infinite loops in deterministic environments

### Technical Details
- **Backend**: Flask, Gymnasium, NumPy, Python 3.9+
- **Frontend**: React 19, Recharts, Axios
- **Architecture**: Modular design with factory pattern, ready for stable-baselines3 integration
- **Rendering**: Only final frame per episode during training, all frames during playback

## Next Steps (Phase 2)
- Additional algorithms (SARSA, DQN with neural networks)
- Additional environments (CartPole, continuous control)
- Epsilon decay schedules
- Training progress persistence
