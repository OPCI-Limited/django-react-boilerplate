# Select docker compose command (override with `make DC="docker-compose"` if needed)
DC ?= docker compose

.PHONY: help up up-build down down-v restart ps logs backend-logs frontend-logs \
	backend-shell frontend-shell migrate makemigrations superuser createsuperuser test test-backend test-frontend \
	build-backend build-frontend lint lint-backend lint-frontend lint-frontend-fix \
	coverage coverage-backend coverage-frontend

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

up: ## Start all services in background
	$(DC) up -d

up-build: ## Build images then start services in background
	$(DC) up --build -d

build-backend: ## Build backend image
	$(DC) build backend

build-frontend: ## Build frontend image
	$(DC) build frontend

down: ## Stop and remove containers
	$(DC) down

down-v: ## Stop and remove containers and volumes
	$(DC) down -v

restart: ## Restart services (SERVICE=name to restart one)
	$(DC) restart $(SERVICE)

ps: ## List services
	$(DC) ps

logs: ## Tail logs (SERVICE=name to filter)
	$(DC) logs -f $(SERVICE)

backend-logs: ## Tail backend logs
	$(DC) logs -f backend

frontend-logs: ## Tail frontend logs
	$(DC) logs -f frontend

backend-shell: ## Open a shell in backend container
	$(DC) exec backend bash

frontend-shell: ## Open a shell in frontend container
	$(DC) exec frontend bash || $(DC) exec frontend sh

migrate: ## Run Django migrations
	$(DC) exec backend python manage.py migrate

makemigrations: ## Create new Django migrations (APP=name to target a specific app)
	$(DC) exec backend python manage.py makemigrations $(APP)

superuser: ## Create Django superuser (interactive)
	$(DC) exec backend python manage.py createsuperuser

createsuperuser: superuser ## Alias for superuser

test: test-backend test-frontend ## Run backend and frontend tests

test-backend: ## Run Django tests
	$(DC) exec backend python manage.py test

test-frontend: ## Run frontend tests (vitest)
	# The test script already includes --run; don't pass it twice
	$(DC) exec frontend npm run test --silent || true

coverage: coverage-backend coverage-frontend ## Run coverage for backend and frontend

coverage-backend: ## Backend coverage (HTML + XML reports)
	$(DC) exec backend bash -lc "coverage erase && coverage run --rcfile=.coveragerc manage.py test && coverage report -m && coverage xml"

coverage-frontend: ## Frontend coverage (Vitest)
	$(DC) exec frontend npm run test:coverage --silent || true

lint: lint-backend lint-frontend ## Run all linters (backend + frontend)

lint-backend: ## Run flake8 on backend
	$(DC) exec backend flake8

lint-frontend: ## Run ESLint on frontend
	$(DC) exec frontend npm run lint --silent || true

lint-frontend-fix: ## Run ESLint with --fix on frontend
	$(DC) exec frontend npm run lint:fix --silent || true
