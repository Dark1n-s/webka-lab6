# URL Shortener Service (Lab 6)

REST API service for shortening URLs built with Node.js, Express.js 5, PostgreSQL, and Docker Compose using a design-first OpenAPI 3 approach.

## Prerequisites

- Docker and Docker Compose
- Node.js 22+ and npm

## Project Structure

- `openapi.yaml` — OpenAPI 3.0 specification (single source of truth)
- `db/init.sql` — PostgreSQL initialization schema
- `src/index.js` — Express 5 server setup, health check, and Swagger UI
- `src/db.js` — PostgreSQL connection via `pg-promise`
- `src/routes/links.js` — CRUD endpoints and redirect handler
- `src/utils/` — input validation, short code generator, and centralized error handler
- `test.txt` — `curl` commands exported from Swagger UI tests

## Quick Start

1. Create a local `.env` file from the template:
   ```bash
   cp .env.sample .env
   ```

2. Build and start the server and database containers:
   ```bash
   docker compose up --build
   ```

3. Access the service:
   - Interactive API docs (Swagger UI): http://localhost:8080/docs
   - Health check: http://localhost:8080/health

4. Stop containers while preserving database data:
   ```bash
   docker compose down
   ```