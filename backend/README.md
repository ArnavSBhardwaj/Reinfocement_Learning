# RL Playground - Backend

Flask backend for the RL Playground educational tool.

## Quick Start

### With Docker (Recommended)
```bash
# From project root
docker-compose up
```
Backend API runs on http://localhost:5001

### Without Docker

This project uses **uv** for Python package management.

```bash
# Install dependencies and create virtual environment
uv sync

# Run backend server
uv run python app.py
```

Alternatively, activate the virtual environment first:
```bash
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate  # Windows

python app.py
```

## Testing

```bash
# Run tests with uv (recommended)
uv run pytest

# Run tests with coverage
uv run pytest --cov

# Run tests in Docker
docker-compose exec backend pytest
```

## Tech Stack

- **Flask** - Web framework
- **Gymnasium** - RL environments
- **NumPy** - Numerical computing
- **Pillow** - Image processing
- **pytest** - Testing framework

## API Endpoints

### REST Endpoints
1. `GET /api/algorithms` - List available algorithms
2. `GET /api/environments` - List available environments
3. `GET /api/parameters/<algorithm>` - Get parameter schema for algorithm
4. `POST /api/train` - Start training session, returns session_id
5. `POST /api/reset` - Clear all training sessions

### SSE Streaming Endpoints
6. `GET /api/train/stream/<session_id>` - Stream real-time training updates
7. `GET /api/play-policy/stream/<session_id>` - Stream policy playback frames

## Project Structure

```
backend/
├── algorithms/
│   ├── base_algorithm.py      # Abstract base class
│   ├── q_learning.py          # Q-Learning implementation
│   └── __init__.py            # AlgorithmFactory
├── environments/
│   └── environment_manager.py # Gymnasium environment handling
├── training/
│   └── trainer.py             # Session management with UUIDs
├── tests/                     # Test suite
│   ├── conftest.py            # Shared test fixtures
│   ├── test_algorithms/       # Algorithm tests
│   └── test_api/              # API endpoint tests
├── app.py                     # Flask application entry point
├── Dockerfile                 # Docker container definition
└── pyproject.toml             # Dependencies and project config
```

## Development

See the main [README.md](../README.md) for full setup instructions and architecture details.
