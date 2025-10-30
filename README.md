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

### Option 1: Docker Setup (Recommended for Workshops)

Docker provides a consistent, cross-platform environment that works identically on macOS, Windows, and Linux. Perfect for workshops and collaborative development!

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

#### Development Guide for Docker Beginners

This guide walks you through the complete development workflow using Docker, from setup to daily development.

**Visual Overview of Your Development Setup:**

```
┌─────────────────────────────────────────────────────────────┐
│ Your Computer (macOS/Windows/Linux)                        │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ VS Code      │         │ Browser      │                │
│  │ Editor       │         │              │                │
│  └──────────────┘         └──────────────┘                │
│         │                        │                         │
│         │ Edit files             │ View app                │
│         ↓                        ↓                         │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ backend/     │◄────────┤ localhost:   │                │
│  │ frontend/    │ Mounted │ 3000, 5001   │                │
│  │ (Your code)  │         │              │                │
│  └──────────────┘         └──────────────┘                │
│         ║                        ║                         │
│         ║ Volume mounting        ║ Port forwarding         │
│         ↓                        ↓                         │
│  ╔═══════════════════════════════════════════╗            │
│  ║ Docker Desktop                             ║            │
│  ║  ┌─────────────┐    ┌─────────────┐      ║            │
│  ║  │ Backend     │    │ Frontend    │      ║            │
│  ║  │ Container   │◄───┤ Container   │      ║            │
│  ║  │ (Python)    │    │ (Node.js)   │      ║            │
│  ║  └─────────────┘    └─────────────┘      ║            │
│  ╚═══════════════════════════════════════════╝            │
└─────────────────────────────────────────────────────────────┘

Changes flow: Edit file → Container sees change → Server reloads → Browser updates
```

##### 1️⃣ First-Time Setup (Do this once)

**Step 1: Install Docker Desktop**
- Download from https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop
- Verify installation:
  ```bash
  docker --version
  docker-compose --version
  ```
  You should see version numbers for both commands.

**Step 2: Clone the Repository**
```bash
git clone <repository-url>
cd rl-playground
```

**Step 3: Build and Start Containers (First Build)**

The first build will take 5-10 minutes because Docker needs to:
- Download base images (Python, Node.js)
- Install all Python packages
- Install all npm packages

```bash
docker-compose up --build
```

Watch the output. You'll see:
- `backend_1` and `frontend_1` building
- Package installations scrolling by
- Eventually: "Server running on http://localhost:5001" (backend)
- Eventually: "webpack compiled successfully" (frontend)

**Step 4: Verify Everything Works**
- Open browser to http://localhost:3000
- You should see the RL Playground interface
- Try starting a training session to verify everything works

**Step 5: Stop the Containers**

Press `Ctrl+C` in the terminal where docker-compose is running.

---

##### 2️⃣ Daily Development Workflow

**Starting Your Work Day**

```bash
# Navigate to project directory
cd rl-playground

# Start containers (much faster after first build - takes ~10 seconds)
docker-compose up
```

Keep this terminal open. You'll see logs from both backend and frontend here.

**Opening a Second Terminal for Commands**

Open a new terminal window/tab for git commands, checking files, etc. Leave the docker-compose terminal running.

---

##### 3️⃣ Making Code Changes

**The Magic: Live Code Reloading**

Your code on your computer is "mounted" into the Docker containers. This means:
- You edit files in your normal editor (VS Code, PyCharm, etc.)
- The containers see the changes immediately
- The servers automatically reload

**Example: Editing Backend Code**

1. Open `backend/algorithms/q_learning.py` in your editor
2. Make a change (add a print statement, modify logic, etc.)
3. Save the file
4. Watch the docker-compose terminal - you'll see:
   ```
   backend_1  | * Detected change in '/app/algorithms/q_learning.py', reloading
   backend_1  | * Restarting with stat
   ```
5. The backend automatically restarted with your changes!

**Example: Editing Frontend Code**

1. Open `frontend/src/components/ParameterPanel.jsx`
2. Make a change (modify text, add a button, etc.)
3. Save the file
4. Watch your browser - the page automatically refreshes!
5. Your changes appear instantly (no manual refresh needed)

**What You DON'T Need to Do:**
- ❌ Restart containers manually
- ❌ Run build commands
- ❌ Refresh the browser (frontend does it automatically)
- ❌ Reinstall packages (unless you add new dependencies)

