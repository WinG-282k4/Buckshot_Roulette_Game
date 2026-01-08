# syntax=docker/dockerfile:1.6

# --- Build stage: compile React + Vite + TypeScript ---
FROM node:22-alpine AS builder
WORKDIR /workspace

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --cache /root/.npm

# Copy source code
COPY . .

# Build the app
RUN npm run build

# --- Runtime stage: serve with lightweight Node.js ---
FROM node:22-alpine
WORKDIR /app

# Install serve globally to run the built app
RUN npm install -g serve

# Copy the dist folder from builder
COPY --from=builder /workspace/dist /app/dist

# Expose port for the frontend
EXPOSE 3000

# Serve the static build on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
