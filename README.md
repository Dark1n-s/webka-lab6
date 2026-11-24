# URL Shortener Service (Lab 6)

REST API service for shortening URLs built with Node.js, Express.js 5, PostgreSQL, and Docker Compose using a design-first OpenAPI 3 approach.

## Prerequisites

- Docker and Docker Compose
- Node.js 22+ and npm

## Quick Start

1. Copy the environment variables template:
   ```bash
   cp .env.sample .env
   ```

2. Start the server and database containers:
   ```bash
   docker compose up --build
   ```

3. Open interactive API documentation in your browser:
   - Swagger UI: http://localhost:8080/docs
   - Health check: http://localhost:8080/health