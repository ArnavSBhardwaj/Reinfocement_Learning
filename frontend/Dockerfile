# Use Node.js 18 (LTS - Long Term Support)
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (for Docker layer caching)
# This means: only reinstall packages when package.json changes
COPY package.json package-lock.json ./

# Install dependencies
# Using npm install (more forgiving for development)
RUN npm install

# Expose port 3000 (React dev server default)
EXPOSE 3000

# Set environment variable to make React work in Docker
# Needed for hot-reload to work properly
ENV CHOKIDAR_USEPOLLING=true

# Start React development server
# This provides hot-reload, debugging tools, etc.
CMD ["npm", "start"]
