# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a microservices-based AI fitness application built with Spring Boot 4.0.6, Java 21, and PostgreSQL. The architecture follows a service-oriented design where each microservice handles a specific domain.

## Technology Stack

- **Framework**: Spring Boot 4.0.6
- **Java Version**: 21
- **Build Tool**: Maven
- **Databases**: 
  - PostgreSQL (port 5433) - for user-service
  - MongoDB (port 27017) - for activity-service and AI-Service
- **ORM**: Spring Data JPA with Hibernate (PostgreSQL), Spring Data MongoDB (MongoDB)
- **Service Discovery**: Eureka Server (port 8761)
- **Message Broker**: Apache Kafka (port 9092) - for inter-service communication
- **Validation**: Jakarta Validation
- **Code Generation**: Lombok

## Project Structure

```
ai-fitness-microservices/
├── EurekaServer/          # Service discovery server
│   ├── src/main/java/com/sadcodes/eurekaserver/
│   │   └── EurekaServerApplication.java
│   └── src/main/resources/
│       └── application.yaml  # Eureka server configuration (port 8761)
│
├── user-service/          # User management microservice (port 8080)
│   ├── src/main/java/com/sadcodes/userservice/
│   │   ├── entity/        # JPA entities (User, UserRole)
│   │   ├── dto/           # Data Transfer Objects (request/response)
│   │   ├── repository/    # Spring Data JPA repositories
│   │   ├── service/       # Business logic layer
│   │   └── controller/    # REST API endpoints
│   └── src/main/resources/
│       └── application.yaml  # Service configuration
│
├── activity-service/      # Activity tracking microservice (port 8082)
│   ├── src/main/java/com/sadcodes/activityservice/
│   │   ├── model/         # MongoDB documents (Activity, ActivityType)
│   │   ├── dto/           # Data Transfer Objects (request/response)
│   │   ├── repositories/  # Spring Data MongoDB repositories
│   │   ├── services/      # Business logic layer
│   │   ├── controller/    # REST API endpoints
│   │   └── config/        # MongoDB configuration
│   └── src/main/resources/
│       └── application.yaml  # Service configuration
│
├── AI-Service/            # AI recommendation service (port 8083)
│   ├── src/main/java/com/sadcodes/aiservice/
│   │   ├── model/         # MongoDB documents (Activity, ActivityType)
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── repositories/  # Spring Data MongoDB repositories
│   │   ├── services/      # Business logic layer (RecommendationService)
│   │   ├── listeners/     # Kafka message listeners (ActivityMessageListener)
│   │   └── controller/    # REST API endpoints
│   └── src/main/resources/
│       └── application.yaml  # Service configuration
│
└── [future services]
```

## Development Commands

### Build and Test

```bash
# Build any service (replace {service} with: user-service, activity-service, or EurekaServer)
cd {service} && ./mvnw clean install

# Run tests
cd {service} && ./mvnw test

# Run tests for a specific class
cd {service} && ./mvnw test -Dtest=ClassName

# Run a specific test method
cd {service} && ./mvnw test -Dtest=ClassName#methodName
```

### Running the Application

```bash
# Start Eureka Server first (service discovery)
cd EurekaServer && ./mvnw spring-boot:run

# Run user-service
cd user-service && ./mvnw spring-boot:run

# Run activity-service
cd activity-service && ./mvnw spring-boot:run

# Run AI-Service
cd AI-Service && ./mvnw spring-boot:run

# Run with specific profile
cd {service} && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Code Quality

```bash
# Compile and check for errors
cd {service} && ./mvnw compile

# Clean build artifacts
cd {service} && ./mvnw clean
```

## Database Setup

### PostgreSQL (for user-service)

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

### MongoDB (for activity-service and AI-Service)

MongoDB is used for activity tracking and AI recommendations. Services use the following configuration in `application.yaml`:

**activity-service:**
```yaml
spring:
  mongodb:
    host: localhost
    port: 27017
    database: microservice_ai_fitness
```

**AI-Service:**
```yaml
spring:
  mongodb:
    host: localhost
    port: 27017
    database: airecommendationfitness
