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
  - MongoDB (port 27017) - for activity-service and ai-service
- **ORM**: Spring Data JPA with Hibernate (PostgreSQL), Spring Data MongoDB (MongoDB)
- **Service Discovery**: Eureka Server (port 8761)
- **API Gateway**: Spring Cloud Gateway (port 8080)
- **Configuration Server**: Spring Cloud Config Server (port 8888)
- **Message Broker**: Apache Kafka (port 9092) - for inter-service communication
- **AI Integration**: Google Gemini API - for activity recommendations
- **Validation**: Jakarta Validation
- **Code Generation**: Lombok

## Project Structure

```
ai-fitness-microservices/
├── eureka-server/          # Service discovery server
│   ├── src/main/java/com/sadcodes/eurekaserver/
│   │   └── EurekaServerApplication.java
│   └── src/main/resources/
│       └── application.yaml  # Eureka server configuration (port 8761)
│
├── config-server/          # Centralized configuration server
│   ├── src/main/java/com/sadcodes/configserver/
│   │   └── ConfigServerApplication.java
│   └── src/main/resources/
│       ├── application.yaml  # Config server configuration (port 8888)
│       └── config/           # Centralized service configurations
│           ├── user-service.yml
│           ├── activity-service.yml
│           ├── ai-service.yml
│           └── api-gateway-service.yml
│
├── api-gateway/            # API Gateway service
│   ├── src/main/java/com/sadcodes/apigateway/
│   │   └── ApiGatewayApplication.java
│   └── src/main/resources/
│       └── application.yaml  # Gateway configuration (port 8080)
│
├── user-service/          # User management microservice (port 8081)
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
├── ai-service/            # AI recommendation service (port 8083)
│   ├── src/main/java/com/sadcodes/aiservice/
│   │   ├── model/         # MongoDB documents (Recommendation, Activity, ActivityType)
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── repositories/  # Spring Data MongoDB repositories
│   │   ├── services/      # Business logic layer (RecommendationService, ActivityAiService)
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
# Build any service (replace {service} with: api-gateway, user-service, activity-service, ai-service, config-server, or eureka-server)
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
cd eureka-server && ./mvnw spring-boot:run

# Start Config Server (centralized configuration)
cd config-server && ./mvnw spring-boot:run

# Start API Gateway (entry point for all services)
cd api-gateway && ./mvnw spring-boot:run

# Run user-service (loads config from config-server)
cd user-service && ./mvnw spring-boot:run

# Run activity-service (loads config from config-server)
cd activity-service && ./mvnw spring-boot:run

# Run ai-service (loads config from config-server)
cd ai-service && ./mvnw spring-boot:run

# Run with specific profile
cd {service} && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Note**: Services must be started in order:
1. Eureka Server (required for service discovery)
2. Config Server (required for centralized configuration)
3. Gateway (optional but recommended as entry point)
4. Individual microservices

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

### MongoDB (for activity-service and ai-service)

MongoDB is used for activity tracking and AI recommendations. Services use centralized configuration from Config Server:

**activity-service** (`config-server/src/main/resources/config/activity-service.yml`):
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/aiactivityfitness
      database: aiactivityfitness
```

**ai-service** (inherits MongoDB config from activity-service.yml):
- Uses same MongoDB connection for consistency
- Database: `aiactivityfitness`

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

### Config Server (port 8888)

- Dashboard: `http://localhost:8888`
- Provides centralized configuration for all microservices
- Configuration files stored in `config-server/src/main/resources/config/`

### API Gateway (port 8080)

- Entry point for all API requests
- Routes requests to appropriate microservices using load-balanced Eureka discovery
- Routes configured in `config-server/src/main/resources/config/api-gateway-service.yml`

**Gateway Routes:**
- `/api/users/**` → USER-SERVICE (port 8081)
- `/api/activities/**` → ACTIVITY-SERVICE (port 8082)
- `/api/recommendations/**` → AI-SERVICE (port 8083)

### User Service (port 8081)

- `POST /api/users/register` - Register a new user
  - Request: `RegisterRequest` (email, password, firstName, lastName)
  - Response: `UserResponse` with 201 Created

- `GET /api/users/{userId}` - Get user profile by ID
  - Response: `UserResponse` with 200 OK

### Activity Service (port 8082)

- `POST /api/activities/track` - Track a new activity
  - Request: `ActivityRequest` (userId, activityType, duration, calories, timestamp)
  - Response: `ActivityResponse` with 201 Created
  - Publishes activity event to Kafka topic `activity-events`

