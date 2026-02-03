COMPOSE_BASE = compose.yaml
COMPOSE_DEV  = compose.dev.yaml
COMPOSE_PROD = compose.prod.yaml

.PHONY: dev prod down rebuild logs ps

dev:
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up --build --remove-orphans

prod:
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) up --build -d --remove-orphans

down:
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) -f $(COMPOSE_PROD) down

rebuild:
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) build --no-cache

logs:
	docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) logs -f

ps:
	docker compose ps
