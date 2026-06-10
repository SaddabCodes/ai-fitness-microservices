# AI Fitness Microservices

A microservices-based AI fitness application built with Spring Boot 4.0.6 and Java 21.

## Services

- **EurekaServer** (Port 8761): Service discovery and registry
- **user-service** (Port 8080): User management (registration and profile retrieval)
- **activity-service** (Port 8081): Activity tracking with MongoDB support

## Tech Stack

- Java 21
- Spring Boot 4.0.6
- Spring Cloud Eureka
- PostgreSQL & MongoDB
- Lombok

## API Endpoints

### user-service
- `POST /api/users/register` - Register a new user
- `GET /api/users/{userId}` - Get user profile

### activity-service
- `POST /api/activities/track` - Track a new activity
- `GET /api/activities/user/{userId}` - Get user's activities
- `GET /api/activities/{activityId}` - Get specific activity

## Prerequisites

- Java 21
- PostgreSQL (port 5433)
- MongoDB (port 27017)


## Access Points
- Eureka Dashboard: http://localhost:8761
- user-service: http://localhost:8080
- activity-service: http://localhost:8081

## Project Structure
```
ai-fitness-microservices/
├── EurekaServer/
├── user-service/
├── activity-service/
├── CLAUDE.md
└── README.md
```

## Future Services
- Authentication Service
- Workout Planning Service
- Nutrition Tracking Service
- Progress Analytics Service
- AI Recommendations Service
- API Gateway

See [CLAUDE.md](./CLAUDE.md) for detailed development guidance.
