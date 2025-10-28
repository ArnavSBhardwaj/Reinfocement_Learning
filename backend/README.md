# RL Playground - Backend

Flask backend for the RL Playground educational tool.

## Setup

This project uses **uv** for Python package management.

```bash
# Install dependencies and create virtual environment
uv sync

# Activate virtual environment (if needed for development)
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate  # On Windows
```

## Running

```bash
# Run with uv (recommended - automatically uses virtual environment)
uv run python app.py

# Or activate venv first, then run
source .venv/bin/activate && python app.py
```

The server will start on `http://localhost:5000`.

## API Endpoints

1. `GET /api/algorithms` - List available algorithms
2. `GET /api/environments` - List available environments
3. `GET /api/parameters/<algorithm>` - Get parameter schema
4. `POST /api/train` - Start training, return session_id
5. `GET /api/train/stream/<session_id>` - SSE training updates
6. `GET /api/play-policy/stream/<session_id>` - SSE policy playback
7. `POST /api/reset` - Clear all sessions