---

##### 4️⃣ Adding New Dependencies

Sometimes you need to add a new Python package or npm package.

**Adding a Python Package**

1. Stop containers (`Ctrl+C`)
2. Edit `backend/pyproject.toml` to add your package:
   ```toml
   dependencies = [
       "flask>=3.0.0",
       "your-new-package>=1.0.0"  # Add this line
   ]
   ```
3. Rebuild and restart:
   ```bash
   docker-compose up --build
   ```
   The `--build` flag tells Docker to reinstall packages.

**Adding an npm Package**

1. Stop containers (`Ctrl+C`)
2. Add the package to `frontend/package.json` dependencies section:
   ```json
   "dependencies": {
     "react": "^18.2.0",
     "your-new-package": "^1.0.0"
   }
   ```
3. Rebuild and restart:
   ```bash
   docker-compose up --build
   ```

**Why `--build`?** Without it, Docker uses cached package installations. `--build` forces Docker to reinstall everything with your new packages.

---

##### 5️⃣ Viewing Logs and Debugging

**Viewing Logs While Running**

Your docker-compose terminal shows logs from both services. To filter:

```bash
# In a second terminal (keep docker-compose running in first)
docker-compose logs backend      # Only backend logs
docker-compose logs frontend     # Only frontend logs
docker-compose logs -f backend   # Follow backend logs in real-time
```

**Debugging Backend Code**

Print statements work great:
```python
print(f"DEBUG: Episode {episode}, reward {reward}")
```

These print statements appear in your docker-compose terminal immediately.

**Debugging Frontend Code**

Use browser DevTools:
- Open browser DevTools (F12 or Right-click → Inspect)
- Console tab shows `console.log()` output
- Network tab shows API calls to backend
- React DevTools extension helps with component debugging

**Running Commands Inside Containers**

Sometimes you need to run a command inside a container:

```bash
# Open a shell in the backend container
docker-compose exec backend /bin/bash

# Now you're "inside" the container - you can run Python:
python
>>> import numpy as np
>>> np.array([1,2,3])
>>> exit()

# Exit the container shell
exit
```

```bash
# Open a shell in the frontend container
docker-compose exec frontend /bin/bash

# Check installed npm packages
npm list

# Exit
exit
```

---

##### 6️⃣ Common Development Tasks

**Task: Pull Latest Changes from Git**

```bash
# Stop containers
# Press Ctrl+C in docker-compose terminal

# Pull changes
git pull origin main

# Restart containers (rebuild if dependencies changed)
docker-compose up --build
```

**Task: Switch Git Branches**

```bash
# Stop containers (Ctrl+C)

# Switch branch
git checkout feature-branch

# Restart (rebuild if the branch has different dependencies)
docker-compose up --build
```

**Task: Reset to Fresh State**

If something breaks and you want to start completely fresh:

```bash
# Stop containers (Ctrl+C)

# Remove containers and volumes (this deletes everything Docker-related)
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

This is like "turning it off and on again" but for Docker. Your code files are safe - this only affects Docker containers.

**Task: Running Tests**

```bash
# Backend tests (if you have them)
docker-compose exec backend pytest

# Frontend tests
docker-compose exec frontend npm test
```

---

##### 7️⃣ Stopping Your Work

**Option A: Keep Containers Running (Recommended)**

Just close your browser and editor. The containers keep running in the background. Tomorrow:
```bash
cd rl-playground
# Containers are still running - just open http://localhost:3000
```

Check if they're running:
```bash
docker-compose ps
```

**Option B: Stop Containers (Saves RAM)**

```bash
# In the docker-compose terminal, press Ctrl+C
# OR in another terminal:
docker-compose down
```

This stops the containers. Tomorrow you'll need to run `docker-compose up` again.

---

##### 8️⃣ Docker Mental Model (Understanding What's Happening)

**Think of Docker containers like lightweight virtual machines:**

- **Your Computer (Host)**: Where you edit code
- **Backend Container**: A mini Linux machine running Python/Flask
- **Frontend Container**: A mini Linux machine running Node.js/React

**Volume Mounting**: Your local folders are "shared" with containers:
- You edit `backend/app.py` on your computer
- The backend container sees the same file at `/app/app.py`
- When you save, the container sees the change immediately

**Networking**: Containers talk to each other:
- Frontend container can reach backend at `http://backend:5001`
- Your browser reaches frontend at `http://localhost:3000`
- Your browser reaches backend at `http://localhost:5001`

