# Use Python 3.10 on Debian Linux (slim = smaller image)
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies (curl for uv installer + pygame libraries)
RUN apt-get update && apt-get install -y \
    curl \
    libsdl2-dev \
    libsdl2-image-dev \
    libsdl2-mixer-dev \
    libsdl2-ttf-dev \
    libfreetype6-dev \
    libportmidi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv using official installer (pinned for reproducibility)
# Update check: https://github.com/astral-sh/uv/releases
RUN curl -LsSf https://astral.sh/uv/0.9.6/install.sh | sh

# Add uv to PATH (installer puts it in ~/.local/bin)
ENV PATH="/root/.local/bin:$PATH"

# Copy dependency files (for Docker layer caching)
COPY pyproject.toml uv.lock* ./

# Install Python dependencies using uv
# --system flag installs into system Python (no venv needed in container)
RUN uv pip install --system --no-cache \
    flask>=3.0.0 \
    flask-cors>=4.0.0 \
    gymnasium>=0.29.0 \
    numpy>=1.24.0 \
    pillow>=10.0.0 \
    pygame>=2.1.0

# Copy all application code
COPY . .

# Expose port 5001
EXPOSE 5001

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Command to run when container starts
CMD ["python", "app.py"]