- `GET /api/activities/user/{userId}` - Get activities for a user
  - Query params: `limit`, `offset` (pagination)
  - Response: List of `ActivityResponse` with 200 OK

- `GET /api/activities/{activityId}` - Get a specific activity
  - Response: `ActivityResponse` with 200 OK

### AI Service (port 8083)

- Consumes activity events from Kafka topic `activity-events`
- Processes activities through `ActivityMessageListener` for AI-powered recommendations
- Uses Google Gemini API to generate personalized fitness recommendations
- Stores activity data and recommendation data in MongoDB (`aiactivityfitness` database)
- Recommendations are persisted using the `Recommendation` model

**Available Endpoints:**
- `GET /api/recommendations/user/{userId}` - Get recommendations for a user
- `POST /api/recommendations` - Create new recommendations (typically called by message listener)

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
- Gateway uses load balancing (`lb://SERVICE-NAME`) to route to registered services

### Centralized Configuration
- Config Server provides centralized configuration management
- Services pull configuration on startup via `spring.config.import` property
- Config files located in `config-server/src/main/resources/config/`
- Service-specific configurations:
  - `user-service.yml` - PostgreSQL connection, Eureka settings
  - `activity-service.yml` - MongoDB URI, Kafka topics, Eureka settings
  - `ai-service.yml` - Inherits activity-service config, additional AI settings
  - `api-gateway-service.yml` - Route definitions for all microservices

### Inter-Service Messaging
- **Activity Service → AI Service**: Activity events are published to Kafka topic `activity-events`
- **AI Service Listener**: `ActivityMessageListener` consumes activity events for processing recommendations via Google Gemini API
- **Kafka Configuration**: 
  - activity-service acts as producer (sends activity events)
  - ai-service acts as consumer (processes activity events in group `activity-process-group`)
  - Topic: `activity-events`
  - Serialization: JSON format with type headers disabled
  - Bootstrap servers: `localhost:9092`

### AI Integration
- **Service**: `ActivityMessageListener` (Kafka consumer)
- **AI Provider**: Google Gemini API
- **Process**: 
  1. Activity event received from `activity-events` topic
  2. Activity data formatted as prompt for Gemini API
  3. AI generates personalized fitness recommendations
  4. Recommendations persisted to MongoDB via `Recommendation` model
  5. `ActivityAiService` handles service-layer logic
- **Note**: Requires `GEMINI_API_KEY` environment variable

## Kafka Topics

| Topic | Producer | Consumer(s) | Format | Purpose |
|-------|----------|------------|--------|---------|
| `activity-events` | activity-service | ai-service | JSON (Activity model) | Publish activity events for AI recommendations |

## Configuration Notes

### YAML Configuration Standards
- MongoDB uses URI format in centralized config: `mongodb://host:port/database`
- Kafka properties use lowercase with hyphens (kebab-case): `key-serializer`, `value-serializer`
- Kafka consumer group IDs are service-specific to avoid message conflicts
- Jackson deserialization is configured to fail on unknown properties: `false` for flexibility
- Services import configuration from Config Server via: `spring.config.import: optional:configserver:http://localhost:8888`
- Gateway uses load balancing prefix `lb://` for dynamic service discovery: `uri: lb://SERVICE-NAME`

### Config Server
- Located at `config-server/src/main/resources/config/`
- Uses native profile to load YAML files from classpath
- Port: 8888
- All microservices pull configuration from this server on startup

## Completed Features

- ✅ API Gateway (Spring Cloud Gateway) - routes requests to microservices
- ✅ Centralized Configuration Server (Spring Cloud Config Server)
- ✅ Kafka messaging for inter-service communication
- ✅ Google Gemini AI integration for personalized recommendations
- ✅ MongoDB persistence for recommendations

## Future Improvements to Consider

- Implement global exception handling with `@ControllerAdvice`
- Add password encryption (BCrypt) before storing user passwords
- Implement DTO mapping library (MapStruct or ModelMapper)
- Add API documentation (SpringDoc OpenAPI)
- Add logging framework configuration (SLF4J/Logback)
- Implement authentication/authorization (Spring Security with JWT)
- Add circuit breaker pattern (Spring Cloud Circuit Breaker/Resilience4j)
- Add integration tests with Testcontainers
- Configure different profiles (dev, test, prod)
- Add distributed tracing (Spring Cloud Sleuth + Zipkin)
- Implement API rate limiting and throttling
- Add error handling for Kafka message processing (dead-letter topics)
- Add health checks and monitoring endpoints
- Implement API versioning strategy
