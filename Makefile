.DEFAULT_GOAL := help
.PHONY: help install lint format test dev validate deploy

TARGET ?= dev
PROFILE ?= DEFAULT
# In CI, auth comes from env vars. Passing --profile there looks for a file that is absent.
PROFILE_FLAG = $(if $(filter true,$(GITHUB_ACTIONS)),,--profile $(PROFILE))
BUNDLE_FLAGS = $(PROFILE_FLAG) --target $(TARGET)

help:  ## Show this help
	@grep -hE '^[a-z-]+:.*?##' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "};{printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install:  ## Install dependencies, including dev and the app if it is present
	uv sync --all-extras --all-groups
	@if [ -d app/frontend ]; then cd app/frontend && npm ci; fi

lint:  ## Check formatting, lint, and types
	uv run ruff format --check .
	uv run ruff check .
	uv run pyright
	@if [ -d app/frontend ]; then cd app/frontend && npx eslint . && npx tsc --noEmit; fi

format:  ## Fix formatting and any auto-fixable lint
	uv run ruff format .
	uv run ruff check --fix .

test:  ## Run the tests. Needs no credentials and no workspace
	uv run pytest
	@if [ -d app/frontend ]; then cd app/frontend && npm run test; fi

dev:  ## Run the app locally. Vite on 5173 proxies /api to uvicorn on 8000
	@trap 'kill 0' EXIT; \
	uv run uvicorn app.backend.main:app --reload --port 8000 & \
	cd app/frontend && npm run dev

validate:  ## Validate the bundle for one target
	databricks bundle validate $(BUNDLE_FLAGS)

deploy:  ## Deploy the bundle for one target
	databricks bundle deploy $(BUNDLE_FLAGS)
