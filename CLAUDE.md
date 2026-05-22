# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a microservices-based AI fitness application built with Spring Boot 4.0.6, Java 21, and PostgreSQL. The architecture follows a service-oriented design where each microservice handles a specific domain.

## Technology Stack

- **Framework**: Spring Boot 4.0.6
- **Java Version**: 21
- **Build Tool**: Maven
- **Database**: PostgreSQL (port 5433)
- **ORM**: Spring Data JPA with Hibernate
- **Validation**: Jakarta Validation
- **Code Generation**: Lombok

## Project Structure

```
ai-fitness-microservices/
├── user-service/          # User management microservice
│   ├── src/main/java/com/sadcodes/userservice/
│   │   ├── entity/        # JPA entities (User, UserRole)
│   │   ├── dto/           # Data Transfer Objects (request/response)
│   │   ├── repository/    # Spring Data JPA repositories
│   │   ├── service/       # Business logic layer
│   │   └── controller/    # REST API endpoints
│   └── src/main/resources/
│       └── application.yaml  # Service configuration
└── [future services]
```

## Development Commands

### Build and Test

```bash
# Build user-service
cd user-service && ./mvnw clean install

# Run tests
cd user-service && ./mvnw test

# Run tests for a specific class
cd user-service && ./mvnw test -Dtest=ClassName

# Run a specific test method
cd user-service && ./mvnw test -Dtest=ClassName#methodName
```

### Running the Application

```bash
# Run user-service
cd user-service && ./mvnw spring-boot:run

# Run with specific profile
cd user-service && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Code Quality

```bash
# Compile and check for errors
cd user-service && ./mvnw compile

# Clean build artifacts
cd user-service && ./mvnw clean
```

## Database Setup

The application requires a PostgreSQL database running on port 5433 with:
- Database name: `microservice_ai_fitness`
- Username: `postgres`
- Password: `1234`

To set up the database:
```bash
# Using Docker
docker run --name ai-fitness-postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=microservice_ai_fitness -p 5433:5432 -d postgres

# Or manually create the database in your local PostgreSQL instance
psql -U postgres -p 5433 -c "CREATE DATABASE microservice_ai_fitness;"
```

Hibernate DDL is set to `update`, so tables will be created/updated automatically on application startup.

## Architecture Patterns

### Entity Layer
- Entities use Lombok annotations (`@Getter`, `@Setter`, `@AllArgsConstructor`, `@NoArgsConstructor`)
- UUIDs are used as primary keys (generated via `GenerationType.UUID`)
- Timestamp fields use `@CreationTimestamp` and `@UpdateTimestamp`
- Enums are stored as strings (`@Enumerated(EnumType.STRING)`)

### DTO Pattern
- Request DTOs use Jakarta validation annotations (`@NotBlank`, `@Email`, `@Size`)
- Response DTOs expose necessary fields and exclude sensitive data where appropriate
- Manual mapping between entities and DTOs (no MapStruct or ModelMapper yet)

### Service Layer
- Services use constructor injection via Lombok's `@RequiredArgsConstructor`
- Exception handling currently uses `RuntimeException` (consider implementing custom exceptions)

### Controller Layer
- REST endpoints follow `/api/{resource}` pattern
- Controllers use constructor injection
- Request validation via `@Valid` annotation
- Standard HTTP status codes (201 for creation, 200 for retrieval)

## API Endpoints

### User Service (default port 8080)

- `POST /api/users/register` - Register a new user
  - Request: `RegisterRequest` (email, password, firstName, lastName)
  - Response: `UserResponse` with 201 Created

- `GET /api/users/{userId}` - Get user profile by ID
  - Response: `UserResponse` with 200 OK

## Common Patterns

### Adding a New Microservice

1. Create service directory at root level
2. Use Spring Boot 4.0.6 with Java 21
3. Follow package structure: `com.sadcodes.{service-name}`
4. Include standard layers: entity, dto, repository, service, controller
5. Configure database connection in `application.yaml`
6. Add appropriate Maven dependencies in `pom.xml`

### Adding a New Entity

1. Create entity class in `entity/` package
2. Use Lombok annotations for boilerplate code
3. Add JPA annotations (`@Entity`, `@Table`, `@Id`, etc.)
4. Include `@CreationTimestamp` and `@UpdateTimestamp` for audit fields
5. Create corresponding repository interface extending `JpaRepository`

### Adding a New API Endpoint

1. Create request/response DTOs in `dto/` package with validation
2. Add service method in the service layer
3. Create controller method with appropriate HTTP method annotation
4. Return `ResponseEntity` with appropriate status code

## Future Improvements to Consider

- Implement global exception handling with `@ControllerAdvice`
- Add password encryption (BCrypt) before storing
- Implement DTO mapping library (MapStruct or ModelMapper)
- Add API documentation (SpringDoc OpenAPI)
- Implement service discovery (Eureka) and API Gateway
- Add logging framework configuration (SLF4J/Logback)
- Implement authentication/authorization (Spring Security with JWT)
- Add integration tests with Testcontainers
- Configure different profiles (dev, test, prod)
