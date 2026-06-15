# AI Fitness Microservices

A microservices-based AI fitness application built with Spring Boot 4.0.6 and Java 21 with inter-service communication via Kafka.

## Services

- **eureka-server** (Port 8761): Service discovery and registry
- **user-service** (Port 8080): User management (registration and profile retrieval)
- **activity-service** (Port 8082): Activity tracking with MongoDB support
- **ai-service** (Port 8083): AI-powered recommendations with Kafka message processing

## Tech Stack

- Java 21
- Spring Boot 4.0.6
- Spring Cloud Eureka (Service Discovery)
- Apache Kafka (Inter-service messaging)
- PostgreSQL (user-service)
- MongoDB (activity-service & ai-service)
- Lombok
- Jakarta Validation

## API Endpoints

### user-service (http://localhost:8080)
- `POST /api/users/register` - Register a new user
  - Request: `RegisterRequest` (email, password, firstName, lastName)
  - Response: `UserResponse` with 201 Created

- `GET /api/users/{userId}` - Get user profile
  - Response: `UserResponse` with 200 OK

### activity-service (http://localhost:8082)
- `POST /api/activities/track` - Track a new activity
  - Request: `ActivityRequest` (userId, activityType, duration, calories, timestamp)
  - Response: `ActivityResponse` with 201 Created
  - Publishes activity event to Kafka topic `activity-fitness`

- `GET /api/activities/user/{userId}` - Get user's activities
  - Query params: `limit`, `offset` (pagination)
  - Response: List of `ActivityResponse` with 200 OK

- `GET /api/activities/{activityId}` - Get specific activity
  - Response: `ActivityResponse` with 200 OK

### ai-service (http://localhost:8083)
- Consumes activity events from Kafka topic `activity-fitness`
- Processes activities via `ActivityMessageListener` to get detailed AI recommendations from Gemini AI
- Parses structured AI responses (analysis, improvements, suggestions, safety)
- Stores generated recommendations in MongoDB (`airecommendationfitness` database)

## Prerequisites

- Java 21
- PostgreSQL (port 5433)
  - Database: `microservice_ai_fitness`
  - User: `postgres`
  - Password: `1234`
- MongoDB (port 27017)
- Apache Kafka (port 9092)

## Access Points
- Eureka Dashboard: http://localhost:8761
- user-service: http://localhost:8080
- activity-service: http://localhost:8082
- ai-service: http://localhost:8083

## Project Structure
```
ai-fitness-microservices/
├── eureka-server/              # Service discovery (port 8761)
├── user-service/              # User management (port 8080)
├── activity-service/          # Activity tracking (port 8082)
├── ai-service/                # AI recommendations (port 8083)
├── CLAUDE.md                  # Development guidance
└── README.md
```

## Kafka Topics

| Topic | Producer | Consumer(s) | Format | Purpose |
|-------|----------|------------|--------|---------|
| `activity-fitness` | activity-service | ai-service | JSON | Activity events for AI recommendations |

## Service Communication

- **Eureka**: All services register with Eureka for service discovery
- **Kafka**: activity-service publishes activity events; ai-service consumes them for recommendations
- **REST**: Services communicate via REST endpoints when needed

## Future Services
- Authentication Service
- Workout Planning Service
- Nutrition Tracking Service
- Progress Analytics Service
- API Gateway
