# Makefile for managing Django backend (uv), Next.js frontend (pnpm), and Docker Compose

# Variables
COMPOSE_FILE = docker-compose.yml
BACKEND_DIR = backend
FRONTEND_DIR = frontend
DOCKER_COMPOSE = docker-compose -f $(COMPOSE_FILE)

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo ""
	@echo "  -- Docker Commands --"
	@echo "  =========================================================================="
	@echo "  make build          - Build Docker images for backend and frontend from their Dockerfiles"
	@echo "  make up             - Build and start all services (db, backend, frontend, nginx) in detached mode"
	@echo "  make down           - Stop and remove all running services and containers"
	@echo "  make logs           - Stream logs from all services for debugging and monitoring"
	@echo "  make backend-shell  - Open an interactive shell inside the backend container"
	@echo "  make frontend-shell - Open an interactive shell inside the frontend container"
	@echo "  make clean          - Remove all Docker containers, images, and volumes for a fresh start"
	@echo ""
	@echo "  -- Backend Commands (Django with UV) --"
	@echo "  =========================================================================="
	@echo "  make superuser      - Create a Django superuser for admin access inside the backend container"
	@echo "  make dummy-data     - Populate the database with dummy data from dummy_data.json file"
	@echo "  make test-backend   - Run Django tests inside the backend container (assumes tests are configured)"
	@echo "  make install-backend- Install backend dependencies locally using UV (for non-Docker development)"
	@echo "  make run-backend    - Run the Django development server locally at http://localhost:8000"
	@echo "  make check          - Check code format and linting using Ruff in the backend directory"
	@echo "  make check-fix      - Check and automatically fix linting issues using Ruff in the backend"
	@echo "  make code-format    - Format code using Ruff with auto-fixing in the backend directory"
	@echo ""
	@echo "  -- Frontend Commands (Next.js with pnpm) --"
	@echo "  =========================================================================="
	@echo "  make test-frontend  - Run frontend tests inside the frontend container (requires pnpm test script)"
	@echo "  make install-frontend - Install frontend dependencies locally using pnpm (for non-Docker dev)"
	@echo "  make run-frontend   - Run the Next.js development server locally at http://localhost:3000"

# Build Docker images for backend and frontend
.PHONY: build
build:
	$(DOCKER_COMPOSE) build

# Start all services in detached mode
.PHONY: up
up:
	$(DOCKER_COMPOSE) up --build -d

# Stop and remove all services
.PHONY: down
down:
	$(DOCKER_COMPOSE) down

# View logs for all services
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Open a shell in the backend container
.PHONY: backend-shell
backend-shell:
	$(DOCKER_COMPOSE) exec backend /bin/sh

# Open a shell in the frontend container
.PHONY: frontend-shell
frontend-shell:
	$(DOCKER_COMPOSE) exec frontend /bin/sh

# Create a Django superuser
.PHONY: superuser
superuser:
	$(DOCKER_COMPOSE) exec backend python manage.py createsuperuser

# Populate dummy data (assumes a custom management command exists)
.PHONY: dummy-data
dummy-data:
	$(DOCKER_COMPOSE) exec backend python manage.py loaddata dummy_data.json

# Clean up Docker resources (containers, images, volumes)
.PHONY: clean
clean:
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans

# Run backend tests (assumes Django tests are configured)
.PHONY: test-backend
test-backend:
	$(DOCKER_COMPOSE) exec backend python manage.py test

# Run frontend tests (assumes pnpm test script is configured)
.PHONY: test-frontend
test-frontend:
	$(DOCKER_COMPOSE) exec frontend pnpm test

# Install backend dependencies locally (for development outside Docker)
.PHONY: install-backend
install-backend:
	cd $(BACKEND_DIR) && uv pip install -r requirements.txt

# Check code format using ruff (for development outside Docker)
.PHONY: check
check:
	cd $(BACKEND_DIR) && uv run ruff check

# Check code and fix using ruff (for development outside Docker)
.PHONY: check-fix
check-fix:
	cd $(BACKEND_DIR) && uv run ruff check --fix

# Code format using ruff (for development outside Docker)
.PHONY: code-format
code-format:
	cd $(BACKEND_DIR) && uv run ruff check --fix

# Install frontend dependencies locally (for development outside Docker)
.PHONY: install-frontend
install-frontend:
	cd $(FRONTEND_DIR) && pnpm install

# Run backend locally (for development outside Docker)
.PHONY: run-backend
run-backend:
	cd $(BACKEND_DIR) && uv run python manage.py runserver 0.0.0.0:8000

# Run frontend locally (for development outside Docker)
.PHONY: run-frontend
run-frontend:
	cd $(FRONTEND_DIR) && pnpm dev