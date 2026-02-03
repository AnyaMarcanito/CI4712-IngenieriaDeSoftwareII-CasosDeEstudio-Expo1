.PHONY: init dev clean backend-test frontend-install frontend-test frontend-e2e

# 1. Preparar el entorno (Solo se corre la primera vez)
init:
	docker-compose up -d
	cd backend && go mod tidy
	cd frontend && npm install

# 2. Modo Desarrollo (Levanta todo)
# Usamos el puerto 5435 para Postgres y 8080 para Go
dev:
	docker-compose up -d
	@echo "Lanzando Backend y Frontend..."
	(cd backend && go run cmd/api/main.go) & (cd frontend && npm run dev)

# 3. Pruebas de Calidad
backend-test:
	cd backend && go test ./...

frontend-test:
	cd frontend && npm run test

frontend-e2e:
	cd frontend && npm run test:e2e

# 4. Limpieza de procesos y contenedores
clean:
	docker-compose down -v
	@echo "Limpieza profunda completada."