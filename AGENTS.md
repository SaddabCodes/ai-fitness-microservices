# AGENTS.md

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and the user's question, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and the user's full question (not single words)
4. Answer using the fetched docs

## Commit Messages

When the user asks for a commit message, provide it in a professional conventional-commit style based on the actual change. Prefer precise prefixes such as `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `chore`, or `ci` instead of generic wording.

## Project Snapshot

This repository is no longer a single-service setup. It currently contains:

- `user-service`: Spring Boot user domain service on port `8081`, using PostgreSQL on `localhost:5433`
- `activity-service`: Spring Boot activity domain service on port `8082`, using MongoDB on `localhost:27017`
- `eureka-server`: Spring Cloud Netflix Eureka server on port `8761`

Current baseline:

- Spring Boot `4.0.6`
- Spring Cloud `2025.1.1`
- `user-service` is configured as a Eureka client
- `activity-service` is configured as a Eureka client
- `eureka-server` is the service registry at `http://localhost:8761/eureka`

## Service-Specific Working Rules

- Do not assume every service uses the same database. `user-service` uses PostgreSQL, while `activity-service` uses MongoDB.
- When changing service discovery or configuration, keep `spring.application.name`, service ports, and Eureka URLs aligned with each service's `application.yaml`.
- When editing code, keep changes scoped to the relevant service unless the feature explicitly spans multiple services.
- For Java or Maven changes, verify the touched service's own `pom.xml` before assuming the same change applies repository-wide, because service dependencies and Java versions may differ.

## Verification Guidance

- Run Maven commands from the service directory you changed, not from the repository root.
- Prefer validating the smallest affected scope first, such as `compile` or `test` for the touched service.
<!-- context7 -->
