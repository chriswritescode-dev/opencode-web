# OpenCode Web Manager

A full-stack web application for running [OpenCode](https://github.com/sst/opencode) in local processes, controllable via a modern web interface. Designed to allow users to run and control OpenCode from their phone or any device with a web browser.  

## Features

-  **Multi-Repository Support** - Clone and manage multiple git repos / worktrees in local workspaces  
-  **Web-based Interface** - Full OpenCode TUI features in the browser / Built with mobile use in mind
-  **Local Environment** - Efficient local processes with isolated workspaces
-  **Manage multiple repositories** - Add, remove, and switch between different code repositories
-  **Designed for mobile use** - Mobile-friendly UI 
-  **File Browser** - Browse, edit, and manage files in your workspaces
-  **Push PRs to GitHub** - Create and push pull requests directly from your phone on the go

## Coming Soon

-  **Authentication** - User authentication and session management

## Installation

### Option 1: Docker (Recommended for Production)

```bash
# Clone the repository
git clone https://github.com/yourusername/opencode-webui.git
cd opencode-webui

# Start with Docker Compose (single container)
docker-compose up -d

# Access the application at http://localhost:5001
```

The Docker setup automatically:
- Installs OpenCode if not present
- Builds and serves frontend from backend
- Sets up persistent volumes for workspace and database
- Includes health checks and auto-restart

**Docker Commands:**
```bash
# Production mode (single container)
npm run docker:up          # Start container
npm run docker:down        # Stop and remove container
npm run docker:build       # Rebuild image
npm run docker:logs        # View logs
npm run docker:restart     # Restart container

# Development mode (separate backend + frontend with hot reload)
npm run docker:dev         # Start in dev mode
npm run docker:dev:down    # Stop dev containers

# Access container shell
docker exec -it opencode-webui sh
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/opencode-webui.git
cd opencode-webui

# Install dependencies (uses Bun workspaces)
bun install

# Copy environment configuration
cp .env.example .env

# Start development servers (backend + frontend)
npm run dev
```