**Isolation**: Containers are isolated:
- Deleting a container doesn't delete your code
- Python packages in the container don't affect your computer's Python
- You can't accidentally break your system Python or Node.js

---

##### 9️⃣ Common Beginner Mistakes (and How to Fix Them)

**Mistake 1: Editing files inside the container**
```bash
docker-compose exec backend /bin/bash
vim app.py  # ❌ DON'T DO THIS
```
**Fix**: Edit files on your computer with your normal editor. Changes automatically sync to the container.

**Mistake 2: Forgetting to rebuild after adding dependencies**
- Added a package but getting "Module not found"?
- **Fix**: Stop containers, run `docker-compose up --build`

**Mistake 3: Port already in use**
- Error: "port is already allocated"
- **Fix**: Something else is using port 3000 or 5001. Stop that service or change ports in `docker-compose.yml`

**Mistake 4: Docker Desktop not running**
- Error: "Cannot connect to the Docker daemon"
- **Fix**: Start Docker Desktop application

**Mistake 5: Changes not appearing**
- Made code changes but don't see them?
- **Fix**: Check the docker-compose logs for errors. Restart containers: `docker-compose restart`

---

##### 🔟 Troubleshooting Flowchart

When something goes wrong, follow this decision tree:

**Problem: Docker commands not working**
```
❓ Can you run `docker --version`?
├─ No → Docker Desktop not installed or not running
│        Solution: Install/Start Docker Desktop
└─ Yes → Continue below
```

**Problem: Containers won't start**
```
❓ Do you see "port is already allocated"?
├─ Yes → Port 3000 or 5001 is in use
│        Solution: Find and stop the conflicting service
│        • macOS/Linux: lsof -i :3000 or lsof -i :5001
│        • Windows: Get-NetTCPConnection -LocalPort 3000
└─ No → Check logs: docker-compose logs
         Look for error messages in the output
```

**Problem: Code changes not appearing**
```
❓ Did you save the file?
├─ No → Save it! :)
└─ Yes ↓

❓ Did you add a new dependency (package)?
├─ Yes → Rebuild: docker-compose up --build
└─ No ↓

❓ Does docker-compose logs show errors?
├─ Yes → Read the error message - it usually tells you what's wrong
└─ No → Try restarting: docker-compose restart
        Still broken? Nuclear option: docker-compose down -v
                                      docker-compose up --build
```

**Problem: "Module not found" or "Package not found"**
```
Did you add a new Python package or npm package?
└─ Yes → You forgot to rebuild!
         Solution: docker-compose down
                   docker-compose up --build
```

**Problem: Everything was working, now it's broken**
```
❓ Did someone else push changes to git?
├─ Yes → Pull and rebuild:
│        git pull origin main
│        docker-compose up --build
└─ No ↓

❓ Did you switch branches?
├─ Yes → Rebuild: docker-compose up --build
└─ No → When in doubt, fresh start:
        docker-compose down -v
        docker-compose up --build
```

---

##### 1️⃣1️⃣ Getting Help

If you're stuck after trying the troubleshooting steps:

1. **Check the logs** - most problems show error messages:
   ```bash
   docker-compose logs
   ```

2. **Search the error message** - Copy the key part of the error and search online

3. **Ask for help** - Share:
   - What you were trying to do
   - The error message (from docker-compose logs)
   - What you've already tried

4. **Fresh start** - Often fixes mysterious issues:
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

---

#### Quick Reference: Useful Docker Commands

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

### Option 2: Local Setup (Without Docker)

If you prefer to run services directly on your machine:

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
│   │   ├── base_algorithm.py       # Abstract base class
│   │   ├── q_learning.py           # Q-Learning implementation
│   │   └── __init__.py             # AlgorithmFactory
│   ├── environments/
│   │   └── environment_manager.py  # Gym env handling
│   ├── training/
│   │   └── trainer.py              # Session management
│   ├── app.py                      # Flask API (7 endpoints)
│   ├── Dockerfile                  # Backend Docker image
│   ├── .dockerignore               # Backend Docker ignore rules
│   └── pyproject.toml              # Python dependencies
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
│   ├── Dockerfile                  # Frontend Docker image
│   ├── .dockerignore               # Frontend Docker ignore rules
│   └── package.json                # Node.js dependencies
├── docker-compose.yml              # Docker orchestration
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
