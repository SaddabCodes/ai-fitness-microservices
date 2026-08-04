# Repository Guidelines

## Project Structure

This repository contains a Spring Cloud backend and a React frontend:

- `backend/` contains the independent Maven services: `user-service`, `activity-service`, `AI-Service`, `api-gateway`, `Config-Server`, and `eureka-server`.
- Each service keeps production code in `src/main`, tests in `src/test`, and its own `pom.xml` and configuration.
- `frontend/ai-fitness-frontend/` is a Vite React application; source code is in `src/` and static assets are in `public/`.
- `README.md` documents the runtime topology, ports, infrastructure, and API routes.

## Build, Test, and Development Commands

Run Maven commands from the service directory being changed, for example:

```bash
cd backend/activity-service
./mvnw test
./mvnw spring-boot:run
```

Use `mvnw.cmd` on Windows. `test` compiles and runs the service tests; `spring-boot:run` starts that service locally. Start infrastructure and services in the order documented in `README.md` (Config Server, Eureka, domain services, AI service, then Gateway). For the frontend:

```bash
cd frontend/ai-fitness-frontend
npm install
npm run lint
npm run build
npm run dev
```

## Coding Style and Naming

Use four-space indentation for Java and follow standard Spring naming: `PascalCase` classes, `camelCase` methods/fields, and descriptive package names. Keep controllers, services, repositories, DTOs, and configuration in their existing package structure. Use `PascalCase` React components and `camelCase` hooks, functions, and variables. Run the frontend ESLint script before submitting UI changes. Avoid committing generated `target/`, `dist/`, or dependency directories.

## Testing Guidelines

Backend tests use Spring Boot/JUnit support and belong under the touched service's `src/test`. Name test classes after the unit under test, ending in `Test`. Run `./mvnw test` for the affected service. Frontend changes should pass `npm run lint` and `npm run build`; add focused tests when test coverage is introduced for a feature.

## Architecture and Configuration

Keep service discovery names, ports, Config Server URLs, and Eureka settings aligned. `user-service` uses PostgreSQL; `activity-service` and `AI-Service` use MongoDB, with Kafka and Gemini credentials additionally required by `AI-Service`. `api-gateway` validates Keycloak JWTs and routes client traffic. Never commit credentials; use environment variables or local configuration.

## Commits and Pull Requests

Use Conventional Commit messages, such as `feat(frontend): add activity form` or `fix(api-gateway): correct JWT routing`. Keep commits focused. Pull requests should explain the behavior changed, identify affected services, list validation commands, and include screenshots for visible frontend changes. Call out required infrastructure or configuration changes explicitly.
