# Hands-On Q-Learning Notebook

## Prerequisites

Before starting, ensure you have:

- **Python 3.9+** installed ([download here](https://www.python.org/downloads/))
- **`uv`** package manager ([installation guide](https://docs.astral.sh/uv/getting-started/installation/))
  - Same tool used by the backend
  - Fast, modern Python package manager
- Optional: **VS Code** with Jupyter extension (recommended)
  - [Download VS Code](https://code.visualstudio.com)
  - [Install Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

## How to get the notebook running in VS Code (optional)

1. **Navigate to examples directory**:
   ```bash
   cd examples
   ```

2. **Install dependencies** (first time only):
   ```bash
   uv sync
   ```

3. **Register Jupyter kernel** (first time only):
   ```bash
   uv run python -m ipykernel install --user --name=workshop-rl1-examples --display-name "Python (RL Workshop)"
   ```

   This makes the virtual environment available as a kernel in VS Code and Jupyter Lab.

4. **Open in VS Code**:
   ```bash
   code .
   ```

5. **Open the notebook**:
   - In VS Code, open: `notebooks/q_learning_frozenlake.ipynb`
   - Click "Select Kernel" (top right)
   - Click "Jupyter Kernel"
   - Select **"Python (RL Workshop)"**
   - Run cells with Shift+Enter

## Alternative: Jupyter Lab in Browser (faster setup)

If you prefer working in a browser:

```bash
cd examples
uv run jupyter lab
```

Browser will open automatically at http://localhost:8888