```

To set up MongoDB locally:
```bash
# Using Docker
docker run --name ai-fitness-mongo -d -p 27017:27017 mongo

# Or install MongoDB locally and ensure it's running on port 27017
```

### Apache Kafka (for inter-service communication)

Kafka is used for asynchronous messaging between services. Configure in `application.yaml`:
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: {service-specific-group-id}
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer

app:
  kafka:
    topic:
      name: activity-fitness
```

To set up Kafka locally:
```bash
# Using Docker
docker run --name ai-fitness-kafka -d -p 9092:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT confluentinc/cp-kafka

# Or use docker-compose for Kafka + Zookeeper setup
```

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

### Eureka Server (port 8761)

- Dashboard: `http://localhost:8761`
- Used for service discovery and registration by other microservices

### User Service (port 8080)

- `POST /api/users/register` - Register a new user
  - Request: `RegisterRequest` (email, password, firstName, lastName)
  - Response: `UserResponse` with 201 Created

- `GET /api/users/{userId}` - Get user profile by ID
  - Response: `UserResponse` with 200 OK

### Activity Service (port 8082)

- `POST /api/activities/track` - Track a new activity
  - Request: `ActivityRequest` (userId, activityType, duration, calories, timestamp)
  - Response: `ActivityResponse` with 201 Created
  - Publishes activity event to Kafka topic `activity-fitness`

- `GET /api/activities/user/{userId}` - Get activities for a user
  - Query params: `limit`, `offset` (pagination)
  - Response: List of `ActivityResponse` with 200 OK

- `GET /api/activities/{activityId}` - Get a specific activity
  - Response: `ActivityResponse` with 200 OK

### AI Service (port 8083)

- Consumes activity events from Kafka topic `activity-fitness`
- Processes activities through `ActivityMessageListener` for recommendations
- Stores activity data and recommendation data in MongoDB (`airecommendationfitness` database)
- Exposes recommendation endpoints (details to be documented)

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

## Service Communication

### Service Discovery
- Services register with Eureka Server on startup
- Services discover each other through Eureka for inter-service communication
- Environment variable `EUREKA_SERVER_URL` can override default Eureka location

### Inter-Service Messaging
- **Activity Service → AI Service**: Activity events are published to Kafka topic `activity-fitness`
- **AI Service Listener**: `ActivityMessageListener` consumes activity events for processing recommendations
- **Kafka Configuration**: 
  - activity-service acts as producer (sends activity events)
  - AI-Service acts as consumer (processes activity events in group `activity-process-group`)
  - Topic: `activity-fitness`
  - Serialization: JSON format with type headers disabled

## Kafka Topics

| Topic | Producer | Consumer(s) | Format | Purpose |
|-------|----------|------------|--------|---------|
| `activity-fitness` | activity-service | AI-Service | JSON (Activity model) | Publish activity events for AI recommendations |

## Configuration Notes

### YAML Configuration Standards
- MongoDB uses `host`, `port`, `database` format in this project
- Kafka properties use lowercase with hyphens (kebab-case): `key-deserializer`, `value-deserializer`
- Kafka consumer group IDs are service-specific to avoid message conflicts
- Jackson deserialization is configured to fail on unknown properties: `false` for flexibility

## Future Improvements to Consider

- Implement global exception handling with `@ControllerAdvice`
- Add password encryption (BCrypt) before storing user passwords
- Implement DTO mapping library (MapStruct or ModelMapper)
- Add API documentation (SpringDoc OpenAPI)
- Implement API Gateway (Spring Cloud Gateway)
- Add logging framework configuration (SLF4J/Logback)
- Implement authentication/authorization (Spring Security with JWT)
- Add circuit breaker pattern (Spring Cloud Circuit Breaker/Resilience4j)
- Add integration tests with Testcontainers
- Configure different profiles (dev, test, prod)
- Add distributed tracing (Spring Cloud Sleuth + Zipkin)
- Implement API rate limiting and throttling
- Add error handling for Kafka message processing (dead-letter topics)
