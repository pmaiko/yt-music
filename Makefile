COMPOSE_BASE = compose.yaml
COMPOSE_DEV  = compose.dev.yaml
COMPOSE_PROD = compose.prod.yaml

.PHONY: dev prod down rebuild logs ps

dev:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up --build --remove-orphans

prod:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) up --build -d --remove-orphans

down:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) -f $(COMPOSE_PROD) down

rebuild:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) build --no-cache

logs:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) logs -f

ps:
	docker compose ps
